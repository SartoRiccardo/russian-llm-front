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
  login: (
    email: string,
    password: string,
    redirect?: string | null,
  ) => Promise<void>;
  logout: (redirect?: string) => Promise<void>;
}

/**
 * Props for the AuthProvider component.
 */
export interface AuthProviderProps {
  children: React.ReactNode;
}
