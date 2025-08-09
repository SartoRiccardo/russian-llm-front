import { createContext, useState, useEffect, useCallback } from 'react';
import {
  checkLoginStatus as apiCheckLoginStatus,
  login as apiLogin,
  logout as apiLogout,
} from '../../services/russian-llm-api';
import type {
  ICheckLoginStatusResponse,
  ILoginResponse,
} from '../../types/main';

interface IAuthContext {
  username: string | null;
  isLoading: boolean;
  isLoggedIn: boolean;
  isSlowNetwork: boolean;
  sessionExpire: number;
  sessionExpireMs: number;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
}

export const AuthContext = createContext<IAuthContext | null>(null);

interface AuthProviderProps {
  children: React.ReactNode;
}

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [username, setUsername] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);
  const [isSlowNetwork, setIsSlowNetwork] = useState<boolean>(false);
  const [sessionExpire, setSessionExpire] = useState<number>(0);

  useEffect(() => {
    const handleLogin = async () => {
      const sessionExpireFromStorage = localStorage.getItem('sessionExpire');
      if (!sessionExpireFromStorage) return;

      setIsLoading(true);
      const sessionExpireInt = parseInt(sessionExpireFromStorage, 10);
      if (sessionExpireInt > Date.now()) {
        try {
          const { username, sessionExpire } = await apiCheckLoginStatus();
          setUsername(username);
          setSessionExpire(sessionExpire);
          setIsLoggedIn(true);
        } catch (error) {
          // Unauthorized or other error
          localStorage.removeItem('sessionExpire');
          setIsLoggedIn(false);
        }
      } else {
        localStorage.removeItem('sessionExpire');
        setIsLoggedIn(false);
      }
      setIsLoading(false);
    };

    let retryTimeout: ReturnType<typeof setTimeout>;
    let slowNetworkTimeout: ReturnType<typeof setTimeout>;

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

    slowNetworkTimeout = setTimeout(() => {
      setIsSlowNetwork(true);
    }, 10000);

    tryLogin();

    return () => {
      clearTimeout(retryTimeout);
      clearTimeout(slowNetworkTimeout);
    };
  }, []);

  const login = async (email: string, password: string) => {
    setIsLoading(true);
    try {
      const { sessionExpire } = (await apiLogin(
        email,
        password,
      )) as ILoginResponse;
      localStorage.setItem('sessionExpire', sessionExpire.toString());
      setSessionExpire(sessionExpire);
      setUsername('testuser'); // In a real app, the username would come from the API
      setIsLoggedIn(true);
    } catch (error) {
      setIsLoggedIn(false);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    setIsLoading(true);
    try {
      await apiLogout();
    } finally {
      localStorage.removeItem('sessionExpire');
      setUsername(null);
      setIsLoggedIn(false);
      setSessionExpire(0);
      setIsLoading(false);
    }
  };

  const contextValue = {
    username,
    isLoading,
    isLoggedIn,
    isSlowNetwork,
    sessionExpire: Math.floor((sessionExpire - Date.now()) / 1000),
    sessionExpireMs: sessionExpire - Date.now(),
    login,
    logout,
  };

  return (
    <AuthContext.Provider value={contextValue}>{children}</AuthContext.Provider>
  );
};
