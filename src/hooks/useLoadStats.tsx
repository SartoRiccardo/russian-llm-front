import { useCallback, useRef } from 'react';
import { useDispatch } from 'react-redux';
import { getStats } from '@/services/russian-llm-api';
import {
  statsLoading,
  statsReceived,
  statsError,
  setStale,
} from '@/store/statsSlice';
import type { AppDispatch } from '@/store/store';

export const useLoadStats = () => {
  const dispatch = useDispatch<AppDispatch>();
  const lastFetchId = useRef(-1);

  const loadStats = useCallback(async () => {
    const currentFetchId = Math.random();
    lastFetchId.current = currentFetchId;

    dispatch(statsLoading());
    try {
      const data = await getStats();
      if (lastFetchId.current === currentFetchId) {
        dispatch(statsReceived(data));
      }
    } catch (err) {
      if (lastFetchId.current === currentFetchId) {
        dispatch(statsError());
        // Re-throw the error to be caught by the component
        throw err;
      }
    }
  }, [dispatch]);

  const markStatsAsStale = useCallback(() => {
    dispatch(setStale());
  }, [dispatch]);

  return { loadStats, markStatsAsStale };
};
