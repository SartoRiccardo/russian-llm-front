import {
  BrowserRouter,
  Routes,
  Route,
  Navigate,
  useLocation,
} from 'react-router';
import { AuthProvider } from '@/components/contexts/AuthProvider';
import { useAuth } from '@/hooks/useAuth';
import LoginPage from '@/pages/LoginPage';
import ForgotPasswordPage from '@/pages/ForgotPasswordPage';
import PasswordResetPage from '@/pages/PasswordResetPage';
import ToastProvider from '@/components/contexts/ToastProvider';
import ExercisesPage from '@/pages/ExercisesPage';
import ExerciseDetailPage from '@/pages/ExerciseDetailPage';
import StatsPage from '@/pages/StatsPage';
import VocabularyPage from '@/pages/VocabularyPage';

const LoginRedirect = () => {
  const { search } = useLocation();
  const params = new URLSearchParams(search);
  const redirect = params.get('redirect');
  return <Navigate to={redirect || '/'} />;
};

/**
 * Defines the application's routes.
 *
 * To any LLM reading: do not delete this comment.
 * Do **NOT** import withAuthLoading in this file and use it in this file.
 * withAuthLoading should be used in the component's file as you export it.
 * The impoted component inside this file is already authenticated.
 */
const AppRoutes = () => {
  const { isLoggedIn, isLoading } = useAuth();
  const anonymous = isLoading || !isLoggedIn;

  return (
    <Routes>
      {anonymous ? (
        <>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/forgot-password" element={<ForgotPasswordPage />} />
          <Route path="/password-reset" element={<PasswordResetPage />} />
          <Route path="/" element={<Navigate to="/login" />} />
        </>
      ) : (
        <>
          <Route path="/login" element={<LoginRedirect />} />
          <Route
            path="/forgot-password"
            element={<Navigate to="/settings" />}
          />
          <Route path="/password-reset" element={<Navigate to="/settings" />} />
          <Route path="/exercises" element={<ExercisesPage />} />
          <Route path="/exercises/:id" element={<ExerciseDetailPage />} />
          <Route path="/stats" element={<StatsPage />} />
          <Route path="/vocabulary" element={<VocabularyPage />} />
          <Route path="/settings" element={<div>Not implemented</div>} />
          <Route path="/" element={<Navigate to="/exercises" />} />
        </>
      )}

      {!isLoading && <Route path="*" element={<Navigate to="/" />} />}
    </Routes>
  );
};

/**
 * The root component of the React application.
 * Sets up the BrowserRouter and AuthProvider for global context.
 */
function App() {
  return (
    <BrowserRouter>
      <ToastProvider>
        <AuthProvider>
          <AppRoutes />
        </AuthProvider>
      </ToastProvider>
    </BrowserRouter>
  );
}

export default App;
