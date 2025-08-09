
export interface ILoginResponse {
  sessionExpire: number;
}

export interface ICheckLoginStatusResponse {
  username: string;
  sessionExpire: number;
}

export interface IUserData {
  username: string;
  sessionExpire: number;
}

export interface IAuthContext {
  userData: IUserData | null;
  isLoading: boolean;
  isLoggedIn: boolean;
  isSlowNetwork: boolean;
  sessionExpire: number;
  sessionExpireMs: number;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
}

export interface AuthProviderProps {
  children: React.ReactNode;
}
