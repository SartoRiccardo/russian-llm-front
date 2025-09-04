import { useContext } from 'react';
import { StatsContext } from '@/components/contexts/contexts';

/**
 * Custom hook to access the stats context.
 * Throws an error if used outside of a StatsProvider.
 * @returns The stats context.
 */
export const useStats = () => {
  const context = useContext(StatsContext);
  if (!context) {
    throw new Error('useStats must be used within a StatsProvider');
  }
  return context;
};
