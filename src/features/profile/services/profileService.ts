import { apiClient, accountApiClient } from "@/lib/api";
import { ProfileDto, UpdateMyProfileCommand } from "../types/profile.types";

export interface UpdateAccountProfileCommand {
  displayName?: string;
  avatarUrl?: string;
  dateOfBirth?: string | null;
  gender?: "Male" | "Female" | "Other" | null;
}

export const profileService = {
  async getMyProfile(): Promise<ProfileDto> {
    const response = await apiClient.get<ProfileDto>("/profile/me");
    return response.data;
  },

  async updateMyProfile(command: UpdateMyProfileCommand): Promise<ProfileDto> {
    const response = await apiClient.put<ProfileDto>("/profile/me", command);
    return response.data;
  },

  async updateAccountProfile(command: UpdateAccountProfileCommand) {
    const response = await accountApiClient.put("/profile/me", command);
    return response.data;
  },
};
