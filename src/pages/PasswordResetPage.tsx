import { useState, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { useToast } from '../hooks/useToast';
import {
  validatePasswordResetToken,
  resetPassword,
} from '../services/russian-llm-api';
import { ApiError, ValidationError, ServerError } from '../types/errors';

type TokenState = 'validating' | 'valid' | 'invalid';

const PasswordResetPage = () => {
  const { createToast } = useToast();
  const [searchParams] = useSearchParams();
  const [tokenState, setTokenState] = useState<TokenState>('validating');
  const [isSubmitted, setIsSubmitted] = useState(false);
  const token = searchParams.get('token');

  useEffect(() => {
    if (!token) {
      setTokenState('invalid');
      return;
    }

    const validateToken = async () => {
      try {
        await validatePasswordResetToken(token);
        setTokenState('valid');
      } catch (error) {
        let errorMessage = 'An unexpected error occurred.';
        if (error instanceof ValidationError) {
          errorMessage = error.message;
        } else if (error instanceof ServerError) {
          errorMessage = 'Server error while validating token';
        } else if (error instanceof ApiError) {
          errorMessage = error.message;
        }
        createToast({
          type: 'ERROR',
          content: errorMessage,
        });
        setTokenState('invalid');
      }
    };

    validateToken();
  }, [token, createToast]);

  const validationSchema = Yup.object({
    password: Yup.string()
      .min(8, 'Password must be at least 8 characters')
      .test(
        'has-uppercase',
        'Password must contain at least one uppercase letter',
        (value) => Boolean(value && /[A-Z]/.test(value)),
      )
      .test(
        'has-lowercase',
        'Password must contain at least one lowercase letter',
        (value) => Boolean(value && /[a-z]/.test(value)),
      )
      .test('has-digit', 'Password must contain at least one number', (value) =>
        Boolean(value && /\d/.test(value)),
      )
      .test(
        'has-special-char',
        'Password must contain at least one special character',
        (value) => Boolean(value && /[^a-zA-Z0-9]/.test(value)),
      )
      .required('Required'),
    repeatPassword: Yup.string()
      .oneOf([Yup.ref('password')], 'Passwords must match')
      .required('Required'),
  });

  const handleSubmit = async (
    values: { password: string; repeatPassword: string },
    { setSubmitting }: { setSubmitting: (isSubmitting: boolean) => void },
  ) => {
    if (!token) return;
    try {
      await resetPassword({
        token,
        password: values.password,
      });
      setIsSubmitted(true);
    } catch (error) {
      let errorMessage = 'An unexpected error occurred.';
      if (error instanceof ValidationError) {
        errorMessage = error.message;
      } else if (error instanceof ServerError) {
        errorMessage = 'Server Error';
      } else if (error instanceof ApiError) {
        errorMessage = error.message;
      }
      createToast({
        type: 'ERROR',
        content: errorMessage,
      });
    }
    setSubmitting(false);
  };

  if (tokenState === 'validating') {
    return <div>Loading...</div>;
  }

  if (tokenState === 'invalid') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="max-w-md w-full bg-white p-8 rounded-lg shadow-md text-center">
          <p>This token is invalid or expired</p>
          <Link
            to="/login"
            className="mt-4 inline-block bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
          >
            Login
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="max-w-md w-full bg-white p-8 rounded-lg shadow-md">
        <h2 className="text-2xl font-bold text-center mb-6">Reset Password</h2>
        {isSubmitted ? (
          <div className="text-center">
            <p>Your password has been changed!</p>
            <Link
              to="/login"
              className="mt-4 inline-block bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
            >
              Login
            </Link>
          </div>
        ) : (
          <Formik
            initialValues={{ password: '', repeatPassword: '' }}
            validationSchema={validationSchema}
            onSubmit={handleSubmit}
          >
            {({ isSubmitting }) => (
              <Form data-cy="f-password-reset">
                <div className="mb-4">
                  <label htmlFor="password" className="block text-gray-700">
                    Password
                  </label>
                  <Field
                    type="password"
                    name="password"
                    className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  />
                  <ErrorMessage
                    name="password"
                    component="div"
                    className="text-red-500 text-sm mt-1"
                  />
                </div>
                <div className="mb-4">
                  <label
                    htmlFor="repeatPassword"
                    className="block text-gray-700"
                  >
                    Repeat Password
                  </label>
                  <Field
                    type="password"
                    name="repeatPassword"
                    className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  />
                  <ErrorMessage
                    name="repeatPassword"
                    component="div"
                    className="text-red-500 text-sm mt-1"
                  />
                </div>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                >
                  {isSubmitting ? 'Submitting...' : 'Reset Password'}
                </button>
              </Form>
            )}
          </Formik>
        )}
      </div>
    </div>
  );
};

export default PasswordResetPage;
