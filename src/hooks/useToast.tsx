import { useContext } from 'react';
import { ToastContext } from '@/components/contexts/contexts';

/**
 * Custom hook to access the toast context.
 * Throws an error if used outside of a ToastProvider.
 * @returns The toast context.
 */
export const useToast = () => {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  return context;
};
