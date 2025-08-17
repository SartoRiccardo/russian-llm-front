import { useContext } from 'react';
import { AuthContext } from '@/components/contexts/contexts';

/**
 * Custom hook to access the authentication context.
 * Throws an error if used outside of an AuthProvider.
 * @returns The authentication context.
 */
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
