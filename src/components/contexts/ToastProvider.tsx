import type { ReactNode } from 'react';
import { useCallback, useState } from 'react';
import { ToastContext } from './contexts';
import type { IToast } from '@/types/toasts';
import { v7 as uuidv7 } from 'uuid';
import Toast from '../ui/Toast';

/**
 * Props for the ToastProvider component.
 */
interface IToastProviderProps {
  children: ReactNode;
}

/**
 * A tuple representing a toast and its associated timeout ID.
 */
type ToastWithTimeout = [IToast, number];

/**
 * Provides the toast context to the application.
 * Manages the creation, dismissal, and rendering of toasts.
 * @param {IToastProviderProps} props The props for the component.
 */
export default function ToastProvider({ children }: IToastProviderProps) {
  const [toasts, setToasts] = useState<ToastWithTimeout[]>([]);

  const dismissToast = useCallback((id: string) => {
    setToasts((currentToasts) =>
      currentToasts.filter(([toast, timeoutId]) => {
        if (toast.id === id) {
          clearTimeout(timeoutId);
          return false;
        }
        return true;
      }),
    );
  }, []);

  const createToast = useCallback(
    (options: Partial<IToast>) => {
      const id = options.id || uuidv7();
      const duration = options.duration || 5000;

      const newToast: IToast = {
        id,
        type: options.type || 'SUCCESS',
        title: options.title || '',
        content: options.content || '',
        duration,
        dataCy: options.dataCy,
      };

      const timeoutId = window.setTimeout(() => {
        dismissToast(id);
      }, duration);

      setToasts((currentToasts) => {
        const existingToastIndex = currentToasts.findIndex(
          ([toast]) => toast.id === id,
        );
        if (existingToastIndex > -1) {
          const [, oldTimeoutId] = currentToasts[existingToastIndex];
          clearTimeout(oldTimeoutId);
          const updatedToasts = [...currentToasts];
          updatedToasts[existingToastIndex] = [newToast, timeoutId];
          return updatedToasts;
        }
        return [[newToast, timeoutId], ...currentToasts];
      });

      return id;
    },
    [dismissToast],
  );

  return (
    <ToastContext.Provider value={{ createToast }}>
      {children}
      <div className="fixed top-5 right-5 z-50">
        {toasts.map(([toast]) => (
          <Toast
            key={toast.id}
            toast={toast}
            onDismiss={() => dismissToast(toast.id)}
          />
        ))}
      </div>
    </ToastContext.Provider>
  );
}
