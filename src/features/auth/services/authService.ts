import { apiClient } from "@/lib/api";
import { AuthResponse, LoginCommand, RegisterCommand } from "../types/auth.types";

export const authService = {
  async register(command: RegisterCommand): Promise<AuthResponse> {
    const response = await apiClient.post<AuthResponse>("/auth/register", command);
    return response.data;
  },

  async login(command: LoginCommand): Promise<AuthResponse> {
    const response = await apiClient.post<AuthResponse>("/auth/login", command);
    return response.data;
  },
};