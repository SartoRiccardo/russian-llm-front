import { useState, useEffect, useCallback, useRef } from 'react';
import { useNavigate } from 'react-router';
import {
  checkLoginStatus as apiCheckLoginStatus,
  login as apiLogin,
  logout as apiLogout,
} from '@/services/russian-llm-api';
import type {
  IAuthnSuccessResponse,
  AuthProviderProps,
  IUserData,
} from '@/types/main';
import { AuthContext } from './contexts';
import { flushSync } from 'react-dom';

const SESSION_EXPIRE_KEY = 'sessionExpire';

/**
 * Provides authentication context to the application.
 * Manages user login status, session expiration, and authentication-related operations.
 */
export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [userData, setUserData] = useState<IUserData | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isSlowNetwork, setIsSlowNetwork] = useState<boolean>(false);
  const navigate = useNavigate();
  const latestFetchId = useRef(-1);

  const isLoggedIn = !!userData && userData.sessionExpire > Date.now();

  const handleLogin = useCallback(async () => {
    const sessionExpireFromStorage = localStorage.getItem(SESSION_EXPIRE_KEY);
    if (sessionExpireFromStorage) {
      setIsLoading(true);
      const sessionExpireInt = parseInt(sessionExpireFromStorage, 10);
      if (sessionExpireInt > Date.now()) {
        try {
          const response =
            (await apiCheckLoginStatus()) as IAuthnSuccessResponse;
          setUserData({
            username: response.username,
            sessionExpire: response.sessionExpire,
          });
        } catch (error) {
          // Unauthorized or other error
          // Only delete sessionExpire if it's a 4xx error, not network error
          if (
            error instanceof Error &&
            !error.message.includes('NetworkError')
          ) {
            localStorage.removeItem(SESSION_EXPIRE_KEY);
          }
          setUserData(null);
        }
      } else {
        localStorage.removeItem(SESSION_EXPIRE_KEY);
        setUserData(null);
      }
    }

    setIsLoading(false);
  }, []);

  useEffect(() => {
    let retryTimeout: ReturnType<typeof setTimeout>;

    const slowNetworkTimeout = setTimeout(() => {
      setIsSlowNetwork(true);
    }, 10000);

    const tryLogin = async () => {
      try {
        await handleLogin();
        setIsSlowNetwork(false);
        clearTimeout(slowNetworkTimeout);
      } catch (error) {
        if (error instanceof Error && error.message.includes('NetworkError')) {
          retryTimeout = setTimeout(tryLogin, 2000);
        }
      }
    };

    tryLogin();

    return () => {
      clearTimeout(retryTimeout);
      clearTimeout(slowNetworkTimeout);
    };
  }, [handleLogin]);

  const login = async (
    email: string,
    password: string,
    redirect: string | null = null,
  ) => {
    const fetchId = Math.random();
    latestFetchId.current = fetchId;

    setIsLoading(true);
    try {
      const response = await apiLogin(email, password);
      if (latestFetchId.current !== fetchId) return;

      localStorage.setItem(
        SESSION_EXPIRE_KEY,
        response.sessionExpire.toString(),
      );
      if (redirect) {
        flushSync(() =>
          setUserData({
            username: response.username,
            sessionExpire: response.sessionExpire,
          }),
        );
        navigate(redirect);
      } else {
        setUserData({
          username: response.username,
          sessionExpire: response.sessionExpire,
        });
      }
    } catch (error) {
      if (latestFetchId.current !== fetchId) return;

      setUserData(null);
      throw error;
    } finally {
      if (latestFetchId.current !== fetchId) return;

      setIsLoading(false);
    }
  };

  const logout = async (redirect?: string) => {
    const fetchId = Math.random();
    latestFetchId.current = fetchId;

    setIsLoading(true);
    try {
      await apiLogout();
    } finally {
      if (latestFetchId.current !== fetchId) return;

      localStorage.removeItem(SESSION_EXPIRE_KEY);

      if (redirect) {
        flushSync(() => {
          setUserData(null);
          setIsLoading(false);
        });
        navigate(`/login?redirect=${encodeURIComponent(redirect)}`);
      } else {
        setUserData(null);
        setIsLoading(false);
      }
    }
  };

  const contextValue = {
    userData,
    isLoading,
    isLoggedIn,
    isSlowNetwork,
    sessionExpire: userData
      ? Math.floor((userData.sessionExpire - Date.now()) / 1000)
      : 0,
    sessionExpireMs: userData ? userData.sessionExpire - Date.now() : 0,
    login,
    logout,
  };

  return (
    <AuthContext.Provider value={contextValue}>{children}</AuthContext.Provider>
  );
};
