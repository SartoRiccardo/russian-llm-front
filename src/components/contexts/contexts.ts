import { createContext } from 'react';
import type { IAuthContext } from '@/types/main';

/**
 * The authentication context for the application.
 */
export const AuthContext = createContext<IAuthContext | null>(null);
