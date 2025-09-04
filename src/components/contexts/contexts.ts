import { createContext } from 'react';
import type { IAuthContext } from '@/types/main';
import type { IToastContext } from '@/types/toasts';
import type { IStatsContext } from '@/types/stats';

/**
 * The authentication context for the application.
 */
export const AuthContext = createContext<IAuthContext | null>(null);

/**
 * The toast context for the application.
 */
export const ToastContext = createContext<IToastContext | null>(null);

/**
 * The stats context for the application.
 */
export const StatsContext = createContext<IStatsContext | null>(null);
