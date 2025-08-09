
export interface ILoginResponse {
  sessionExpire: number;
}

export interface ICheckLoginStatusResponse {
  username: string;
  sessionExpire: number;
}
