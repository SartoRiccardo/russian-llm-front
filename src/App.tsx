

import { BrowserRouter, Routes, Route, Navigate } from 'react-router';
import { AuthProvider } from '@/components/contexts/AuthProvider';
import { useAuth } from '@/hooks/useAuth';
import HomePage from '@/pages/HomePage';
import LoginPage from '@/pages/LoginPage';
import { PrivateRoute } from '@/components/PrivateRoute';


const AppRoutes = () => {
  const { isLoggedIn, isLoading } = useAuth();

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <Routes>
      <Route
        path="/login"
        element={isLoggedIn ? <Navigate to="/" /> : <LoginPage />}
      />
      <Route path="/" element={<PrivateRoute />}>
        <Route index element={<HomePage />} />
        <Route path="home" element={<HomePage />} />
      </Route>
      <Route path="*" element={<Navigate to="/" />} />
    </Routes>
  );
};

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <AppRoutes />
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
