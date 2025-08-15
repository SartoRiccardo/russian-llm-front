import { useAuth } from '@/hooks/useAuth';
import { useNavigate, Link } from 'react-router';
import { useToast } from '@/hooks/useToast';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { ApiError, ValidationError, ServerError } from '../types/errors';

/**
 * The login page component.
 * Allows users to log in with test credentials and handles authentication state.
 */
const LoginPage = () => {
  const { login } = useAuth();
  const { createToast } = useToast();
  const navigate = useNavigate();

  const validationSchema = Yup.object({
    email: Yup.string()
      .email('Invalid email address')
      .required('Email is required'),
    password: Yup.string().required('Password is required'),
  });

  const handleSubmit = async (
    values: { email: string; password: string },
    { setSubmitting }: { setSubmitting: (isSubmitting: boolean) => void },
  ) => {
    try {
      await login(values.email, values.password);
      navigate('/');
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
        title: 'Authentication Error',
        content: errorMessage,
        dataCy: 'wrong-credentials',
      });
    }
    setSubmitting(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="max-w-md w-full bg-white p-8 rounded-lg shadow-md">
        <h2 className="text-2xl font-bold text-center mb-6">Login</h2>
        <p className="text-center text-gray-600 mb-6">
          Use email: <strong>test@test.com</strong> and password:{' '}
          <strong>password</strong>
        </p>
        <Formik
          initialValues={{ email: '', password: '' }}
          validationSchema={validationSchema}
          onSubmit={handleSubmit}
        >
          {({ isSubmitting }) => (
            <Form data-cy="f-login">
              <div className="mb-4">
                <label htmlFor="email" className="block text-gray-700">
                  Email
                </label>
                <Field
                  type="email"
                  id="email"
                  name="email"
                  disabled={isSubmitting}
                  className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                />
                <ErrorMessage
                  name="email"
                  component="div"
                  className="text-red-500 text-sm mt-1"
                />
              </div>
              <div className="mb-6">
                <label htmlFor="password" className="block text-gray-700">
                  Password
                </label>
                <Field
                  type="password"
                  id="password"
                  name="password"
                  disabled={isSubmitting}
                  className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                />
                <ErrorMessage
                  name="password"
                  component="div"
                  className="text-red-500 text-sm mt-1"
                />
              </div>
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
              >
                {isSubmitting ? 'Logging in...' : 'Login'}
              </button>
            </Form>
          )}
        </Formik>
        <div className="text-center mt-4">
          <Link
            to="/forgot-password"
            className="text-sm text-blue-500 hover:underline"
            data-cy="forgot-password"
          >
            Forgot password?
          </Link>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
