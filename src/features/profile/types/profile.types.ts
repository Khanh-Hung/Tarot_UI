import { ZodiacSign } from "@/features/tarot/types/tarot.types";

export type Gender = "MALE" | "FEMALE" | "OTHER" | "UNKNOWN";

export type RelationshipStatus =
  | "SINGLE"
  | "DATING"
  | "IN_RELATIONSHIP"
  | "COMPLICATED"
  | "MARRIED"
  | "UNKNOWN";

export interface BirthCardDto {
  cardNumber: number;
  cardNameVi: string;
  cardNameEn: string;
  soulCardNameVi: string;
  imageUrl: string;
  keywords: string;
  description: string;
}

export interface ProfileDto {
  userId: string;
  email: string;
  userName: string;
  displayName?: string | null;
  avatarUrl?: string | null;
  dateOfBirth?: string | null;
  gender?: Gender | null;
  relationshipStatus?: RelationshipStatus | null;
  zodiacSign?: ZodiacSign | null;
  favoriteDeckId?: string | null;
  birthCard?: BirthCardDto | null;
  isEmailVerified?: boolean;
  currentStreak?: number;
  longestStreak?: number;
  isStreakActiveToday?: boolean;
}

export interface UpdateMyProfileCommand {
  displayName?: string;
  dateOfBirth?: string | null;
  gender?: Gender | null;
  zodiacSign?: ZodiacSign;
  favoriteDeckId?: string | null;
  relationshipStatus?: RelationshipStatus;
}

