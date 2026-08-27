export interface UserProfile {
  userId: number;
  email: string;
  username: string;
  zodiacSign: string;
  role: string;
}

export interface AuthResponse {
  token: string;
  userId: number;
  email: string;
  username: string;
  zodiacSign: string;
  role: string;
}

export interface RegisterCommand {
  email: string;
  password: string;
}

export interface LoginCommand {
  email: string;
  password: string;
}