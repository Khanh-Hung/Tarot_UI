import { apiClient } from "@/lib/api";
import {
  CreateReadingCommand,
  CreateReadingResponse,
  DeckDto,
  CardDto,
  PagedResponse,
  ReadingDetailResponse,
  ReadingSummaryResponse,
} from "../types/tarot.types";

export const tarotService = {
  async getDecks(): Promise<DeckDto[]> {
    const response = await apiClient.get<DeckDto[]>("/decks");
    return response.data;
  },

  async getCardsByDeck(deckCode: string): Promise<CardDto[]> {
    const response = await apiClient.get<CardDto[]>(`/decks/${deckCode}/cards`);
    return response.data;
  },

  async createReading(command: CreateReadingCommand): Promise<CreateReadingResponse> {
    const response = await apiClient.post<CreateReadingResponse>("/readings", command);
    return response.data;
  },

  async getReadingById(id: string | number): Promise<ReadingDetailResponse> {
    const response = await apiClient.get<ReadingDetailResponse>(`/readings/${id}`);
    return response.data;
  },

  async getReadingHistory(userId?: string | number | null, page = 0, size = 10): Promise<PagedResponse<ReadingSummaryResponse>> {
    if (!userId) {
      return {
        items: [],
        totalElements: 0,
        totalPages: 0,
        page,
        size,
        last: true,
      };
    }
    const response = await apiClient.get<PagedResponse<ReadingSummaryResponse>>(
      `/readings/user/${userId}?page=${page}&size=${size}`
    );
    return response.data;
  },

  async sendChatMessage(readingId: string | number, message: string): Promise<string> {
    const response = await apiClient.post<any>(`/readings/${readingId}/messages`, { message });
    if (typeof response.data === "string") return response.data;
    return response.data?.content || response.data?.message || "";
  },
};