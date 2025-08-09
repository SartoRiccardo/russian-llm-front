import { createContext } from 'react';
import type { IAuthContext } from '@/types/main';

export const AuthContext = createContext<IAuthContext | null>(null);
