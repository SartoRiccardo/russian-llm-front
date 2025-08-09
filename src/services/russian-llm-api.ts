
import type { ICheckLoginStatusResponse } from '@/types/main';

export const checkLoginStatus = async (): Promise<ICheckLoginStatusResponse> => {
  // Mock API call
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      if (Math.random() > 0.8) {
        reject(new Error('NetworkError'));
      } else {
        const sessionExpire = localStorage.getItem('sessionExpire');
        if (sessionExpire && parseInt(sessionExpire, 10) > Date.now()) {
          resolve({ username: 'testuser', sessionExpire: Date.now() + 3600 * 1000 });
        } else {
          reject(new Error('Unauthorized'));
        }
      }
    }, 1000);
  });
};

export const login = async (email: string, password: string): Promise<ICheckLoginStatusResponse> => {
  // Mock API call
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      if (email === 'test@test.com' && password === 'password') {
        resolve({ username: 'testuser', sessionExpire: Date.now() + 3600 * 1000 });
      } else {
        reject(new Error('Invalid credentials'));
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
