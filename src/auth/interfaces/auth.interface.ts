export interface UserResponseDto {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: string;
}

export interface LoginResponse {
  access_token: string;
  refresh_token: string;
  user: UserResponseDto;
}

export interface RegisterResponse {
  success: boolean;
  message: string;
  user: UserResponseDto;
}

export interface RefreshTokenResponse {
  access_token: string;
  refresh_token: string;
}

export interface JwtPayload {
  sub: string;
  email: string;
  role: string;
  type: 'access' | 'refresh';
  iat?: number;
  exp?: number;
}

export interface TokenPair {
  access_token: string;
  refresh_token: string;
}
