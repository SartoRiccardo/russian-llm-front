import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import type { IStatsResponse } from '@/types/stats';
import type { ISkillSchema, IWordSkillSchema } from '@/types/main';

interface StatsState {
  languageSkills: ISkillSchema[];
  wordSkills: IWordSkillSchema[];
  isLoadingStats: boolean;
  lastLoadedAt: string | null;
  isStale: boolean;
}

const initialState: StatsState = {
  languageSkills: [],
  wordSkills: [],
  isLoadingStats: true,
  lastLoadedAt: null,
  isStale: true,
};

const statsSlice = createSlice({
  name: 'stats',
  initialState,
  reducers: {
    statsLoading: (state) => {
      state.isLoadingStats = true;
    },
    statsReceived: (state, action: PayloadAction<IStatsResponse>) => {
      state.isLoadingStats = false;
      state.languageSkills = action.payload.language_skills;
      state.wordSkills = action.payload.word_skills;
      state.lastLoadedAt = new Date().toISOString();
      state.isStale = false;
    },
    statsError: (state) => {
      state.isLoadingStats = false;
    },
    setStale: (state) => {
      state.isStale = true;
    },
  },
});

export const { statsLoading, statsReceived, statsError, setStale } =
  statsSlice.actions;

export default statsSlice.reducer;
