export interface UserProfile {
  userId: string | number;
  email: string;
  username: string;
  displayName?: string;
  avatarUrl?: string;
  zodiacSign: string;
  role: string;
  isEmailVerified?: boolean;
}

export interface AuthResponse {
  token: string;
  userId: string | number;
  email: string;
  username: string;
  displayName?: string;
  avatarUrl?: string;
  zodiacSign: string;
  role: string;
  isEmailVerified: boolean;
}

export interface RegisterCommand {
  email: string;
  password: string;
}

export interface LoginCommand {
  email: string;
  password: string;
}