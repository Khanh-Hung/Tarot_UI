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

// In-memory cache cho dữ liệu tĩnh bài Tarot giúp tải tức thì (0ms)
let cachedDecks: DeckDto[] | null = null;
const cachedCardsByDeck = new Map<string, CardDto[]>();

export const tarotService = {
  /**
   * Lấy danh sách bộ bài Tarot (kèm in-memory cache)
   */
  async getDecks(forceRefresh = false): Promise<DeckDto[]> {
    if (!forceRefresh && cachedDecks && cachedDecks.length > 0) {
      return cachedDecks;
    }
    const response = await apiClient.get<DeckDto[]>("/decks");
    cachedDecks = response.data;
    return response.data;
  },

  /**
   * Lấy 78 lá bài của bộ bài (kèm in-memory cache theo deckCode)
   */
  async getCardsByDeck(deckCode: string, forceRefresh = false): Promise<CardDto[]> {
    if (!forceRefresh && cachedCardsByDeck.has(deckCode)) {
      return cachedCardsByDeck.get(deckCode)!;
    }
    const response = await apiClient.get<CardDto[]>(`/decks/${deckCode}/cards`);
    cachedCardsByDeck.set(deckCode, response.data);
    return response.data;
  },

  /**
   * Xóa bộ nhớ đệm bài Tarot khi cần tải mới dữ liệu từ server
   */
  clearTarotCache() {
    cachedDecks = null;
    cachedCardsByDeck.clear();
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
    const response = await apiClient.post<{ content?: string; message?: string } | string>(
      `/readings/${readingId}/messages`,
      { message }
    );
    if (typeof response.data === "string") return response.data;
    return response.data?.content || response.data?.message || "";
  },
};