import type { IAuthnSuccessResponse } from '@/types/main';
import {
  ApiError,
  ValidationError,
  ServerError,
  NetworkError,
} from '@/types/errors';

export const checkLoginStatus = async (): Promise<IAuthnSuccessResponse> => {
  // Mock API call
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      if (Math.random() > 0.8) {
        reject(new NetworkError('Network Error'));
      } else {
        const sessionExpire = localStorage.getItem('sessionExpire');
        if (sessionExpire && parseInt(sessionExpire, 10) > Date.now()) {
          resolve({
            username: 'testuser',
            sessionExpire: Date.now() + 3600 * 1000,
          });
        } else {
          reject(new ApiError('Unauthorized'));
        }
      }
    }, 1000);
  });
};

export const login = async (
  email: string,
  password: string,
): Promise<IAuthnSuccessResponse> => {
  // Mock API call
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      if (email === 'test@test.com' && password === 'password') {
        resolve({
          username: 'testuser',
          sessionExpire: Date.now() + 3600 * 1000,
        });
      } else {
        reject(new ValidationError('Invalid credentials'));
      }
    }, 1000);
  });
};

export const logout = async (): Promise<void> => {
  // Mock API call
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve();
    }, 500);
  });
};

export const sendPasswordResetEmail = async (values: {
  email: string;
}): Promise<void> => {
  const mockFetch = async (_input: RequestInfo, init?: RequestInit) => {
    const { email } = JSON.parse(init?.body as string);
    if (email.includes('422')) {
      return new Response(JSON.stringify({}), { status: 422 });
    }
    if (email.includes('500')) {
      return new Response(JSON.stringify({}), { status: 500 });
    }
    return new Response(JSON.stringify({}), { status: 204 });
  };

  const response = await mockFetch('http://localhost:8000/forgot-password', {
    method: 'POST',
    body: JSON.stringify(values),
  });

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
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const mockFetch = async (_input: RequestInfo, _init?: RequestInit) => {
    if (token === 'valid-token') {
      return new Response(JSON.stringify({}), { status: 204 });
    }
    return new Response(JSON.stringify({}), { status: 422 });
  };

  const response = await mockFetch('http://localhost:8000/validate-token');

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
  const mockFetch = async (_input: RequestInfo, init?: RequestInit) => {
    const { password } = JSON.parse(init?.body as string);
    if (password.includes('422')) {
      return new Response(JSON.stringify({}), { status: 422 });
    }
    if (password.includes('500')) {
      return new Response(JSON.stringify({}), { status: 500 });
    }
    return new Response(JSON.stringify({}), { status: 204 });
  };

  const response = await mockFetch('http://localhost:8000/password-reset', {
    method: 'PUT',
    body: JSON.stringify(values),
  });

  if (response.status === 422) {
    throw new ValidationError('There was something wrong with the password');
  }
  if (response.status >= 500) {
    throw new ServerError('Server Error');
  }
};
