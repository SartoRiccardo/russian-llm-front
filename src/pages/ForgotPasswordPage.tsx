import { useState } from 'react';
import { Link } from 'react-router';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { useToast } from '../hooks/useToast';
import { sendPasswordResetEmail } from '../services/russian-llm-api';
import { ApiError, ValidationError, ServerError } from '../types/errors';

const ForgotPasswordPage = () => {
  const { createToast } = useToast();
  const [isSubmitted, setIsSubmitted] = useState(false);

  const validationSchema = Yup.object({
    email: Yup.string().email('Invalid email address').required('Required'),
  });

  const handleSubmit = async (
    values: { email: string },
    { setSubmitting }: { setSubmitting: (isSubmitting: boolean) => void },
  ) => {
    try {
      await sendPasswordResetEmail(values);
      setIsSubmitted(true);
    } catch (error) {
      let errorMessage = 'An unexpected error occurred.';
      if (error instanceof ValidationError) {
        errorMessage = error.message;
      } else if (error instanceof ServerError) {
        errorMessage = 'Server error';
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

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="max-w-md w-full bg-white p-8 rounded-lg shadow-md">
        <h2 className="text-2xl font-bold text-center mb-6">Forgot Password</h2>
        {isSubmitted ? (
          <div className="text-center">
            <p>
              If the email exists, you will receive instructions on how to reset
              the password.
            </p>
            <Link
              to="/login"
              className="mt-4 inline-block bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
            >
              Login
            </Link>
          </div>
        ) : (
          <Formik
            initialValues={{ email: '' }}
            validationSchema={validationSchema}
            onSubmit={handleSubmit}
          >
            {({ isSubmitting }) => (
              <Form data-cy="f-forgot-password">
                <div className="mb-4">
                  <label htmlFor="email" className="block text-gray-700">
                    Email Address
                  </label>
                  <Field
                    type="email"
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
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                >
                  {isSubmitting ? 'Submitting...' : 'Submit'}
                </button>
              </Form>
            )}
          </Formik>
        )}
      </div>
    </div>
  );
};

export default ForgotPasswordPage;
