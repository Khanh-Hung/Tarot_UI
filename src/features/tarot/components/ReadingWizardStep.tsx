"use client";

import React, { useState, useEffect } from "react";
import {
  Sparkles,
  RotateCcw,
  BookOpen,
  CheckCircle2,
  Edit3,
  Zap,
  Gift,
  ArrowLeft,
  ArrowRight,
} from "lucide-react";
import { CustomSelect, OptionItem } from "@/components/ui/CustomSelect";
import { DeckCode, DeckDto, SpreadType, UserQuotaDto, ZodiacSign } from "../types/tarot.types";
import { tarotService } from "../services/tarotService";

export const QUESTION_POOLS = [
  "Nguồn năng lượng nào đang dẫn lối cho tôi hôm nay?",
  "Tôi nên lưu tâm điều gì trong công việc và định hướng sắp tới?",
  "Mối quan hệ hiện tại đang mang lại bài học quý giá nào cho tôi?",
  "Làm thế nào để tôi kết nối sâu sắc hơn với trực giác bản thân?",
  "Tôi có thể mở lòng đón nhận cơ hội mới nào trong tuần này?",
  "Thông điệp chữa lành nào mà tâm hồn tôi đang cần lắng nghe?",
  "Điều gì đang ngăn cản tôi tiến bước và cách để tôi vượt qua?",
  "Năng lượng tài chính và vận may của tôi đang biến chuyển ra sao?",
  "Làm sao để tôi đưa ra quyết định sáng suốt và bình tâm nhất?",
  "Bài học vũ trụ quan trọng nhất mà tôi đang trải qua là gì?",
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

export const SPREAD_OPTIONS: { type: SpreadType; title: string; subtitle: string; cards: number; icon: string }[] = [
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

interface ReadingWizardStepProps {
  step: 1 | 2;
  setStep: (step: 1 | 2) => void;
  question: string;
  setQuestion: (q: string) => void;
  deckCode: DeckCode;
  setDeckCode: (d: DeckCode) => void;
  spreadType: SpreadType;
  setSpreadType: (s: SpreadType) => void;
  selectedZodiac: ZodiacSign;
  setSelectedZodiac: (z: ZodiacSign) => void;
  decks: DeckDto[];
  quota: UserQuotaDto | null;
  errorMsg: string;
  onProceedToStep2: (e: React.FormEvent) => void;
  onStartReading: (e: React.FormEvent) => void;
  onOpenQuotaModal: () => void;
}

export const ReadingWizardStep: React.FC<ReadingWizardStepProps> = ({
  step,
  setStep,
  question,
  setQuestion,
  deckCode,
  setDeckCode,
  spreadType,
  setSpreadType,
  selectedZodiac,
  setSelectedZodiac,
  decks,
  quota,
  errorMsg,
  onProceedToStep2,
  onStartReading,
  onOpenQuotaModal,
}) => {
  const [aiSuggestions, setAiSuggestions] = useState<string[]>([
    "Lời khuyên vũ trụ dành cho công việc và sự nghiệp sắp tới?",
    "Mối quan hệ hiện tại đang cần tôi thấu hiểu điều gì?",
    "Năng lượng và cơ hội mới nào đang chờ đón tôi trong thời gian này?",
  ]);
  const [isGeneratingSuggestions, setIsGeneratingSuggestions] = useState(false);

  useEffect(() => {
    const shuffled = [...QUESTION_POOLS].sort(() => 0.5 - Math.random());
    setAiSuggestions(shuffled.slice(0, 3));
  }, []);

  const handleRefreshAiSuggestions = async () => {
    if (isGeneratingSuggestions) return;
    setIsGeneratingSuggestions(true);

    try {
      const [data] = await Promise.all([
        tarotService.getSuggestedQuestions(
          spreadType,
          selectedZodiac && selectedZodiac !== "UNKNOWN" ? selectedZodiac : undefined
        ),
        new Promise((resolve) => setTimeout(resolve, 450)),
      ]);
      if (data && data.length >= 3) {
        setAiSuggestions(data.slice(0, 3));
      } else {
        const shuffled = [...QUESTION_POOLS].sort(() => 0.5 - Math.random());
        setAiSuggestions(shuffled.slice(0, 3));
      }
    } catch {
      const shuffled = [...QUESTION_POOLS].sort(() => 0.5 - Math.random());
      setAiSuggestions(shuffled.slice(0, 3));
    } finally {
      setIsGeneratingSuggestions(false);
    }
  };

  const zodiacOptions: OptionItem[] = [
    { value: "UNKNOWN", label: "-- Không áp dụng năng lượng Hoàng Đạo --" },
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

  return (
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
        <form onSubmit={onProceedToStep2} className="space-y-4 animate-in fade-in slide-in-from-left-2">
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

            {isGeneratingSuggestions ? (
              <div className="space-y-1.5 animate-in fade-in duration-150" aria-label="Đang tải gợi ý mới">
                {["w-4/5 sm:w-3/4", "w-3/4 sm:w-2/3", "w-5/6 sm:w-4/5"].map((widthClass, idx) => (
                  <div
                    key={idx}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-[#31333a] bg-[#212227] flex items-center justify-between gap-2 animate-pulse"
                  >
                    <div className="flex items-center gap-2.5 flex-1">
                      <div className="w-1.5 h-1.5 rounded-full bg-amber-400/40" />
                      <div className={`h-3 bg-zinc-700/60 rounded-md ${widthClass}`} />
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="space-y-1.5 animate-in fade-in duration-200">
                {aiSuggestions.map((suggested, idx) => {
                  const isSelected = question === suggested;
                  return (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => setQuestion(suggested)}
                      className={`w-full text-left px-3.5 py-2 rounded-xl border text-xs leading-relaxed transition-all duration-200 flex items-center justify-between gap-2 cursor-pointer ${
                        isSelected
                          ? "bg-amber-500/10 border-amber-400/40 text-amber-200 font-medium shadow-sm"
                          : "bg-[#212227] hover:bg-[#282a30] border-[#31333a] text-zinc-300 hover:text-white"
                      }`}
                    >
                      <span className="flex items-center gap-2 min-w-0">
                        <span className={`w-1.5 h-1.5 rounded-full shrink-0 ${isSelected ? "bg-amber-400" : "bg-zinc-600"}`} />
                        <span className="truncate">{suggested}</span>
                      </span>
                      <span className="text-[10px] text-zinc-500 shrink-0 uppercase tracking-wider font-semibold">
                        Chọn
                      </span>
                    </button>
                  );
                })}
              </div>
            )}
          </div>

          <div className="pt-2">
            <button
              type="submit"
              disabled={!question.trim()}
              className="w-full py-3 rounded-2xl silver-gradient-btn text-zinc-950 font-bold text-xs sm:text-sm flex items-center justify-center gap-2 transition cursor-pointer shadow-lg disabled:opacity-50 hover:scale-[1.01] active:scale-98"
            >
              <span>Tiếp Tục: Chọn Bộ Bài & Kiểu Trải</span>
              <ArrowRight className="w-4 h-4 text-zinc-950" />
            </button>
          </div>
        </form>
      )}

      {/* ====== BƯỚC 2: CẤU HÌNH & BỐC BÀI ====== */}
      {step === 2 && (
        <form onSubmit={onStartReading} className="space-y-4 animate-in fade-in slide-in-from-right-2">
          <div className="text-center mb-2">
            <h1 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
              Thiết Lập Trải Bài & Năng Lượng
            </h1>
            <p className="mt-0.5 text-xs text-zinc-400">
              Lựa chọn phương thức kết nối trực giác phù hợp với tâm nguyện của bạn
            </p>
          </div>

          {/* CÂU HỎI ĐÃ CHỌN */}
          <div className="p-3 rounded-xl bg-[#212227] border border-[#31333a] flex items-center justify-between gap-3">
            <div className="min-w-0 flex-1">
              <span className="text-[10px] uppercase font-bold text-zinc-500 tracking-wider block">
                Câu hỏi của bạn:
              </span>
              <p className="text-xs text-zinc-200 font-medium truncate mt-0.5">
                &ldquo;{question}&rdquo;
              </p>
            </div>
            <button
              type="button"
              onClick={() => setStep(1)}
              className="text-[11px] text-amber-300 hover:text-amber-200 font-semibold flex items-center gap-1 cursor-pointer shrink-0 transition"
            >
              <Edit3 className="w-3 h-3" />
              <span>Sửa</span>
            </button>
          </div>

          {/* CHỌN KIỂU TRẢI BÀI */}
          <div>
            <label className="text-xs font-semibold text-zinc-200 mb-2 block">
              Kiểu Trải Bài Tarot
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
              {SPREAD_OPTIONS.map((opt) => {
                const isSelected = spreadType === opt.type;
                return (
                  <button
                    key={opt.type}
                    type="button"
                    onClick={() => setSpreadType(opt.type)}
                    className={`p-3 rounded-2xl border text-left transition-all duration-200 flex flex-col justify-between gap-2 cursor-pointer ${
                      isSelected
                        ? "bg-amber-500/10 border-amber-400/50 shadow-md ring-1 ring-amber-400/30"
                        : "bg-[#212227] hover:bg-[#282a30] border-[#31333a] text-zinc-400"
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-xl">{opt.icon}</span>
                      <span
                        className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${
                          isSelected
                            ? "bg-amber-400/20 border-amber-400/40 text-amber-300"
                            : "bg-zinc-800 border-zinc-700 text-zinc-400"
                        }`}
                      >
                        {opt.cards} lá bài
                      </span>
                    </div>
                    <div>
                      <div className={`text-xs font-bold ${isSelected ? "text-white" : "text-zinc-300"}`}>
                        {opt.title}
                      </div>
                      <p className="text-[10px] text-zinc-400 line-clamp-2 mt-0.5 leading-snug">
                        {opt.subtitle}
                      </p>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* CUNG HOÀNG ĐẠO & BỘ BÀI */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
            <div>
              <label className="text-xs font-semibold text-zinc-200 mb-1 flex items-center justify-between">
                <span>Năng Lượng Cung Hoàng Đạo</span>
                {selectedZodiac && selectedZodiac !== "UNKNOWN" && (
                  <span className="text-[10px] font-bold text-amber-300">Đã chọn</span>
                )}
              </label>
              <CustomSelect
                options={zodiacOptions}
                value={selectedZodiac}
                onChange={(val) => setSelectedZodiac(val as ZodiacSign)}
                placeholder="Chọn Cung Hoàng Đạo..."
              />
            </div>

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
            <span className="flex items-center gap-1.5 shrink-0">
              <Zap className={`w-3.5 h-3.5 shrink-0 ${quota ? (quota.availableReadings > 0 ? "text-amber-400 fill-amber-400/30" : "text-red-400") : "text-zinc-500 animate-pulse"}`} />
              <span className="sm:hidden">Năng lượng:</span>
              <span className="hidden sm:inline">Năng lượng trải bài:</span>
            </span>
            <button
              type="button"
              onClick={onOpenQuotaModal}
              className="text-amber-300 hover:text-amber-200 font-semibold underline underline-offset-2 flex items-center gap-1 cursor-pointer whitespace-nowrap text-right"
            >
              <span>{quota ? `${quota.availableReadings} lượt khả dụng` : "Đang kiểm tra..."}</span>
              <span className="text-[10px] text-zinc-400 font-normal hidden sm:inline">(Xem thêm / Nhận thêm)</span>
              <span className="text-[10px] text-amber-400/80 font-normal sm:hidden">(+ Nhận thêm)</span>
            </button>
          </div>

          {/* ACTIONS: QUAY LẠI & TIẾN HÀNH TRẢI BÀI */}
          <div className="flex items-center gap-2.5 sm:gap-3 pt-1">
            <button
              type="button"
              onClick={() => setStep(1)}
              className="px-3.5 sm:px-4 py-3 rounded-2xl bg-[#212227] hover:bg-[#2b2c33] border border-[#31333a] text-zinc-300 font-semibold text-xs sm:text-sm flex items-center gap-1.5 transition cursor-pointer shrink-0 whitespace-nowrap"
            >
              <ArrowLeft className="w-4 h-4 shrink-0" />
              <span>Quay lại</span>
            </button>

            {quota && quota.availableReadings <= 0 ? (
              <button
                type="button"
                onClick={onOpenQuotaModal}
                className="flex-1 py-3 px-3 sm:px-5 rounded-2xl silver-gradient-btn text-zinc-950 font-bold text-xs sm:text-sm sm:text-base flex items-center justify-center gap-1.5 sm:gap-2 transition cursor-pointer shadow-lg hover:scale-[1.01] active:scale-95 whitespace-nowrap"
              >
                <Gift className="w-4 h-4 sm:w-5 sm:h-5 shrink-0 text-zinc-950" />
                <span className="sm:hidden">Nhận Thêm Lượt Bốc Bài</span>
                <span className="hidden sm:inline">Nhận Thêm Lượt Để Bốc Bài (Miễn Phí)</span>
              </button>
            ) : (
              <button
                type="submit"
                className="flex-1 py-3 px-3 sm:px-5 rounded-2xl silver-gradient-btn font-bold text-xs sm:text-sm sm:text-base flex items-center justify-center gap-1.5 sm:gap-2 transition cursor-pointer shadow-lg hover:scale-[1.01] whitespace-nowrap"
              >
                <Sparkles className="w-4 h-4 sm:w-5 sm:h-5 shrink-0 text-zinc-950" />
                <span className="sm:hidden">Xáo & Trải Bài</span>
                <span className="hidden sm:inline">Tiến Hành Xáo & Trải Bài Ra Bàn</span>
                <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5 shrink-0 text-zinc-950" />
              </button>
            )}
          </div>
        </form>
      )}
    </div>
  );
};
