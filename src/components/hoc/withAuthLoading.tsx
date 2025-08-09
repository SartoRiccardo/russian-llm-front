
import React from 'react';
import { useAuth } from '@/hooks/useAuth';

const withAuthLoading = (WrappedComponent: React.ComponentType) => {
  const ComponentWithAuthLoading = (props: any) => {
    const { isLoading } = useAuth();

    if (isLoading) {
      return <div>Loading...</div>;
    }

    return <WrappedComponent {...props} />;
  };

  return ComponentWithAuthLoading;
};

export default withAuthLoading;
