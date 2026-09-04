import { ZodiacSign } from "@/features/tarot/types/tarot.types";

export interface ProfileDto {
  userId: string;
  email: string;
  userName: string;
  displayName?: string | null;
  avatarUrl?: string | null;
  zodiacSign?: ZodiacSign | null;
  favoriteDeckId?: string | null;
}

export interface UpdateMyProfileCommand {
  displayName?: string;
  avatarUrl?: string;
  zodiacSign?: ZodiacSign;
  favoriteDeckId?: string | null;
}
