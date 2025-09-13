import { BrowserRouter, Routes, Route, Navigate } from 'react-router';
import { AuthProvider } from '@/components/contexts/AuthProvider';
import { useAuth } from '@/hooks/useAuth';
import LoginPage from '@/pages/LoginPage';
import ForgotPasswordPage from '@/pages/ForgotPasswordPage';
import PasswordResetPage from '@/pages/PasswordResetPage';
import ToastProvider from '@/components/contexts/ToastProvider';
import ExercisesPage from '@/pages/ExercisesPage';
import ExerciseDetailPage from '@/pages/ExerciseDetailPage';
import StatsContextRoute from '@/components/contexts/route-groups/StatsContextRoute';
import StatsPage from '@/pages/StatsPage';
import VocabularyPage from '@/pages/VocabularyPage';

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
  const anonymous = !isLoading && !isLoggedIn;

  return (
    <Routes>
      {anonymous ? (
        <>
          <Route path="/" element={<Navigate to="/login" />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/forgot-password" element={<ForgotPasswordPage />} />
          <Route path="/password-reset" element={<PasswordResetPage />} />
        </>
      ) : (
        <>
          <Route path="/" element={<Navigate to="/exercises" />} />
          <Route
            path="/forgot-password"
            element={<Navigate to="/settings" />}
          />
          <Route path="/password-reset" element={<Navigate to="/settings" />} />
          <Route path="/exercises" element={<ExercisesPage />} />
          <Route path="/exercises/:id" element={<ExerciseDetailPage />} />
          <Route element={<StatsContextRoute />}>
            <Route path="/stats" element={<StatsPage />} />
            <Route path="/vocabulary" element={<VocabularyPage />} />
          </Route>
          <Route path="/settings" element={<div>Not implemented</div>} />
        </>
      )}
      <Route path="*" element={<Navigate to="/" />} />
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
