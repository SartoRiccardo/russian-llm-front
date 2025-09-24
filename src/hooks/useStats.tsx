import { useSelector } from 'react-redux';
import type { RootState } from '@/store/store';

export const useStats = () => {
  const stats = useSelector((state: RootState) => state.stats);
  return stats;
};
