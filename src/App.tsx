import { BrowserRouter, Routes, Route, Navigate } from 'react-router';
import { AuthProvider } from '@/components/contexts/AuthProvider';
import { useAuth } from '@/hooks/useAuth';
import HomePage from '@/pages/HomePage';
import LoginPage from '@/pages/LoginPage';
import ToastProvider from '@/components/contexts/ToastProvider';

/**
 * Defines the application's routes.
 */
const AppRoutes = () => {
  const { isLoggedIn } = useAuth();

  return (
    <Routes>
      <Route
        path="/login"
        element={isLoggedIn ? <Navigate to="/" /> : <LoginPage />}
      />
      <Route path="/" element={<HomePage />} />
      <Route path="home" element={<HomePage />} />
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
