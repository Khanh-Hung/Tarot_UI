"use client";

import React, { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Sparkles, HelpCircle, Star, RotateCcw, MessageSquare, Loader2, ArrowRight, Moon, BookOpen } from "lucide-react";
import { useAuth } from "@/features/auth/hooks/useAuth";
import {
  CreateReadingResponse,
  DeckCode,
  DeckDto,
  ZodiacSign,
} from "@/features/tarot/types/tarot.types";
import { tarotService } from "@/features/tarot/services/tarotService";
import { TarotCard3D } from "@/features/tarot/components/TarotCard3D";
import { MarkdownRenderer } from "@/features/chat/components/MarkdownRenderer";
import { ChatBox } from "@/features/chat/components/ChatBox";
import { CustomSelect, OptionItem } from "@/components/ui/CustomSelect";

const ZODIAC_LIST: { code: ZodiacSign; name: string; symbol: string }[] = [
  { code: "ARIES", name: "Bạch Dương (Aries)", symbol: "♈" },
  { code: "TAURUS", name: "Kim Ngưu (Taurus)", symbol: "♉" },
  { code: "GEMINI", name: "Song Tử (Gemini)", symbol: "♊" },
  { code: "CANCER", name: "Cự Giải (Cancer)", symbol: "♋" },
  { code: "LEO", name: "Sư Tử (Leo)", symbol: "♌" },
  { code: "VIRGO", name: "Xử Nữ (Virgo)", symbol: "♍" },
  { code: "LIBRA", name: "Thiên Bình (Libra)", symbol: "♎" },
  { code: "SCORPIO", name: "Bọ Cạp (Scorpio)", symbol: "♏" },
  { code: "SAGITTARIUS", name: "Nhân Mã (Sagittarius)", symbol: "♐" },
  { code: "CAPRICORN", name: "Ma Kết (Capricorn)", symbol: "♑" },
  { code: "AQUARIUS", name: "Bảo Bình (Aquarius)", symbol: "♒" },
  { code: "PISCES", name: "Song Ngư (Pisces)", symbol: "♓" },
];

function ReadingContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { user, isAuthenticated, isLoading: isAuthLoading, updateUserZodiac } = useAuth();

  const [question, setQuestion] = useState("");
  const [deckCode, setDeckCode] = useState<DeckCode>("RIDER_WAITE_CLASSIC");
  const [selectedZodiac, setSelectedZodiac] = useState<ZodiacSign>("UNKNOWN");
  const [decks, setDecks] = useState<DeckDto[]>([]);

  const [isReadingLoading, setIsReadingLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [readingResult, setReadingResult] = useState<CreateReadingResponse | null>(null);
  const [, setFlippedCount] = useState(0);

  useEffect(() => {
    const deckParam = searchParams.get("deckCode") as DeckCode;
    if (deckParam) setDeckCode(deckParam);

    async function loadDecks() {
      try {
        const data = await tarotService.getDecks();
        setDecks(data);
      } catch (e) {
        console.error(e);
      }
    }
    loadDecks();
  }, [searchParams]);

  useEffect(() => {
    if (user?.zodiacSign && user.zodiacSign !== "UNKNOWN") {
      setSelectedZodiac(user.zodiacSign as ZodiacSign);
    }
  }, [user]);

  const handleStartReading = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isAuthenticated) {
      router.push("/login");
      return;
    }
    if (!question.trim()) {
      setErrorMsg("Vui lòng nhập câu hỏi bạn đang trăn trở.");
      return;
    }

    const needsZodiac = !user?.zodiacSign || user.zodiacSign === "UNKNOWN";
    if (needsZodiac && (!selectedZodiac || selectedZodiac === "UNKNOWN")) {
      setErrorMsg("Vui lòng chọn Cung Hoàng Đạo để AI kết nối năng lượng chính xác nhất.");
      return;
    }

    setErrorMsg("");
    setIsReadingLoading(true);

    try {
      const result = await tarotService.createReading({
        userId: user!.userId,
        userQuestion: question,
        deckCode,
        zodiacSign: selectedZodiac !== "UNKNOWN" ? selectedZodiac : undefined,
        spreadType: "PAST_PRESENT_FUTURE",
      });

      setReadingResult(result);
      setFlippedCount(0);
      if (selectedZodiac !== "UNKNOWN") {
        updateUserZodiac(selectedZodiac);
      }
    } catch (err: any) {
      console.error("Create reading failed:", err);
      const serverMessage = err.response?.data?.message || "Không thể thực hiện quẻ bói. Vui lòng thử lại.";
      setErrorMsg(serverMessage);
    } finally {
      setIsReadingLoading(false);
    }
  };

  const handleReset = () => {
    setReadingResult(null);
    setQuestion("");
    setFlippedCount(0);
  };

  const zodiacOptions: OptionItem[] = [
    { value: "UNKNOWN", label: "-- Chọn cung hoàng đạo --" },
    ...ZODIAC_LIST.map((z) => ({
      value: z.code,
      label: z.name,
      icon: z.symbol,
    })),
  ];

  const deckOptions: OptionItem[] = decks.map((d) => ({
    value: d.code,
    label: d.nameVi,
    sublabel: d.nameEn,
    icon: "🎴",
  }));

  if (isAuthLoading) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-slate-200" />
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      {/* 🔮 PHẦN 1: FORM NHẬP CÂU HỎI TỐI GIẢN (KHÔNG CẦN CHỌN CHỦ ĐỀ) */}
      {!readingResult && (
        <div className="max-w-2xl mx-auto p-7 sm:p-9 rounded-3xl silver-card">
          <div className="text-center mb-8">
            <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-white/[0.04] border border-white/15 text-xs text-slate-200 mb-3">
              <Moon className="w-3.5 h-3.5 text-slate-300" />
              <span>Trải Bài 3 Lá (Quá khứ - Hiện tại - Tương lai)</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold text-white">
              Bắt Đầu Quẻ Bói Tarot
            </h1>
            <p className="mt-1 text-xs sm:text-sm text-slate-400">
              Hãy tĩnh tâm, nhắm mắt vài giây và đặt câu hỏi chân thành nhất của bạn
            </p>
          </div>

          {errorMsg && (
            <div className="mb-6 p-3.5 rounded-xl bg-rose-950/60 border border-rose-500/30 text-xs text-rose-200 text-center">
              {errorMsg}
            </div>
          )}

          <form onSubmit={handleStartReading} className="space-y-6">
            {/* CÂU HỎI CỦA NGƯỜI DÙNG */}
            <div>
              <label className="block text-xs font-semibold text-slate-200 mb-1.5 flex items-center gap-1.5">
                <HelpCircle className="w-4 h-4 text-slate-300" />
                <span>Câu hỏi hoặc điều bạn đang trăn trở *</span>
              </label>
              <textarea
                required
                rows={4}
                value={question}
                onChange={(e) => setQuestion(e.target.value)}
                placeholder="Ví dụ: Công việc sắp tới của tôi sẽ có cơ hội thăng tiến nào không? Hay: Mối quan hệ hiện tại giữa tôi và người ấy đang có rào cản gì?"
                className="w-full bg-black/40 border border-white/10 rounded-2xl p-4 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-white/30 transition"
              />
            </div>

            {/* CUNG HOÀNG ĐẠO */}
            {(!user?.zodiacSign || user.zodiacSign === "UNKNOWN") && (
              <div>
                <label className="block text-xs font-semibold text-slate-200 mb-1.5 flex items-center gap-1.5">
                  <Star className="w-4 h-4 text-slate-300" />
                  <span>Cung Hoàng Đạo của bạn *</span>
                </label>
                <CustomSelect
                  options={zodiacOptions}
                  value={selectedZodiac}
                  onChange={(val) => setSelectedZodiac(val as ZodiacSign)}
                  placeholder="-- Chọn cung hoàng đạo --"
                />
              </div>
            )}

            {/* BỘ BÀI TAROT */}
            {decks.length > 0 && (
              <div>
                <label className="block text-xs font-semibold text-slate-200 mb-1.5 flex items-center gap-1.5">
                  <BookOpen className="w-4 h-4 text-slate-300" />
                  <span>Bộ bài Tarot muốn sử dụng</span>
                </label>
                <CustomSelect
                  options={deckOptions}
                  value={deckCode}
                  onChange={(val) => setDeckCode(val as DeckCode)}
                  placeholder="Chọn bộ bài Tarot..."
                />
              </div>
            )}

            {/* NÚT BỐC BÀI */}
            <button
              type="submit"
              disabled={isReadingLoading}
              className="w-full mt-4 py-4 rounded-2xl silver-gradient-btn font-bold text-base flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed transition cursor-pointer shadow-xl hover:scale-[1.01]"
            >
              {isReadingLoading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin text-slate-950" />
                  <span>AI đang phân tích câu hỏi & kết nối năng lượng lá bài...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-5 h-5 text-slate-950" />
                  <span>Xáo Bài & Rút 3 Lá Bài</span>
                  <ArrowRight className="w-5 h-5 text-slate-950" />
                </>
              )}
            </button>
          </form>
        </div>
      )}

      {/* 🎴 PHẦN 2: KHI ĐÃ CÓ KẾT QUẢ -> BÀN TRẢI BÀI 3D + BẢN LUẬN GIẢI + CHAT */}
      {readingResult && (
        <div className="space-y-12 animate-fade-in">
          <div className="text-center max-w-3xl mx-auto">
            <h1 className="text-xl sm:text-3xl font-bold text-white leading-relaxed">
              &ldquo;{readingResult.userQuestion}&rdquo;
            </h1>
            <p className="mt-2 text-xs sm:text-sm text-slate-400">
              Chạm vào từng lá bài úp bên dưới để lật mở năng lượng vũ trụ dành cho bạn
            </p>
          </div>

          {/* BÀN TRẢI BÀI */}
          <div className="py-8 px-4 rounded-3xl silver-card">
            <div className="flex flex-wrap justify-center items-center gap-6 sm:gap-10">
              {readingResult.drawnCards.map((card, idx) => (
                <TarotCard3D
                  key={card.id || card.cardId || card.card?.id || idx}
                  card={card}
                  index={idx}
                  onFlip={() => setFlippedCount((prev) => prev + 1)}
                />
              ))}
            </div>
          </div>

          {/* BẢN LUẬN GIẢI AI */}
          <div className="p-6 sm:p-10 rounded-3xl silver-card">
            <MarkdownRenderer content={readingResult.initialReading} />
          </div>

          {/* KHUNG CHAT */}
          <div className="space-y-4">
            <div className="flex items-center gap-2 silver-gradient-text text-lg font-bold">
              <MessageSquare className="w-5 h-5 text-slate-300" />
              <span>Trò Chuyện & Hỏi Sâu Với AI Reader</span>
            </div>
            <ChatBox readingId={readingResult.id || readingResult.readingId || 0} />
          </div>

          <div className="text-center pt-6">
            <button
              onClick={handleReset}
              className="px-6 py-3 rounded-2xl bg-white/[0.04] hover:bg-white/[0.08] border border-white/10 text-slate-200 hover:text-white font-medium text-sm inline-flex items-center gap-2 transition cursor-pointer"
            >
              <RotateCcw className="w-4 h-4 text-slate-300" />
              <span>Bốc Quẻ Bài Tarot Mới</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default function ReadingPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-[70vh] flex items-center justify-center">
          <Loader2 className="w-8 h-8 animate-spin text-slate-200" />
        </div>
      }
    >
      <ReadingContent />
    </Suspense>
  );
}