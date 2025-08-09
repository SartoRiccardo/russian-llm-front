
import React from 'react';
import { useAuth } from '@/hooks/useAuth';
import { Navigate } from 'react-router';

/**
 * A Higher-Order Component (HOC) that handles authentication loading and route protection.
 * If authentication is in progress, it displays a loading indicator.
 * If the user is not logged in, it redirects to the login page.
 * Otherwise, it renders the wrapped component.
 * @param WrappedComponent The component to wrap.
 * @returns A new component that displays a loading indicator, redirects, or renders the wrapped component.
 */
const withAuthLoading = (WrappedComponent: React.ComponentType) => {
  const ComponentWithAuthLoading = (props: any) => {
    const { isLoading, isLoggedIn } = useAuth();

    if (isLoading) {
      return <div>Loading...</div>;
    }

    if (!isLoggedIn) {
      return <Navigate to="/login" />;
    }

    return <WrappedComponent {...props} />;
  };

  return ComponentWithAuthLoading;
};

export default withAuthLoading;
