import { accountApiClient } from "@/lib/api";
import { AuthResponse, LoginCommand, RegisterCommand } from "../types/auth.types";

export const authService = {
  async register(command: RegisterCommand): Promise<AuthResponse> {
    const response = await accountApiClient.post<AuthResponse>("/auth/register", command);
    return response.data;
  },

  async login(command: LoginCommand): Promise<AuthResponse> {
    const response = await accountApiClient.post<AuthResponse>("/auth/login", command);
    return response.data;
  },

  async sendVerificationEmail(email: string): Promise<string> {
    const response = await accountApiClient.post<any>("/auth/send-verification-email", { email });
    return typeof response.data === "string" ? response.data : response.data?.message || "";
  },

  async verifyEmail(token: string): Promise<AuthResponse> {
    const response = await accountApiClient.post<AuthResponse>("/auth/verify-email", { token });
    return response.data;
  },

  // Aliases for compatibility
  async sendVerificationOtp(email: string): Promise<string> {
    return this.sendVerificationEmail(email);
  },

  async verifyEmailOtp(email: string, token: string): Promise<AuthResponse> {
    return this.verifyEmail(token);
  },
};