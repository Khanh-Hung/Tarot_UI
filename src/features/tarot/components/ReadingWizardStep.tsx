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
  SlidersHorizontal,
  ChevronDown,
  Calendar,
} from "lucide-react";
import { CustomSelect, OptionItem } from "@/components/ui/CustomSelect";
import { DatePicker } from "@/components/ui/DatePicker";
import { AlertBanner } from "@/components/ui/AlertBanner";
import { DeckCode, DeckDto, SpreadType, UserQuotaDto, ZodiacSign } from "../types/tarot.types";
import { RelationshipStatus } from "@/features/profile/types/profile.types";
import { detectTopicFromQuestion } from "../utils/topicDetector";
import { tarotService } from "../services/tarotService";
import {
  calculateZodiacFromDate,
  ZODIAC_DISPLAY_INFO,
} from "../utils/birthCalculations";

const RELATIONSHIP_OPTIONS: { code: RelationshipStatus; label: string; icon: string }[] = [
  { code: "SINGLE", label: "Độc thân", icon: "🌿" },
  { code: "DATING", label: "Tìm hiểu / Mập mờ", icon: "✨" },
  { code: "IN_RELATIONSHIP", label: "Đang yêu", icon: "❤️" },
  { code: "COMPLICATED", label: "Phức tạp / Trục trặc", icon: "🌀" },
  { code: "MARRIED", label: "Đã kết hôn", icon: "💍" },
];

