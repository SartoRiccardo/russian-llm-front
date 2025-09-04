import type { IWordSkillSchema, ISkillSchema } from './main';

export interface IStatsResponse {
  language_skills: ISkillSchema[];
  word_skills: IWordSkillSchema[];
}

export interface IStatsContext {
  languageSkills: ISkillSchema[];
  wordSkills: IWordSkillSchema[];
  isLoadingStats: boolean;
  lastLoadedAt: Date | null;
  loadStats: () => Promise<void>;
}
