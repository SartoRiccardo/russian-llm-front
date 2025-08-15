
import React, { useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { Navigate } from 'react-router';
import { useToast } from '@/hooks/useToast';

const SLOW_NETWORK_TOAST_ID = 'slow-network-toast';

/**
 * A Higher-Order Component (HOC) that handles authentication loading and route protection.
 * If authentication is in progress, it displays a loading indicator.
 * If the user is not logged in, it redirects to the login page.
 * Otherwise, it renders the wrapped component.
 * @param WrappedComponent The component to wrap.
 * @returns A new component that displays a loading indicator, redirects, or renders the wrapped component.
 */
const withAuthLoading = <P extends object>(WrappedComponent: React.ComponentType<P>) => {
  const ComponentWithAuthLoading = (props: P) => {
    const { isLoading, isLoggedIn, isSlowNetwork } = useAuth();
    const { createToast } = useToast();

    useEffect(() => {
      if (isSlowNetwork) {
        createToast({
          id: SLOW_NETWORK_TOAST_ID,
          type: 'WARNING',
          title: 'Slow Network',
          content: 'Is the connection slow?',
          duration: 10000, // The toast will auto-dismiss after 10s
        });
      }
    }, [isSlowNetwork, createToast]);

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
