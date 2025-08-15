import { ToastContext } from '@/components/contexts/contexts';
import { useContext } from 'react';

/**
 * A custom hook to access the toast context.
 * @returns The toast context.
 * @throws An error if used outside of a ToastProvider.
 */
export function useToast() {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  return context;
}
