export enum ENUM_TOKENS {
  ACCESS_TOKEN = 'accessToken',
  REFRESH_TOKEN = 'refreshToken',
}

export interface ITokens {
  accessToken: string;
  refreshToken: string;
}

export interface IAuthResponse {
  user: {
    email: string;
    createdAt: Date;
  };
  accessToken: string;
}
