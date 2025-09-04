import type { IAuthnSuccessResponse, IStatsResponse } from '@/types/main';
import type { IExercisesApiResponse } from '@/types/exercises';
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

  fetchMock.route(
    `${import.meta.env.VITE_API_BASE_URL}/exercises`,
    {
      body: {
        types: [
          {
            id: 'alphabet',
            name: 'Alphabet',
            description: 'Learn the cyrillic alphabet.',
          },
          {
            id: 'grammar',
            name: 'Grammar',
            description: 'Master Russian grammar.',
          },
        ],
        exercises: [
          {
            id: '1',
            name: 'Cyrillic Basics',
            description: 'Vowels and basic consonants',
            type: 'alphabet',
            mastery: 4,
            locked: false,
            sort_order: 1,
          },
          {
            id: '2',
            name: 'Advanced Consonants',
            description: 'Hard and soft consonants',
            type: 'alphabet',
            mastery: 2,
            locked: false,
            sort_order: 2,
          },
          {
            id: '3',
            name: 'Introduction to Cases',
            description: 'Learn the 6 cases.',
            type: 'grammar',
            mastery: 0,
            locked: false,
            sort_order: 1,
          },
          {
            id: '4',
            name: 'Verbs of Motion',
            description: 'Going, walking, running.',
            type: 'grammar',
            mastery: 0,
            locked: true,
            sort_order: 2,
          },
        ],
      },
    },
    { delay: 500 },
  );

  fetchMock.route(
    `${import.meta.env.VITE_API_BASE_URL}/stats`,
    {
      status: 200,
      body: {
        language_skills: [
          { id: 'reading', mastery: 'B1' },
          { id: 'speaking', mastery: 'A2' },
          { id: 'listening', mastery: 'B2' },
          { id: 'writing', mastery: 'A1' },
        ],
        word_skills: [
          {
            id: 'verbs',
            mastery: 3,
            subcategories: [
              {
                id: 'present-tense',
                mastery: 4,
                rules: [
                  {
                    id: 1,
                    rule: 'For -ать verbs, drop -ть and add endings: -ю, -ешь, -ет, -ем, -ете, -ют.',
                  },
                  {
                    id: 2,
                    rule: 'For -ить verbs, drop -ить and add endings: -ю, -ишь, -ит, -им, -ите, -ят.',
                  },
                ],
              },
              {
                id: 'past-tense',
                mastery: 3,
                rules: [
                  {
                    id: 3,
                    rule: 'To form the past tense, replace the infinitive ending with -л (masculine), -ла (feminine), -ло (neuter), or -ли (plural).',
                  },
                ],
              },
            ],
          },
          {
            id: 'nouns',
            mastery: 2,
            subcategories: [
              {
                id: 'nominative',
                mastery: 4,
                rules: [
                  {
                    id: 4,
                    rule: 'The nominative case is the dictionary form of the noun, used for the subject of a sentence.',
                  },
                ],
              },
              {
                id: 'genitive',
                mastery: 2,
                rules: [
                  {
                    id: 5,
                    rule: "The genitive case is used to show possession, quantity, or absence. Replaces 'of' in English.",
                  },
                ],
              },
              {
                id: 'accusative',
                mastery: 1,
                rules: [
                  {
                    id: 6,
                    rule: 'The accusative case is used for the direct object of a transitive verb.',
                  },
                ],
              },
            ],
          },
          {
            id: 'adjectives',
            mastery: 1,
            subcategories: [
              {
                id: 'gender-agreement',
                mastery: 1,
                rules: [
                  {
                    id: 7,
                    rule: 'Adjectives must agree in gender, number, and case with the noun they modify.',
                  },
                ],
              },
            ],
          },
        ],
      },
    },
    { delay: 500 },
  );
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
