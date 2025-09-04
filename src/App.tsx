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
  const { isLoggedIn } = useAuth();

  return (
    <Routes>
      <Route
        path="/login"
        element={isLoggedIn ? <Navigate to="/exercises" /> : <LoginPage />}
      />
      <Route
        path="/forgot-password"
        element={
          isLoggedIn ? <Navigate to="/settings" /> : <ForgotPasswordPage />
        }
      />
      <Route
        path="/password-reset"
        element={
          isLoggedIn ? <Navigate to="/settings" /> : <PasswordResetPage />
        }
      />
      <Route path="/exercises" element={<ExercisesPage />} />
      <Route path="/exercises/:id" element={<ExerciseDetailPage />} />
      <Route path="/" element={<StatsContextRoute />}>
        <Route path="stats" element={<StatsPage />} />
        <Route path="vocabulary" element={<VocabularyPage />} />
      </Route>
      <Route path="/settings" element={<div>Not implemented</div>} />
      <Route path="*" element={<Navigate to="/exercises" />} />
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
