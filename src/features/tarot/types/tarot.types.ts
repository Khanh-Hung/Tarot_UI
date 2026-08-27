export type DeckCode = 
  | "RIDER_WAITE_CLASSIC" 
  | "MARSEILLE_HERMETIC" 
  | "THOTH_ALEISTER" 
  | "SHADOWSCAPES_ETHEREAL";

export type Topic = 
  | "LOVE_RELATIONSHIP" 
  | "CAREER_MONEY" 
  | "SPIRITUAL_HEALING" 
  | "DAILY_GUIDANCE" 
  | "GENERAL_QUESTION";

export type SpreadType = 
  | "THREE_CARDS_TIMELINE" 
  | "SINGLE_CARD_FOCUS" 
  | "CELTIC_CROSS";

export type ZodiacSign = 
  | "ARIES" | "TAURUS" | "GEMINI" | "CANCER" 
  | "LEO" | "VIRGO" | "LIBRA" | "SCORPIO" 
  | "SAGITTARIUS" | "CAPRICORN" | "AQUARIUS" | "PISCES" 
  | "UNKNOWN";

export interface DeckDto {
  code: DeckCode;
  nameVi: string;
  nameEn: string;
  descriptionVi: string;
  totalCards: number;
  styleTag: string;
}

export interface CardDto {
  id: number;
  code: string;
  nameEn: string;
  nameVi: string;
  arcanaType: string;
  suit?: string;
  number?: number;
  element?: string;
  uprightMeaning: string;
  reversedMeaning: string;
  keywords: string;
  imageUrl?: string;
}

export interface DrawnCardDto {
  cardId: number;
  cardCode: string;
  nameVi: string;
  nameEn: string;
  isReversed: boolean;
  positionIndex: number;
  positionName: string;
  imageUrl?: string;
  element?: string;
  keywords?: string;
  meaning?: string;
}

export interface CreateReadingCommand {
  userId: number;
  userQuestion: string;
  topic: Topic;
  zodiacSign?: ZodiacSign;
  spreadType?: SpreadType;
  deckCode?: DeckCode;
}

export interface CreateReadingResponse {
  readingId: number;
  userQuestion: string;
  topic: Topic;
  spreadType: SpreadType;
  initialReading: string;
  createdAt: string;
  drawnCards: DrawnCardDto[];
}

export interface ChatMessageDto {
  id: number;
  sender: "USER" | "AI";
  message: string;
  createdAt: string;
}

export interface ReadingDetailResponse {
  id: number;
  userId: number;
  userQuestion: string;
  topic: Topic;
  spreadType: SpreadType;
  deckCode: DeckCode;
  initialReading: string;
  createdAt: string;
  drawnCards: DrawnCardDto[];
  chatMessages: ChatMessageDto[];
}

export interface ReadingSummaryResponse {
  id: number;
  userQuestion: string;
  topic: Topic;
  spreadType: SpreadType;
  deckCode: DeckCode;
  createdAt: string;
  drawnCards: DrawnCardDto[];
}

export interface PagedResponse<T> {
  items: T[];
  page: number;
  size: number;
  totalElements: number;
  totalPages: number;
  last: boolean;
}