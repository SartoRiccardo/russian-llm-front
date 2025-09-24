import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import type { IStatsResponse } from '@/types/stats';
import type { ISkillSchema, IWordSkillSchema } from '@/types/main';

interface StatsState {
  languageSkills: ISkillSchema[];
  wordSkills: IWordSkillSchema[];
  isLoadingStats: boolean;
  lastLoadedAt: string | null;
}

const initialState: StatsState = {
  languageSkills: [],
  wordSkills: [],
  isLoadingStats: true,
  lastLoadedAt: null,
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
    },
    statsError: (state) => {
      state.isLoadingStats = false;
    },
  },
});

export const { statsLoading, statsReceived, statsError } = statsSlice.actions;

export default statsSlice.reducer;
