"use client";

import React, { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Sparkles, HelpCircle, Star, RotateCcw, MessageSquare, Loader2, ArrowRight, ArrowLeft, Moon, BookOpen, Layers, CheckCircle2, Edit3, Zap, Video } from "lucide-react";
import { useAuth } from "@/features/auth/hooks/useAuth";
import {
  CreateReadingResponse,
  DeckCode,
  DeckDto,
  SpreadType,
  ZodiacSign,
  UserQuotaDto,
} from "@/features/tarot/types/tarot.types";
import { tarotService } from "@/features/tarot/services/tarotService";
import { TarotCard3D } from "@/features/tarot/components/TarotCard3D";
import { MarkdownRenderer } from "@/features/chat/components/MarkdownRenderer";
import { ChatBox } from "@/features/chat/components/ChatBox";
import { CustomSelect, OptionItem } from "@/components/ui/CustomSelect";
import { getFriendlyErrorMessage } from "@/lib/errorMapping";
import { EnergyQuotaModal } from "@/features/ads/components/EnergyQuotaModal";

import { ThreeTarotFan } from "@/features/tarot/components/ThreeTarotFan";
import { ReadingFormSkeleton } from "@/components/ui/Skeleton";

const ZODIAC_LIST: { code: ZodiacSign; name: string; symbol: string }[] = [
  { code: "ARIES", name: "Bạch Dương", symbol: "♈" },
  { code: "TAURUS", name: "Kim Ngưu", symbol: "♉" },
  { code: "GEMINI", name: "Song Tử", symbol: "♊" },
  { code: "CANCER", name: "Cự Giải", symbol: "♋" },
  { code: "LEO", name: "Sư Tử", symbol: "♌" },
  { code: "VIRGO", name: "Xử Nữ", symbol: "♍" },
  { code: "LIBRA", name: "Thiên Bình", symbol: "♎" },
  { code: "SCORPIO", name: "Bọ Cạp", symbol: "♏" },
  { code: "SAGITTARIUS", name: "Nhân Mã", symbol: "♐" },
  { code: "CAPRICORN", name: "Ma Kết", symbol: "♑" },
  { code: "AQUARIUS", name: "Bảo Bình", symbol: "♒" },
  { code: "PISCES", name: "Song Ngư", symbol: "♓" },
];

const QUESTION_POOLS: string[] = [
  "Lời khuyên vũ trụ dành cho công việc và sự nghiệp sắp tới?",
  "Mối quan hệ hiện tại đang cần tôi thấu hiểu điều gì?",
  "Năng lượng và cơ hội mới nào đang chờ đón tôi trong thời gian này?",
  "Tôi nên buông bỏ điều gì để đón nhận bình an và thịnh vượng?",
  "Quyết định sắp tới của tôi có dẫn tới kết quả tích cực không?",
  "Nút thắt tâm lý nào đang cản trở bước tiến của tôi?",
  "Thông điệp chữa lành tâm hồn sâu sắc nhất lúc này là gì?",
  "Người ấy đang có cảm xúc và suy nghĩ gì về mối liên kết này?",
  "Lộ trình tài chính nào giúp tôi đạt được sự tự chủ và vững vàng?",
  "Điều bất ngờ tích cực nào đang trên đường đến với cuộc sống của tôi?",
  "Làm thế nào để tôi cân bằng giữa công việc bận rộn và bình yên nội tại?",
  "Bài học lớn nhất mà giai đoạn này đang dạy cho tôi là gì?",
  "Tôi nên chuẩn bị tinh thần ra sao trước bước ngoặt mới?",
  "Xu hướng tình cảm của tôi trong thời gian tới sẽ biến chuyển thế nào?",
  "Có ngả rẽ tiềm năng nào mà tôi chưa nhận ra hay chưa dám thử?",
  "Tôi cần làm gì để vượt qua cảm giác mông lung và tìm lại đam mê?",
  "Làm sao để giải tỏa những lo âu vô cớ và tìm lại sự tự tin vốn có?",
  "Nguồn năng lượng nào đang ủng hộ và bảo bọc tôi lúc này?",
  "Làm thế nào để tôi tha thứ cho quá khứ và vững bước về phía trước?",
  "Tôi nên lắng nghe trực giác hay lý trí trong tình huống hiện tại?",
];

function ReadingContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { user, isAuthenticated, isLoading: isAuthLoading, updateUserZodiac } = useAuth();

  const [stage, setStage] = useState<"FORM" | "PICKING" | "RESULT">("FORM");
  const [question, setQuestion] = useState("");
  const initialDeck = (searchParams.get("deckCode") as DeckCode) || "RIDER_WAITE_CLASSIC";
  const [deckCode, setDeckCode] = useState<DeckCode>(initialDeck);
  const [spreadType, setSpreadType] = useState<SpreadType>("DAILY_ORACLE");
  const [selectedZodiac, setSelectedZodiac] = useState<ZodiacSign>(
    (user?.zodiacSign as ZodiacSign) || "UNKNOWN"
  );
  const [decks, setDecks] = useState<DeckDto[]>([]);

  const SPREAD_OPTIONS: { type: SpreadType; title: string; subtitle: string; cards: number; icon: string }[] = [
    {
      type: "DAILY_ORACLE",
      title: "Thông Điệp Ngày Mới",
      subtitle: "Nguồn năng lượng chủ đạo và lời chỉ dẫn vũ trụ dành cho bạn hôm nay",
      cards: 1,
      icon: "☀️",
    },
    {
      type: "PAST_PRESENT_FUTURE",
      title: "Quá Khứ - Hiện Tại - Tương Lai",
      subtitle: "Thấu suốt gốc rễ quá khứ, nút thắt hiện tại và chiều hướng tương lai",
      cards: 3,
      icon: "⏳",
    },
    {
      type: "TWO_PATHS_CHOICE",
      title: "Thực Tại & Hai Ngả Rẽ",
      subtitle: "So sánh chuyển biến khi bạn đang phân vân giữa hai ngả đường lựa chọn",
      cards: 3,
      icon: "⚖️",
    },
  ];

  const [isReadingLoading, setIsReadingLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [readingResult, setReadingResult] = useState<CreateReadingResponse | null>(null);
  const [, setFlippedCount] = useState(0);

  useEffect(() => {
    async function loadDecks() {
      try {
        const data = await tarotService.getDecks();
        setDecks(data);
      } catch (e) {
        console.error(e);
      }
    }
    loadDecks();
  }, []);

  // Tự động chọn Cung Hoàng Đạo từ thông tin tài khoản người dùng khi đã đăng nhập
  useEffect(() => {
    if (user?.zodiacSign && user.zodiacSign !== "UNKNOWN") {
      setSelectedZodiac(user.zodiacSign as ZodiacSign);
    }
  }, [user?.zodiacSign]);

  // Luôn cuộn lên đỉnh trang khi chuyển sang màn hình kết quả luận giải
  useEffect(() => {
    if (stage === "RESULT") {
      window.scrollTo({ top: 0, behavior: "instant" });
    }
  }, [stage]);

  const [step, setStep] = useState<1 | 2>(1);
  const [quota, setQuota] = useState<UserQuotaDto | null>(null);
  const [isQuotaModalOpen, setIsQuotaModalOpen] = useState(false);

  // Lấy và đồng bộ hạn mức lượt bói của người dùng
  useEffect(() => {
    if (!isAuthenticated || !user?.userId) return;

    const loadQuota = async () => {
      try {
        const q = await tarotService.getUserQuota(user.userId);
        setQuota(q);
      } catch (e) {
        // Silent catch in dev
      }
    };

    loadQuota();

    const handleQuotaUpdated = (event: any) => {
      if (event?.detail) {
        setQuota(event.detail);
      } else {
        loadQuota();
      }
    };

    window.addEventListener("tarot_quota_updated", handleQuotaUpdated);
    return () => {
      window.removeEventListener("tarot_quota_updated", handleQuotaUpdated);
    };
  }, [isAuthenticated, user?.userId]);

  const [aiSuggestions, setAiSuggestions] = useState<string[]>([
    "Lời khuyên vũ trụ dành cho công việc và sự nghiệp sắp tới?",
    "Mối quan hệ hiện tại đang cần tôi thấu hiểu điều gì?",
    "Năng lượng và cơ hội mới nào đang chờ đón tôi trong thời gian này?",
  ]);
  const [isGeneratingSuggestions, setIsGeneratingSuggestions] = useState(false);
  const [cursorTooltip, setCursorTooltip] = useState<{ text: string; x: number; y: number } | null>(null);

  // Tự động bốc 3 câu hỏi mới tức thì ngay khi vào trang (0ms delay, không chờ mạng)
  useEffect(() => {
    const shuffled = [...QUESTION_POOLS].sort(() => 0.5 - Math.random());
    setAiSuggestions(shuffled.slice(0, 3));
  }, []);

  const handleRefreshAiSuggestions = async () => {
    setIsGeneratingSuggestions(true);

    // Lọc ra các câu hỏi không nằm trong 3 câu hiện tại (đảm bảo 100% đổi mới tức thì)
    const candidates = QUESTION_POOLS.filter((q) => !aiSuggestions.includes(q));
    const shuffled = [...candidates].sort(() => 0.5 - Math.random());
    const nextThree = shuffled.slice(0, 3);
    setAiSuggestions(nextThree);

    // Đồng thời gọi Backend AI để lấy 3 câu mới do Gemini trực tiếp sáng tạo
    try {
      const data = await tarotService.getSuggestedQuestions(
        spreadType,
        selectedZodiac && selectedZodiac !== "UNKNOWN" ? selectedZodiac : undefined
      );
      if (data && data.length >= 3) {
        setAiSuggestions(data.slice(0, 3));
      }
    } catch {
      // Giữ nextThree tức thì
    } finally {
      setIsGeneratingSuggestions(false);
    }
  };

  // Chuyển từ Bước 1 (Câu hỏi) sang Bước 2 (Thiết lập trải bài)
  const handleProceedToStep2 = (e: React.FormEvent) => {
    e.preventDefault();
    if (!isAuthenticated) {
      router.push("/login");
      return;
    }
    if (!question.trim()) {
      setErrorMsg("Vui lòng nhập câu hỏi bạn đang trăn trở để vũ trụ kết nối năng lượng.");
      return;
    }
    if (selectedZodiac === "UNKNOWN" && user?.zodiacSign && user.zodiacSign !== "UNKNOWN") {
      setSelectedZodiac(user.zodiacSign as ZodiacSign);
    }
    setErrorMsg("");
    setStep(2);
  };

  // Chuyển từ Form sang Bàn xòe bài 78 lá
  const handleProceedToPicking = (e: React.FormEvent) => {
    e.preventDefault();
    if (!isAuthenticated) {
      router.push("/login");
      return;
    }
    if (!question.trim()) {
      setStep(1);
      setErrorMsg("Vui lòng nhập câu hỏi bạn đang trăn trở.");
      return;
    }

    const needsZodiac = !user?.zodiacSign || user.zodiacSign === "UNKNOWN";
    if (needsZodiac && (!selectedZodiac || selectedZodiac === "UNKNOWN")) {
      setErrorMsg("Vui lòng chọn Cung Hoàng Đạo để AI kết nối năng lượng chính xác nhất.");
      return;
    }

    const isOracle = spreadType === "DAILY_ORACLE";
    const canProceed = isOracle
      ? (quota ? (quota.dailyFreeRemaining > 0 || quota.bonusReadings > 0) : true)
      : (quota ? quota.bonusReadings > 0 : true);

    if (quota && !canProceed) {
      setIsQuotaModalOpen(true);
      return;
    }

    setErrorMsg("");
    setStage("PICKING");
  };

  // Người dùng xác nhận 3 lá bài đã tự tay bốc
  const handleConfirmSelectedCards = async (
    picked: { cardId: string | number; isReversed: boolean }[]
  ) => {
    const isOracle = spreadType === "DAILY_ORACLE";
    const canRead = isOracle
      ? (quota ? (quota.dailyFreeRemaining > 0 || quota.bonusReadings > 0) : true)
      : (quota ? quota.bonusReadings > 0 : true);

    if (quota && !canRead) {
      setIsQuotaModalOpen(true);
      return;
    }

    setErrorMsg("");
    setIsReadingLoading(true);
    const startTimestamp = Date.now();

    try {
      const resultPromise = tarotService.createReading({
        userId: user!.userId,
        userQuestion: question,
        deckCode,
        zodiacSign: selectedZodiac !== "UNKNOWN" ? selectedZodiac : undefined,
        spreadType,
        selectedCardIds: picked.map((p) => p.cardId),
        isReversedList: picked.map((p) => p.isReversed),
      });

      // Chạy song song: Đảm bảo hiệu ứng lật 3D chạy xong tối thiểu 2000ms rồi chuyển kết quả ngay
      const [result] = await Promise.all([
        resultPromise,
        new Promise((resolve) => {
          const elapsed = Date.now() - startTimestamp;
          const remaining = Math.max(0, 2000 - elapsed);
          setTimeout(resolve, remaining);
        }),
      ]);

      setReadingResult(result);
      setFlippedCount(0);
      setStage("RESULT");
      if (selectedZodiac !== "UNKNOWN") {
        updateUserZodiac(selectedZodiac);
      }

      // Thông báo toàn app cập nhật lại số lượt bói (đã dùng 1 lượt)
      if (typeof window !== "undefined") {
        window.dispatchEvent(new CustomEvent("tarot_quota_updated"));
      }
    } catch (err: any) {
      const msg = getFriendlyErrorMessage(err, "Không thể thực hiện quẻ bói lúc này. Vui lòng thử lại sau.");
      if (msg.includes("hết lượt") || err?.response?.data?.error?.code === "DAILY_QUOTA_EXCEEDED") {
        setIsQuotaModalOpen(true);
      }
      setErrorMsg(msg);
    } finally {
      setIsReadingLoading(false);
    }
  };

  const handleReset = () => {
    setReadingResult(null);
    setQuestion("");
    setFlippedCount(0);
    setStep(1);
    setStage("FORM");
    if (user?.zodiacSign && user.zodiacSign !== "UNKNOWN") {
      setSelectedZodiac(user.zodiacSign as ZodiacSign);
    }
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
    icon: "🎴",
  }));

  if (isAuthLoading) {
    return <ReadingFormSkeleton />;
  }

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      {/* 🔮 GIAI ĐOẠN 1: FORM NGHI THỨC 2 BƯỚC (WIZARD - ZERO SCROLL) */}
      {stage === "FORM" && (
        <div className="max-w-2xl mx-auto p-6 sm:p-8 rounded-3xl border border-[#31333a] bg-[#191a1e] shadow-2xl transition-all">
          {/* STEP INDICATOR HEADER */}
          <div className="flex items-center justify-between mb-5 pb-4 border-b border-[#2c2e35]">
            <div className="flex items-center gap-2">
              <div
                className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold transition-all ${
                  step === 1
                    ? "bg-zinc-100 text-zinc-950 shadow-md ring-2 ring-zinc-400/30"
                    : "bg-emerald-500/20 text-emerald-300 border border-emerald-500/40"
                }`}
              >
                {step === 2 ? <CheckCircle2 className="w-4 h-4 text-emerald-400" /> : "1"}
              </div>
              <span className={`text-xs font-semibold ${step === 1 ? "text-white" : "text-zinc-400"}`}>
                Tâm Niệm Câu Hỏi
              </span>
            </div>

            <div className="h-px flex-1 max-w-[60px] sm:max-w-[100px] bg-zinc-700/60 mx-2" />

            <div className="flex items-center gap-2">
              <div
                className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold transition-all ${
                  step === 2
                    ? "bg-zinc-100 text-zinc-950 shadow-md ring-2 ring-zinc-400/30"
                    : "bg-[#25262c] text-zinc-500 border border-zinc-700/50"
                }`}
              >
                2
              </div>
              <span className={`text-xs font-semibold ${step === 2 ? "text-white" : "text-zinc-500"}`}>
                Thiết Lập Trải Bài
              </span>
            </div>
          </div>

          {errorMsg && (
            <div className="mb-4 p-3 rounded-xl bg-rose-950/40 border border-rose-500/30 text-xs text-rose-200 text-center animate-in fade-in">
              {errorMsg}
            </div>
          )}

          {/* ====== BƯỚC 1: NHẬP CÂU HỎI ====== */}
          {step === 1 && (
            <form onSubmit={handleProceedToStep2} className="space-y-4 animate-in fade-in slide-in-from-left-2">
              <div className="text-center mb-3">
                <h1 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
                  Bạn Đang Trăn Trở Điều Gì?
                </h1>
                <p className="mt-1 text-xs text-zinc-400">
                  Hãy nhắm mắt vài giây, hít thở sâu và ghi lại câu hỏi bạn mong muốn nhận chỉ dẫn
                </p>
              </div>

              <div>
                <textarea
                  required
                  rows={3}
                  value={question}
                  onChange={(e) => setQuestion(e.target.value)}
                  placeholder="Ví dụ: Công việc sắp tới của tôi sẽ có cơ hội thăng tiến nào không? Hay: Mối quan hệ hiện tại giữa tôi và người ấy đang có chuyển biến gì?"
                  className="w-full bg-[#212227] border border-[#31333a] focus:border-zinc-400 rounded-2xl p-3.5 text-xs sm:text-sm text-zinc-100 placeholder-zinc-500 focus:outline-none transition leading-relaxed resize-none shadow-inner"
                />
              </div>

              {/* Gợi ý chủ đề nhanh */}
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-[11px] font-medium text-zinc-400 flex items-center gap-1.5">
                    <Sparkles className="w-3 h-3 text-amber-400" />
                    <span>Gợi ý câu hỏi:</span>
                  </span>
                  <button
                    type="button"
                    disabled={isGeneratingSuggestions}
                    onClick={handleRefreshAiSuggestions}
                    className="inline-flex items-center gap-1 text-[11px] font-semibold text-amber-300 hover:text-amber-200 transition-colors cursor-pointer disabled:opacity-50"
                  >
                    <RotateCcw className={`w-3 h-3 ${isGeneratingSuggestions ? "animate-spin text-amber-400" : ""}`} />
                    <span>{isGeneratingSuggestions ? "Đang đổi..." : "Đổi gợi ý mới ✨"}</span>
                  </button>
                </div>

                <div key={aiSuggestions.join("-")} className="space-y-1.5 animate-in fade-in duration-200">
                  {aiSuggestions.map((preset, idx) => {
                    const isSelected = question === preset;
                    return (
                      <button
                        key={idx}
                        type="button"
                        onClick={() => setQuestion(preset)}
                        className={`w-full text-left px-3.5 py-2.5 rounded-xl border text-xs transition-all cursor-pointer flex items-center justify-between gap-2 group active:scale-[0.99] ${
                          isSelected
                            ? "bg-amber-400/10 border-amber-400/70 text-amber-200 ring-1 ring-amber-400/30 shadow-sm"
                            : "bg-[#212227] hover:bg-[#282a32] border-[#31333a] hover:border-zinc-500 text-zinc-300 hover:text-zinc-100"
                        }`}
                      >
                        <span className="truncate">{preset}</span>
                        <span
                          className={`text-[10px] shrink-0 font-medium transition-opacity ${
                            isSelected
                              ? "text-amber-300 opacity-100 flex items-center gap-1 font-bold"
                              : "text-zinc-500 group-hover:text-amber-300 opacity-0 group-hover:opacity-100"
                          }`}
                        >
                          {isSelected ? "✓ Đã chọn" : "Dùng câu này ➔"}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>

              <button
                type="submit"
                className="w-full mt-2 py-3.5 rounded-2xl silver-gradient-btn font-bold text-sm sm:text-base flex items-center justify-center gap-2 transition cursor-pointer shadow-lg hover:scale-[1.01]"
              >
                <span>Tiếp Tục Thiết Lập Trải Bài</span>
                <ArrowRight className="w-4 h-4 text-zinc-950" />
              </button>
            </form>
          )}

          {/* ====== BƯỚC 2: THIẾT LẬP TRẢI BÀI & CUNG HOÀNG ĐẠO ====== */}
          {step === 2 && (
            <form onSubmit={handleProceedToPicking} className="space-y-4 animate-in fade-in slide-in-from-right-2">
              {/* Mini Preview câu hỏi */}
              <div className="p-3 rounded-2xl bg-[#212227] border border-[#31333a] flex items-center justify-between gap-3">
                <div className="min-w-0 flex-1">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-amber-300">
                    Câu hỏi đã tâm niệm:
                  </span>
                  <p className="text-xs text-zinc-200 truncate italic mt-0.5">&ldquo;{question}&rdquo;</p>
                </div>
                <button
                  type="button"
                  onClick={() => setStep(1)}
                  className="px-2.5 py-1 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-zinc-300 text-[11px] flex items-center gap-1 shrink-0 transition cursor-pointer border border-zinc-700/60"
                >
                  <Edit3 className="w-3 h-3 text-zinc-400" />
                  <span>Sửa</span>
                </button>
              </div>

              {/* KIỂU TRẢI BÀI */}
              <div>
                <label className="text-xs font-semibold text-zinc-200 mb-1.5 flex items-center justify-between">
                  <span className="flex items-center gap-1.5">
                    <Layers className="w-4 h-4 text-zinc-400" />
                    <span>Chọn Kiểu Trải Bài</span>
                  </span>
                  <span className="text-[11px] text-amber-300/90 font-medium">
                    {spreadType === "DAILY_ORACLE" ? "Rút 1 lá bài" : "Rút 3 lá bài"}
                  </span>
                </label>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                  {SPREAD_OPTIONS.map((opt) => {
                    const isSelected = spreadType === opt.type;
                    const isOracle = opt.type === "DAILY_ORACLE";
                    const is3CardLocked = !isOracle && quota && (quota.bonusReadings ?? 0) <= 0;
                    return (
                      <div key={opt.type} className="relative">
                        <button
                          type="button"
                          onClick={() => setSpreadType(opt.type)}
                          onMouseEnter={(e) => setCursorTooltip({ text: opt.subtitle, x: e.clientX, y: e.clientY })}
                          onMouseMove={(e) => setCursorTooltip({ text: opt.subtitle, x: e.clientX, y: e.clientY })}
                          onMouseLeave={() => setCursorTooltip(null)}
                          className={`w-full px-2.5 py-3 sm:px-3 rounded-2xl text-left border transition-all cursor-pointer flex flex-col justify-between ${
                            isSelected
                              ? "bg-zinc-800/90 border-zinc-400 text-white shadow-md ring-1 ring-zinc-400/30"
                              : "bg-[#212227] border-[#31333a] text-zinc-300 hover:border-zinc-500 hover:bg-[#26272e]"
                          }`}
                        >
                          <div className="flex items-center justify-between gap-2 mb-1.5">
                            <span className="text-base">{opt.icon}</span>
                            <span
                              className={`text-[9px] font-bold px-1.5 py-0.5 rounded-full ${
                                isOracle
                                  ? (quota?.dailyFreeRemaining ?? 1) > 0
                                    ? "bg-emerald-500/20 text-emerald-300 border border-emerald-500/30"
                                    : "bg-zinc-700/50 text-zinc-400"
                                  : is3CardLocked
                                  ? "bg-amber-500/20 text-amber-300 border border-amber-500/30"
                                  : "bg-purple-500/20 text-purple-300 border border-purple-500/30"
                              }`}
                            >
                              {isOracle
                                ? (quota?.dailyFreeRemaining ?? 1) > 0
                                  ? "1 lá • Free"
                                  : "1 lá"
                                : is3CardLocked
                                ? "3 lá • 🎬 QC"
                                : "3 lá • Khả dụng"}
                            </span>
                          </div>
                          <h4 className="text-[11px] sm:text-xs font-bold leading-snug whitespace-nowrap tracking-tight text-zinc-100">
                            {opt.title}
                          </h4>
                        </button>
                      </div>
                    );
                  })}
                </div>

                {/* Dòng mô tả tinh gọn cho thẻ đang chọn (Tối ưu hoàn hảo cho cả Mobile & Desktop) */}
                <div className="mt-2 px-3 py-2 rounded-xl bg-[#1a1b20] border border-[#2b2d35] flex items-center justify-between gap-2 text-xs">
                  <div className="flex items-center gap-2 truncate">
                    <span className="text-amber-300 shrink-0 font-bold text-[10px] uppercase tracking-wider">Ý nghĩa:</span>
                    <span className="text-[11px] text-zinc-300 truncate">
                      {SPREAD_OPTIONS.find((s) => s.type === spreadType)?.subtitle}
                    </span>
                  </div>
                  {spreadType !== "DAILY_ORACLE" && (quota?.bonusReadings ?? 0) <= 0 && (
                    <button
                      type="button"
                      onClick={() => setIsQuotaModalOpen(true)}
                      className="shrink-0 flex items-center gap-1 text-[10px] text-amber-300 font-bold bg-amber-500/15 border border-amber-500/30 px-2 py-0.5 rounded-full hover:bg-amber-500/25 transition cursor-pointer"
                    >
                      <span>🎬 Xem QC mở khóa</span>
                    </button>
                  )}
                </div>
              </div>

              {/* HÀNG NGANG: CUNG HOÀNG ĐẠO & BỘ BÀI */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {/* CUNG HOÀNG ĐẠO */}
                <div>
                  <label className="text-xs font-semibold text-zinc-200 mb-1 flex items-center gap-1.5">
                    <Star className="w-3.5 h-3.5 text-zinc-400" />
                    <span>Cung Hoàng Đạo của bạn *</span>
                  </label>
                  <CustomSelect
                    options={zodiacOptions}
                    value={selectedZodiac}
                    onChange={(val) => setSelectedZodiac(val as ZodiacSign)}
                    placeholder="-- Chọn cung hoàng đạo --"
                  />
                </div>

                {/* BỘ BÀI TAROT */}
                {decks.length > 0 && (
                  <div>
                    <label className="text-xs font-semibold text-zinc-200 mb-1 flex items-center gap-1.5">
                      <BookOpen className="w-3.5 h-3.5 text-zinc-400" />
                      <span>Bộ Bài Tarot Muốn Dùng</span>
                    </label>
                    <CustomSelect
                      options={deckOptions}
                      value={deckCode}
                      onChange={(val) => setDeckCode(val as DeckCode)}
                      placeholder="Chọn bộ bài Tarot..."
                    />
                  </div>
                )}
              </div>

              {/* NĂNG LƯỢNG TRẢI BÀI & HẠN MỨC */}
              <div className="flex items-center justify-between text-xs px-1 text-zinc-400">
                <span className="flex items-center gap-1.5">
                  <Zap className={`w-3.5 h-3.5 ${quota ? (quota.availableReadings > 0 ? "text-amber-400 fill-amber-400/30" : "text-red-400") : "text-zinc-500 animate-pulse"}`} />
                  <span>Năng lượng trải bài:</span>
                </span>
                <button
                  type="button"
                  onClick={() => setIsQuotaModalOpen(true)}
                  className="text-amber-300 hover:text-amber-200 font-semibold underline underline-offset-2 flex items-center gap-1 cursor-pointer"
                >
                  {quota ? `${quota.availableReadings} lượt khả dụng` : "Đang kiểm tra..."}
                  <span className="text-[10px] text-zinc-400 font-normal">(Xem thêm / Nhận thêm)</span>
                </button>
              </div>

              {/* ACTIONS: QUAY LẠI & TIẾN HÀNH TRẢI BÀI */}
              <div className="flex items-center gap-3 pt-1">
                <button
                  type="button"
                  onClick={() => setStep(1)}
                  className="px-4 py-3 rounded-2xl bg-[#212227] hover:bg-[#2b2d35] border border-[#31333a] text-zinc-300 font-semibold text-xs sm:text-sm flex items-center gap-1.5 transition cursor-pointer"
                >
                  <ArrowLeft className="w-4 h-4" />
                  <span>Quay lại</span>
                </button>

                {quota && quota.availableReadings <= 0 ? (
                  <button
                    type="button"
                    onClick={() => setIsQuotaModalOpen(true)}
                    className="flex-1 py-3 rounded-2xl silver-gradient-btn text-zinc-950 font-bold text-xs sm:text-sm sm:text-base flex items-center justify-center gap-2 transition cursor-pointer shadow-lg hover:scale-[1.01] active:scale-95"
                  >
                    <Video className="w-4 h-4 sm:w-5 sm:h-5 text-zinc-950" />
                    <span>Xem Video Nhận Lượt Để Bốc Bài (5s)</span>
                  </button>
                ) : (
                  <button
                    type="submit"
                    className="flex-1 py-3 rounded-2xl silver-gradient-btn font-bold text-xs sm:text-sm sm:text-base flex items-center justify-center gap-2 transition cursor-pointer shadow-lg hover:scale-[1.01]"
                  >
                    <Sparkles className="w-4 h-4 sm:w-5 sm:h-5 text-zinc-950" />
                    <span>Tiến Hành Xáo & Trải Bài Ra Bàn</span>
                    <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5 text-zinc-950" />
                  </button>
                )}
              </div>
            </form>
          )}
        </div>
      )}

      {/* 🎴 GIAI ĐOẠN 2: BÀN TRẢI 78 LÁ BÀI 3D THREE.JS CHO NGƯỜI DÙNG TỰ TAY BỐC BÀI */}
      {stage === "PICKING" && (
        <div className="space-y-4">
          {errorMsg && (
            <div className="max-w-md mx-auto p-3.5 rounded-xl bg-red-500/10 border border-red-500/30 text-red-300 text-xs text-center animate-shake">
              ⚠️ {errorMsg}
            </div>
          )}
          <ThreeTarotFan
            deckCode={deckCode}
            userQuestion={question}
            spreadType={spreadType}
            maxCards={spreadType === "DAILY_ORACLE" ? 1 : 3}
            onConfirmSelection={handleConfirmSelectedCards}
            onCancel={() => setStage("FORM")}
            isLoading={isReadingLoading}
          />
        </div>
      )}

      {/* 📜 GIAI ĐOẠN 3: KHI ĐÃ CÓ KẾT QUẢ -> BÀN TRẢI BÀI 3D + BẢN LUẬN GIẢI + CHAT */}
      {stage === "RESULT" && readingResult && (
        <div className="space-y-6 sm:space-y-8 animate-fade-in">
          {/* Header câu hỏi: Nhỏ gọn, tinh tế, tự ẩn khi không có câu hỏi */}
          {readingResult.userQuestion?.trim() && (
            <div className="text-center max-w-2xl mx-auto">
              <h2 className="text-base sm:text-lg font-semibold text-amber-100/90 leading-snug">
                &ldquo;{readingResult.userQuestion.trim()}&rdquo;
              </h2>
            </div>
          )}

          {/* BÀN TRẢI BÀI */}
          <div className="py-6 px-4 rounded-2xl border border-[#31333a] bg-[#191a1e] shadow-xl">
            <div className="flex flex-wrap justify-center items-start gap-5 sm:gap-8">
              {readingResult.drawnCards.map((card, idx) => (
                <TarotCard3D
                  key={card.id || card.cardId || card.card?.id || idx}
                  card={card}
                  index={idx}
                  isFlippedInitial={true}
                />
              ))}
            </div>
          </div>

          {/* BẢN LUẬN GIẢI AI */}
          <div className="p-6 sm:p-10 rounded-2xl border border-[#31333a] bg-[#191a1e] shadow-xl">
            <MarkdownRenderer content={readingResult.initialReading} />
          </div>

          {/* KHUNG CHAT */}
          <div className="space-y-4">
            <div className="flex items-center gap-2 text-zinc-100 text-base sm:text-lg font-bold">
              <MessageSquare className="w-5 h-5 text-amber-300" />
              <span>Hỏi thêm về quẻ bài</span>
            </div>
            <ChatBox readingId={readingResult.id || readingResult.readingId || 0} />
          </div>

          <div className="text-center pt-6">
            <button
              onClick={handleReset}
              className="px-6 py-3 rounded-2xl border border-[#3b3d46] bg-[#23242a] hover:bg-[#2b2c33] hover:border-[#525560] text-zinc-200 hover:text-white font-medium text-sm inline-flex items-center gap-2 transition cursor-pointer"
            >
              <RotateCcw className="w-4 h-4 text-slate-300" />
              <span>Bốc Quẻ Bài Tarot Mới</span>
            </button>
          </div>
        </div>
      )}

      {/* 🌟 CURSOR-FOLLOWING TOOLTIP: Bay nhẹ nhàng ngay cạnh con trỏ chuột trên Desktop */}
      {cursorTooltip && (
        <div
          className="fixed pointer-events-none z-[99999] hidden sm:block animate-in fade-in duration-75 select-none"
          style={{
            left: `${typeof window !== "undefined" && cursorTooltip.x + 250 > window.innerWidth ? cursorTooltip.x - 240 : cursorTooltip.x + 14}px`,
            top: `${typeof window !== "undefined" && cursorTooltip.y + 80 > window.innerHeight ? cursorTooltip.y - 60 : cursorTooltip.y + 14}px`,
            maxWidth: "240px",
          }}
        >
          <div className="rounded-xl border border-[#3b3d46] bg-[#1a1b20]/95 px-3 py-2 text-left text-xs text-zinc-200 shadow-2xl backdrop-blur-md">
            {cursorTooltip.text}
          </div>
        </div>
      )}

      {/* Modal Hạn Mức Năng Lượng & Xem Video Nhận Lượt */}
      <EnergyQuotaModal
        isOpen={isQuotaModalOpen}
        onClose={() => setIsQuotaModalOpen(false)}
        quota={quota}
        onQuotaUpdated={(newQuota) => setQuota(newQuota)}
        userId={user?.userId}
      />
    </div>
  );
}

export default function ReadingPage() {
  return (
    <Suspense fallback={<ReadingFormSkeleton />}>
      <ReadingContent />
    </Suspense>
  );
}