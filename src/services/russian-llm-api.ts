import type { IAuthnSuccessResponse, IStatsResponse } from '@/types/main';
import type { IExercisesApiResponse } from '@/types/exercises';
import type { IWordsResponse } from '@/types/words';
import {
  ValidationError,
  ServerError,
  InvalidTokenError,
  UnauthorizedError,
} from '@/types/errors';
import fetchMock from 'fetch-mock';

interface IFetchMockBody {
  body: string; // JSON-serialized
  method: 'POST' | 'PUT' | 'DELETE' | 'GET' | 'OPTIONS' | 'PATCH';
}

type RequestedUrl = string;

interface IFetchMockParams {
  args: [RequestedUrl, IFetchMockBody];
}

export const checkLoginStatus = async (): Promise<IAuthnSuccessResponse> => {
  const response = await fetch(
    `${import.meta.env.VITE_API_BASE_URL}/check-login-status`,
  );

  if (response.status === 401) {
    throw new UnauthorizedError();
  }
  if (response.status >= 500) {
    throw new ServerError('Server error while checking login status');
  }
  return await response.json();
};

export const login = async (
  email: string,
  password: string,
): Promise<IAuthnSuccessResponse> => {
  const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/login`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ email, password }),
  });

  if (response.status === 422) {
    throw new ValidationError('Invalid credentials');
  }
  if (response.status >= 500) {
    throw new ServerError('Server error during login');
  }
  return await response.json();
};

export const logout = async (): Promise<void> => {
  const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/logout`);

  if (response.status >= 500) {
    throw new ServerError('Server error during logout');
  }
};

export const sendPasswordResetEmail = async (values: {
  email: string;
}): Promise<void> => {
  const response = await fetch(
    `${import.meta.env.VITE_API_BASE_URL}/forgot-password`,
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(values),
    },
  );

  if (response.status === 422) {
    throw new ValidationError('That email has some issues');
  }
  if (response.status >= 500) {
    throw new ServerError('Server error');
  }
};

export const validatePasswordResetToken = async (
  token: string,
): Promise<void> => {
  const response = await fetch(
    `${import.meta.env.VITE_API_BASE_URL}/validate-token?token=${token}`,
  );

  if (response.status === 422) {
    throw new ValidationError('This token is invalid or expired');
  }
  if (response.status >= 500) {
    throw new ServerError('Server error while validating token');
  }
};

export const resetPassword = async (values: {
  token: string;
  password: string;
}): Promise<void> => {
  const response = await fetch(
    `${import.meta.env.VITE_API_BASE_URL}/password-reset`,
    {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(values),
    },
  );

  if (response.status === 422) {
    const errorBody = await response.json();
    if (errorBody.token) {
      throw new InvalidTokenError();
    }
    throw new ValidationError('There was something wrong with the password');
  }
  if (response.status >= 500) {
    throw new ServerError('Server Error');
  }
};

export const getExercises = async (
  signal?: AbortSignal,
): Promise<IExercisesApiResponse> => {
  const response = await fetch(
    `${import.meta.env.VITE_API_BASE_URL}/exercises`,
    { signal },
  );
  if (response.status === 401) {
    throw new UnauthorizedError();
  }
  if (response.status >= 500) {
    throw new ServerError('Server error while fetching exercises');
  }
  return await response.json();
};

export const getStats = async (
  signal?: AbortSignal,
): Promise<IStatsResponse> => {
  const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/stats`, {
    signal,
  });
  if (response.status === 401) {
    throw new UnauthorizedError();
  }
  if (response.status >= 500) {
    throw new ServerError('Server error while fetching stats');
  }
  return await response.json();
};

export const getWords = async (
  page: number,
  signal?: AbortSignal,
): Promise<IWordsResponse> => {
  const response = await fetch(
    `${import.meta.env.VITE_API_BASE_URL}/words?page=${page}`,
    { signal },
  );
  if (response.status === 401) {
    throw new UnauthorizedError();
  }
  if (response.status >= 500) {
    throw new ServerError('Server error while fetching words');
  }
  return await response.json();
};
