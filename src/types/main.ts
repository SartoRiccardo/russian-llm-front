/**
 * Represents the response structure for a successful check login status API call.
 */
export interface IAuthnSuccessResponse {
  username: string;
  sessionExpire: number;
}

/**
 * Represents the user data stored in the authentication context.
 */
export type IUserData = IAuthnSuccessResponse;

/**
 * Defines the shape of the authentication context.
 */
export interface IAuthContext {
  userData: IUserData | null;
  isLoading: boolean;
  isLoggedIn: boolean;
  isSlowNetwork: boolean;
  sessionExpire: number;
  sessionExpireMs: number;
  login: (email: string, password: string) => Promise<void>;
  logout: (redirect?: string) => Promise<void>;
}

/**
 * Props for the AuthProvider component.
 */
export interface AuthProviderProps {
  children: React.ReactNode;
}

export interface ISkillSchema {
  id: 'reading' | 'speaking' | 'listening' | 'writing';
  mastery: 'A1' | 'A2' | 'B1' | 'B2' | 'C1' | 'C2';
}

export interface IWordRule {
  id: number;
  rule: string;
}

export interface IWordSubcategory {
  id: string;
  mastery: number; // A number guaranteed to be between 0 and 4, included.
  rules: IWordRule[];
}

export interface IWordSkillSchema {
  id: string; // Word type is something like "verb", "noun", ...
  mastery: number; // A number guaranteed to be between 0 and 4, included.
  subcategories: IWordSubcategory[];
}

export interface IStatsResponse {
  language_skills: ISkillSchema[];
  word_skills: IWordSkillSchema[];
}
