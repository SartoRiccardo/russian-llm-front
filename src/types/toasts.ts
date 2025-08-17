import type { JSX } from 'react';

/**
 * Defines the possible types for a toast notification.
 */
export type ToastType = 'SUCCESS' | 'ERROR' | 'WARNING';

/**
 * Represents a toast notification object.
 */
export interface IToast {
  id: string;
  type: ToastType;
  title: string | JSX.Element;
  content: string | JSX.Element;
  /** The duration in milliseconds for which the toast will be displayed. */
  duration: number;
  /** An optional data-cy attribute for testing purposes. */
  dataCy?: string;
}

/**
 * Defines the shape of the toast context.
 */
export interface IToastContext {
  /**
   * Creates a new toast notification.
   * @param options The options for the toast.
   * @returns The ID of the created toast.
   */
  createToast: (options: Partial<IToast>) => string;
}