export const QUESTION_POOLS = [
  "Công việc hiện tại của tôi sắp tới có cơ hội thăng tiến hay tăng lương không?",
  "Tôi có nên chuyển việc hoặc tìm hướng đi mới vào thời điểm này không?",
  "Người ấy có thực sự nghiêm túc và có tình cảm thật lòng với tôi không?",
  "Mối quan hệ hiện tại giữa hai chúng tôi có tương lai đi đường dài không?",
  "Tài chính và thu nhập của tôi trong vài tháng tới sẽ biến chuyển thế nào?",
  "Tôi có nên đầu tư hoặc góp vốn làm ăn trong giai đoạn này không?",
  "Tôi đang phân vân giữa hai lựa chọn, hướng đi nào sẽ mang lại kết quả tốt hơn?",
  "Tôi nên làm gì để giải tỏa áp lực công việc và lấy lại động lực phát triển?",
  "Người ấy có đang giấu giếm điều gì hoặc có hình bóng ai khác không?",
  "Dự án hoặc kế hoạch kinh doanh sắp tới của tôi có gặp trở ngại gì không?",
  "Tôi cần thay đổi điều gì ở bản thân để công việc và tình duyên suôn sẻ hơn?",
  "Mối quan hệ này tôi nên tiếp tục kiên nhẫn hay đã đến lúc buông tay?",
  "Làm thế nào để tôi cải thiện tài chính và quản lý chi tiêu hiệu quả hơn?",
  "Sắp tới tôi có gặp được quý nhân hoặc cơ hội hợp tác nào đáng giá không?",
  "Bao giờ tôi mới gặp được người thực sự phù hợp để bắt đầu một mối quan hệ?",
  "Tôi có nên chủ động mở lời hoặc nhắn tin làm lành với người ấy trước không?",
  "Công ty hiện tại có phải là môi trường tốt để tôi gắn bó lâu dài?",
  "Chuyện tình cảm sắp tới của tôi sẽ có chuyển biến tích cực nào không?",
  "Tôi nên chuẩn bị những gì để hoàn thành tốt mục tiêu đề ra trong tháng này?",
  "Tôi có nên bắt đầu học thêm kỹ năng mới hoặc đổi ngành nghề không?",
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
    subtitle: "Xem nhanh lời khuyên và xu hướng cho ngày hôm nay",
    cards: 1,
    icon: "☀️",
  },
  {
    type: "PAST_PRESENT_FUTURE",
    title: "Quá Khứ - Hiện Tại - Tương Lai",
    subtitle: "Xem diễn biến sự việc: từ nguyên nhân quá khứ, hiện tại đến kết quả tương lai",
    cards: 3,
    icon: "⏳",
  },
  {
    type: "TWO_PATHS_CHOICE",
    title: "Thực Tại & Hai Ngả Rẽ",
    subtitle: "So sánh 2 lựa chọn khi bạn đang phân vân chưa biết nên chọn hướng nào",
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
  dateOfBirth?: string;
  setDateOfBirth?: (dob: string) => void;
  relationshipStatus?: RelationshipStatus;
  setRelationshipStatus?: (s: RelationshipStatus) => void;
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
  dateOfBirth = "",
  setDateOfBirth,
  relationshipStatus = "UNKNOWN",
  setRelationshipStatus,
  decks,
  quota,
  errorMsg,
  onProceedToStep2,
  onStartReading,
  onOpenQuotaModal,
}) => {
  const [showAdvanced, setShowAdvanced] = useState(!dateOfBirth || selectedZodiac === "UNKNOWN");
  const [showManualZodiac, setShowManualZodiac] = useState(false);
  const detectedTopic = detectTopicFromQuestion(question);
  const isLoveTopic = detectedTopic.topic === "LOVE_AND_RELATIONSHIP";
  const birthZodiac = dateOfBirth ? calculateZodiacFromDate(dateOfBirth) : "UNKNOWN";

  const handleDateOfBirthChange = (val: string) => {
    setDateOfBirth?.(val);
    if (val) {
      const z = calculateZodiacFromDate(val);
      if (z !== "UNKNOWN") {
        setSelectedZodiac(z);
      }
    }
  };

  // Tự động cập nhật Cung Hoàng Đạo theo ngày sinh (nếu không mở chế độ chọn thủ công)
  useEffect(() => {
    if (dateOfBirth) {
      const z = calculateZodiacFromDate(dateOfBirth);
      if (z !== "UNKNOWN" && !showManualZodiac) {
        setSelectedZodiac(z);
      }
    }
  }, [dateOfBirth, showManualZodiac, setSelectedZodiac]);

  const [aiSuggestions, setAiSuggestions] = useState<string[]>([
    "Công việc hiện tại của tôi sắp tới có cơ hội thăng tiến hay tăng lương không?",
    "Người ấy có thực sự nghiêm túc và có tình cảm thật lòng với tôi không?",
    "Tài chính và thu nhập của tôi trong vài tháng tới sẽ biến chuyển thế nào?",
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

      const isArrayValid = Array.isArray(data) && data.length >= 3;
      const isDifferent = isArrayValid && data.some((q, idx) => q !== aiSuggestions[idx]);

      if (isDifferent) {
        setAiSuggestions(data.slice(0, 3));
      } else {
        const available = QUESTION_POOLS.filter((q) => !aiSuggestions.includes(q));
        const pool = available.length >= 3 ? available : QUESTION_POOLS;
        const shuffled = [...pool].sort(() => 0.5 - Math.random());
        setAiSuggestions(shuffled.slice(0, 3));
      }
    } catch {
      const available = QUESTION_POOLS.filter((q) => !aiSuggestions.includes(q));
      const pool = available.length >= 3 ? available : QUESTION_POOLS;
      const shuffled = [...pool].sort(() => 0.5 - Math.random());
      setAiSuggestions(shuffled.slice(0, 3));
    } finally {
      setIsGeneratingSuggestions(false);
    }
  };

  const zodiacOptions: OptionItem[] = [
    { value: "UNKNOWN", label: "Không áp dụng", icon: <span className="text-zinc-400 text-xs">✨</span> },
    ...ZODIAC_LIST.map((z) => ({
      value: z.code,
      label: z.name,
      icon: <span className="text-amber-300 font-semibold text-sm">{z.symbol}</span>,
    })),
  ];

  const relationshipOptions: OptionItem[] = [
    { value: "UNKNOWN", label: "Không áp dụng" },
    ...RELATIONSHIP_OPTIONS.map((opt) => ({
      value: opt.code,
      label: opt.label,
    })),
  ];

  const spreadSelectOptions: OptionItem[] = SPREAD_OPTIONS.map((opt) => ({
    value: opt.type,
    label: opt.title,
    sublabel: `${opt.cards} lá`,
    icon: <span className="text-sm leading-none">{opt.icon}</span>,
  }));
  const currentSpread = SPREAD_OPTIONS.find((s) => s.type === spreadType) || SPREAD_OPTIONS[0];

  const deckOptions: OptionItem[] = decks.map((d) => ({
    value: d.code,
    label: d.nameVi,
  }));

  const selectedDeckName = decks.find((d) => d.code === deckCode)?.nameVi || "Rider-Waite";
  const selectedZodiacItem = ZODIAC_LIST.find((z) => z.code === selectedZodiac);
  const zodiacDisplay = selectedZodiacItem ? `${selectedZodiacItem.symbol} ${selectedZodiacItem.name}` : "Chưa chọn Cung";

  return (
    <div className="max-w-2xl mx-auto p-4 sm:p-5 rounded-3xl border border-[#31333a] bg-[#191a1e] shadow-2xl transition-all">
      {/* STEP INDICATOR HEADER */}
      <div className="flex items-center justify-between mb-3.5 pb-2.5 border-b border-[#2c2e35]">
        <div className="flex items-center gap-2">
          <div
            className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold transition-all ${
              step === 1
                ? "bg-zinc-100 text-zinc-950 shadow-md ring-2 ring-zinc-400/30"
                : "bg-emerald-500/20 text-emerald-300 border border-emerald-500/40"
            }`}
          >
            {step === 2 ? <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" /> : "1"}
          </div>
          <span className={`text-xs font-semibold ${step === 1 ? "text-white" : "text-zinc-400"}`}>
            Tâm Niệm Câu Hỏi
          </span>
        </div>

        <div className="h-px flex-1 max-w-[60px] sm:max-w-[100px] bg-zinc-700/60 mx-2" />

        <div className="flex items-center gap-2">
          <div
            className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold transition-all ${
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
        <AlertBanner
          variant="error"
          message={errorMsg}
          className="mb-4"
        />
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
              placeholder="Ví dụ: Công việc sắp tới của tôi sẽ có cơ hội thăng tiến nào không?"
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
                      className={`group relative w-full text-left px-3.5 py-2.5 rounded-xl border text-xs leading-relaxed transition-all duration-200 flex items-center justify-between gap-3 cursor-pointer overflow-hidden ${
                        isSelected
                          ? "bg-gradient-to-r from-amber-500/15 via-amber-500/10 to-[#212227] border-amber-400/60 text-amber-200 font-medium shadow-[0_0_12px_rgba(245,158,11,0.12)] translate-x-0.5"
                          : "bg-[#212227] hover:bg-[#282a30] hover:border-amber-400/40 border-[#31333a] text-zinc-300 hover:text-white hover:translate-x-0.5"
                      }`}
                    >
                      <span className="flex items-center gap-2.5 min-w-0 flex-1">
                        <span
                          className={`w-1.5 h-1.5 rounded-full shrink-0 transition-all duration-200 ${
                            isSelected
                              ? "bg-amber-400 shadow-[0_0_8px_#f59e0b] scale-110"
                              : "bg-zinc-600 group-hover:bg-amber-400/60"
                          }`}
                        />
                        <span className="truncate">{suggested}</span>
                      </span>
                      <div className="shrink-0 flex items-center">
                        <ArrowRight
                          className={`w-3.5 h-3.5 transition-all duration-200 ${
                            isSelected
                              ? "text-amber-400 opacity-100 translate-x-0"
                              : "text-zinc-500 opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 group-hover:text-amber-300"
                          }`}
                        />
                      </div>
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
        <form onSubmit={onStartReading} className="space-y-2.5 sm:space-y-3 animate-in fade-in slide-in-from-right-2">
          <div className="text-center mb-0.5">
            <h1 className="text-base sm:text-lg font-bold text-white tracking-tight">
              Thiết Lập Trải Bài
            </h1>
            <p className="text-[11px] text-zinc-400">
              Lựa chọn phương thức kết nối trực giác phù hợp với tâm nguyện của bạn
            </p>
          </div>

          {/* CÂU HỎI ĐÃ CHỌN (Gọn gàng) */}
          <div className="px-3 py-1.5 rounded-xl bg-[#212227]/70 border border-[#31333a] flex items-center justify-between gap-2.5">
            <div className="min-w-0 flex-1 flex items-center gap-2 text-xs">
              <span className="text-zinc-500 font-semibold shrink-0">❓ Câu hỏi:</span>
              <p className="text-zinc-200 font-medium truncate italic text-xs">
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

          {/* CẤU HÌNH TRẢI BÀI & NGỮ CẢNH (DROPDOWN COMPACT) */}
          {isLoveTopic ? (
            <div className="space-y-1.5 animate-in fade-in duration-150">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                {/* CỘT 1: KIỂU TRẢI BÀI TAROT */}
                <div className="space-y-1">
                  <div className="flex items-center justify-between px-0.5">
                    <label className="text-[11px] sm:text-xs font-semibold text-zinc-200">
                      Kiểu Trải Bài Tarot
                    </label>
                  </div>
                  <CustomSelect
                    options={spreadSelectOptions}
                    value={spreadType}
                    onChange={(val) => setSpreadType(val as SpreadType)}
                    placeholder="Chọn kiểu trải bài..."
                  />
                </div>

                {/* CỘT 2: TÌNH TRẠNG MỐI QUAN HỆ */}
                <div className="space-y-1">
                  <div className="flex items-center justify-between px-0.5">
                    <label className="text-[11px] sm:text-xs font-semibold text-zinc-200">
                      Tình trạng mối quan hệ
                    </label>
                    {relationshipStatus && relationshipStatus !== "UNKNOWN" && (
                      <button
                        type="button"
                        onClick={() => setRelationshipStatus?.("UNKNOWN")}
                        className="text-[10px] text-zinc-400 hover:text-zinc-200 underline cursor-pointer"
                      >
                        Bỏ chọn
                      </button>
                    )}
                  </div>
                  <CustomSelect
                    options={relationshipOptions}
                    value={relationshipStatus || "UNKNOWN"}
                    onChange={(val) => setRelationshipStatus?.(val as RelationshipStatus)}
                    placeholder="Chọn tình trạng mối quan hệ..."
                  />
                </div>
              </div>

              {/* GIẢI THÍCH KIỂU TRẢI BÀI */}
              <p className="text-[10px] sm:text-[11px] text-zinc-400 px-0.5 pt-0.5 leading-tight">
                💡 <strong className="text-zinc-300 font-medium">{currentSpread.title}:</strong> {currentSpread.subtitle}
              </p>
            </div>
          ) : (
            /* KHI KHÔNG PHẢI CHỦ ĐỀ TÌNH CẢM -> KIỂU TRẢI BÀI DROPDOWN FULL WIDTH */
            <div className="space-y-1 animate-in fade-in duration-150">
              <div className="flex items-center justify-between px-0.5">
                <label className="text-[11px] sm:text-xs font-semibold text-zinc-200">
                  Kiểu Trải Bài Tarot
                </label>
              </div>
              <CustomSelect
                options={spreadSelectOptions}
                value={spreadType}
                onChange={(val) => setSpreadType(val as SpreadType)}
                placeholder="Chọn kiểu trải bài..."
              />
              <p className="text-[10px] sm:text-[11px] text-zinc-400 px-0.5 pt-0.5 leading-tight">
                💡 <strong className="text-zinc-300 font-medium">{currentSpread.title}:</strong> {currentSpread.subtitle}
              </p>
            </div>
          )}

          {/* TÙY CHỌN NĂNG LƯỢNG BẢN MỆNH & BỘ BÀI */}
          <div className={`rounded-xl border border-[#31333a] bg-[#212227]/40 transition-all ${showAdvanced ? "relative z-20" : ""}`}>
            <button
              type="button"
              onClick={() => setShowAdvanced(!showAdvanced)}
              className={`w-full px-3 py-2 flex items-center justify-between gap-3 text-xs text-zinc-300 hover:text-white transition cursor-pointer ${showAdvanced ? "rounded-t-xl" : "rounded-xl"}`}
            >
              <div className="flex items-center gap-1.5">
                <SlidersHorizontal className="w-3.5 h-3.5 text-zinc-400" />
                <span className="font-semibold text-[11px] sm:text-xs">Năng Lượng Bản Mệnh & Bộ Bài</span>
              </div>

              <div className="flex items-center gap-1.5 text-[11px] text-zinc-400">
                <span className="truncate max-w-[180px] sm:max-w-[280px] text-zinc-300 text-[10px] sm:text-[11px]">
                  {zodiacDisplay} • {selectedDeckName}
                </span>
                <ChevronDown className={`w-3.5 h-3.5 text-zinc-400 transition-transform duration-200 ${showAdvanced ? "rotate-180" : ""}`} />
              </div>
            </button>

            {showAdvanced && (
              <div className="p-2.5 pt-1.5 border-t border-[#31333a]/60 grid grid-cols-1 sm:grid-cols-2 gap-2.5 animate-in fade-in duration-150">
                {/* CỘT 1: NGÀY SINH & BẢN MỆNH */}
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between">
                    <label className="text-[11px] font-semibold text-zinc-200 flex items-center gap-1.5">
                      <Calendar className="w-3 h-3 text-amber-400" />
                      <span>Ngày Sinh Của Bạn</span>
                    </label>
                  </div>

                  <DatePicker
                    value={dateOfBirth || ""}
                    onChange={handleDateOfBirthChange}
                    placeholder="dd/mm/yyyy (ngày sinh dương lịch)"
                  />

                  {/* THÔNG TIN CUNG HOÀNG ĐẠO */}
                  <div className="flex items-center justify-between text-[11px] text-zinc-400 px-0.5 pt-0.5">
                    <div className="flex items-center gap-1.5 truncate">
                      <span>Cung:</span>
                      <button
                        type="button"
                        onClick={() => setShowManualZodiac(!showManualZodiac)}
                        className="inline-flex items-center gap-1 text-amber-200 font-semibold hover:text-amber-300 transition cursor-pointer"
                        title="Bấm để tự chọn cung hoàng đạo khác nếu muốn"
                      >
                        <span>{ZODIAC_DISPLAY_INFO[selectedZodiac]?.symbol}</span>
                        <span className="underline decoration-amber-400/40 underline-offset-2">{ZODIAC_DISPLAY_INFO[selectedZodiac]?.nameVi}</span>
                      </button>
                    </div>
                    <button
                      type="button"
                      onClick={() => setShowManualZodiac(!showManualZodiac)}
                      className="text-[10px] text-amber-400/90 hover:text-amber-300 hover:underline cursor-pointer shrink-0 transition"
                    >
                      {showManualZodiac ? "Đóng chọn cung" : "Tự chọn cung"}
                    </button>
                  </div>

                  {showManualZodiac && (
                    <div className="pt-1 space-y-1 animate-in fade-in duration-150">
                      <CustomSelect
                        options={zodiacOptions}
                        value={selectedZodiac}
                        onChange={(val) => setSelectedZodiac(val as ZodiacSign)}
                        placeholder="Chọn Cung Hoàng Đạo..."
                      />
                      {birthZodiac !== "UNKNOWN" && birthZodiac !== selectedZodiac && (
                        <button
                          type="button"
                          onClick={() => setSelectedZodiac(birthZodiac)}
                          className="text-[10px] text-amber-400/80 hover:text-amber-300 hover:underline cursor-pointer transition flex items-center gap-1"
                        >
                          <span>↺</span>
                          <span>Khôi phục theo ngày sinh ({ZODIAC_DISPLAY_INFO[birthZodiac]?.nameVi})</span>
                        </button>
                      )}
                    </div>
                  )}
                </div>

                {/* CỘT 2: BỘ BÀI TAROT */}
                {decks.length > 0 && (
                  <div className="space-y-1.5">
                    <div className="flex items-center justify-between">
                      <label className="text-[11px] font-semibold text-zinc-200 flex items-center gap-1">
                        <BookOpen className="w-3 h-3 text-zinc-400" />
                        <span>Chọn Bộ Bài</span>
                      </label>
                    </div>
                    <CustomSelect
                      options={deckOptions}
                      value={deckCode}
                      onChange={(val) => setDeckCode(val as DeckCode)}
                      placeholder="Chọn bộ bài Tarot..."
                    />
                  </div>
                )}
              </div>
            )}
          </div>

          {/* NĂNG LƯỢNG TRẢI BÀI & HẠN MỨC */}
          <div className="flex items-center justify-between text-xs px-1 text-zinc-400">
            <span className="flex items-center gap-1.5 shrink-0 text-[11px] sm:text-xs">
              <Zap className={`w-3.5 h-3.5 shrink-0 ${quota ? (quota.availableReadings > 0 ? "text-amber-400 fill-amber-400/30" : "text-red-400") : "text-zinc-500 animate-pulse"}`} />
              <span>Năng lượng trải bài:</span>
            </span>
            <button
              type="button"
              onClick={onOpenQuotaModal}
              className="text-amber-300 hover:text-amber-200 font-semibold underline underline-offset-2 flex items-center gap-1 cursor-pointer whitespace-nowrap text-right text-[11px] sm:text-xs"
            >
              <span>{quota ? `${quota.availableReadings} lượt khả dụng` : "Đang kiểm tra..."}</span>
              <span className="text-[10px] text-zinc-400 font-normal hidden sm:inline">(Xem thêm / Nhận thêm)</span>
              <span className="text-[10px] text-amber-400/80 font-normal sm:hidden">(+ Nhận thêm)</span>
            </button>
          </div>

          {/* ACTIONS: QUAY LẠI & TIẾN HÀNH TRẢI BÀI */}
          <div className="flex items-center gap-2 pt-0.5">
            <button
              type="button"
              onClick={() => setStep(1)}
              className="px-3 py-2.5 rounded-xl bg-[#212227] hover:bg-[#2b2c33] border border-[#31333a] text-zinc-300 font-semibold text-xs flex items-center gap-1.5 transition cursor-pointer shrink-0 whitespace-nowrap"
            >
              <ArrowLeft className="w-3.5 h-3.5 shrink-0" />
              <span>Quay lại</span>
            </button>

            {quota && quota.availableReadings <= 0 ? (
              <button
                type="button"
                onClick={onOpenQuotaModal}
                className="flex-1 py-2.5 px-3 sm:px-4 rounded-xl silver-gradient-btn text-zinc-950 font-bold text-xs sm:text-sm flex items-center justify-center gap-1.5 transition cursor-pointer shadow-lg hover:scale-[1.01] active:scale-95 whitespace-nowrap"
              >
                <Gift className="w-4 h-4 shrink-0 text-zinc-950" />
                <span className="sm:hidden">Nhận Thêm Lượt Bốc Bài</span>
                <span className="hidden sm:inline">Nhận Thêm Lượt Để Bốc Bài (Miễn Phí)</span>
              </button>
            ) : (
              <button
                type="submit"
                className="flex-1 py-2.5 px-3 sm:px-4 rounded-xl silver-gradient-btn font-bold text-xs sm:text-sm flex items-center justify-center gap-1.5 transition cursor-pointer shadow-lg hover:scale-[1.01] whitespace-nowrap"
              >
                <Sparkles className="w-4 h-4 shrink-0 text-zinc-950" />
                <span className="sm:hidden">Xáo & Trải Bài</span>
                <span className="hidden sm:inline">Tiến Hành Xáo & Trải Bài</span>
                <ArrowRight className="w-4 h-4 shrink-0 text-zinc-950" />
              </button>
            )}
          </div>
        </form>
      )}
    </div>
  );
};
