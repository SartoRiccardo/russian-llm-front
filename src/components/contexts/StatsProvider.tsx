import { useState, useCallback, useRef } from 'react';
import { StatsContext } from './contexts';
import { getStats } from '@/services/russian-llm-api';
import type { IStatsResponse } from '@/types/stats';

/**
 * Provides the stats data to its children components.
 */
export default function StatsProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  // Merge all these in one state since they all depend on each other
  const [stats, setStats] = useState<IStatsResponse | null>(null);
  const [isLoadingStats, setIsLoadingStats] = useState(true);
  const [lastLoadedAt, setLastLoadedAt] = useState<Date | null>(null);
  const lastFetchId = useRef(-1);

  const loadStats = useCallback(async () => {
    const currentFetchId = Math.random();
    lastFetchId.current = currentFetchId;
    setIsLoadingStats(true);
    try {
      const data = await getStats();
      if (lastFetchId.current === currentFetchId) {
        setStats(data);
        setLastLoadedAt(new Date());
      }
    } catch (err: unknown) {
      if (lastFetchId.current === currentFetchId) {
        throw err;
      }
    } finally {
      if (lastFetchId.current === currentFetchId) {
        setIsLoadingStats(false);
      }
    }
  }, []);

  return (
    <StatsContext.Provider
      value={{
        languageSkills: stats?.language_skills || [],
        wordSkills: stats?.word_skills || [],
        isLoadingStats,
        lastLoadedAt,
        loadStats,
      }}
    >
      {children}
    </StatsContext.Provider>
  );
}
