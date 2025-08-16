import type { IAuthnSuccessResponse } from '@/types/main';
import {
  ApiError,
  ValidationError,
  ServerError,
  // NetworkError, // Removed as it's not directly used here anymore
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

if (process.env.NODE_ENV === 'development') {
  fetchMock.mockGlobal().route(
    `${import.meta.env.VITE_API_BASE_URL}/login`,
    async (url: IFetchMockParams) => {
      const { email: reqEmail, password: reqPassword } = JSON.parse(
        url.args[1].body,
      );
      if (reqEmail === 'test@test.com' && reqPassword === 'password') {
        return {
          status: 200,
          body: {
            username: 'testuser',
            sessionExpire: Date.now() + 3600 * 1000,
          },
        };
      } else {
        return {
          status: 422,
          body: {}, // Empty body as per current mock
        };
      }
    },
    { delay: 500 }, // Add delay to simulate network latency for testing loading states
  );

  fetchMock.route(
    `${import.meta.env.VITE_API_BASE_URL}/check-login-status`,
    async () => {
      const sessionExpire = localStorage.getItem('sessionExpire');
      if (sessionExpire && parseInt(sessionExpire, 10) > Date.now()) {
        return {
          status: 200,
          body: {
            username: 'testuser',
            sessionExpire: Date.now() + 3600 * 1000,
          },
        };
      } else {
        return {
          status: 401,
          body: {},
        };
      }
    },
    { delay: 500 },
  );

  fetchMock.route(
    `${import.meta.env.VITE_API_BASE_URL}/logout`,
    async () => {
      return {
        status: 204,
      };
    },
    { delay: 500 },
  );

  fetchMock.route(
    `${import.meta.env.VITE_API_BASE_URL}/forgot-password`,
    async (url: IFetchMockParams) => {
      const { email } = JSON.parse(url.args[1].body);
      if (email.includes('422')) {
        return {
          status: 422,
          body: {},
        };
      }
      if (email.includes('500')) {
        return {
          status: 500,
          body: {},
        };
      }
      return {
        status: 204,
      };
    },
    { delay: 500 },
  );

  fetchMock.route(
    new RegExp(`${import.meta.env.VITE_API_BASE_URL}/validate-token.*`),
    async (url: IFetchMockParams) => {
      const urlObj = new URL(url.args[0]);
      const token = urlObj.searchParams.get('token');
      if (token === 'valid-token') {
        return {
          status: 204,
        };
      }
      return {
        status: 422,
        body: {},
      };
    },
    { delay: 500 },
  );

  fetchMock.route(
    `${import.meta.env.VITE_API_BASE_URL}/password-reset`,
    async (url: IFetchMockParams) => {
      const { password } = JSON.parse(url.args[1].body);
      if (password.includes('422')) {
        return {
          status: 422,
          body: {},
        };
      }
      if (password.includes('500')) {
        return {
          status: 500,
          body: {},
        };
      }
      return {
        status: 204,
      };
    },
    { delay: 500 },
  );
}

export const checkLoginStatus = async (): Promise<IAuthnSuccessResponse> => {
  const response = await fetch(
    `${import.meta.env.VITE_API_BASE_URL}/check-login-status`,
  );

  if (response.status === 401) {
    throw new ApiError('Unauthorized');
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
      body: JSON.stringify(values),
    },
  );

  if (response.status === 422) {
    throw new ValidationError('There was something wrong with the password');
  }
  if (response.status >= 500) {
    throw new ServerError('Server Error');
  }
};
