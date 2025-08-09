
import { useAuth } from '../hooks/useAuth';
import { Navigate, Outlet } from 'react-router';

export const PrivateRoute = () => {
  const { isLoggedIn, isLoading } = useAuth();

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return isLoggedIn ? <Outlet /> : <Navigate to="/login" />;
};
