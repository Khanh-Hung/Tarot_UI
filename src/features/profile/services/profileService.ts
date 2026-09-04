import { apiClient } from "@/lib/api";
import { ProfileDto, UpdateMyProfileCommand } from "../types/profile.types";

export const profileService = {
  async getMyProfile(): Promise<ProfileDto> {
    const response = await apiClient.get<ProfileDto>("/profile/me");
    return response.data;
  },

  async updateMyProfile(command: UpdateMyProfileCommand): Promise<ProfileDto> {
    const response = await apiClient.put<ProfileDto>("/profile/me", command);
    return response.data;
  },
};
