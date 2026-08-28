"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Sparkles, RotateCcw, ArrowRight, Moon, Shuffle, CheckCircle2, Hand } from "lucide-react";
import { CardDto } from "../types/tarot.types";
import { tarotService } from "../services/tarotService";

interface InteractiveDeckFanProps {
  deckCode: string;
  userQuestion: string;
  onConfirmSelection: (selectedCards: { cardId: string | number; isReversed: boolean }[]) => void;
  onCancel: () => void;
  isLoading?: boolean;
}

const SLOT_NAMES = [
  { title: "Quá Khứ và Nền Tảng", desc: "Nguồn gốc, nguyên nhân sâu xa tạo nên hoàn cảnh", icon: "🌒" },
  { title: "Hiện Tại và Trở Ngại", desc: "Năng lượng thực tế và nút thắt bạn đang đối diện", icon: "🌕" },
  { title: "Tương Lai và Xu Hướng", desc: "Kết quả và hướng đi phát triển tự nhiên", icon: "🌘" },
];

export const InteractiveDeckFan: React.FC<InteractiveDeckFanProps> = ({
  deckCode,
  userQuestion,
  onConfirmSelection,
  onCancel,
  isLoading = false,
}) => {
  const [deckCards, setDeckCards] = useState<CardDto[]>([]);
  const [selectedCards, setSelectedCards] = useState<{ card: CardDto; isReversed: boolean }[]>([]);
  const [isFanned, setIsFanned] = useState(false);
  const [isShuffling, setIsShuffling] = useState(false);
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  useEffect(() => {
    async function loadCards() {
      try {
        const cards = await tarotService.getCardsByDeck(deckCode);
        triggerFanAnimation(cards);
      } catch (err) {
        console.error("Failed to load deck cards:", err);
      }
    }
    loadCards();
  }, [deckCode]);

  // Hiệu ứng chụm bài -> xòe quạt cánh cung 180 độ chân thực
  const triggerFanAnimation = (sourceCards?: CardDto[]) => {
    const list = sourceCards || deckCards;
    if (list.length === 0) return;

    setSelectedCards([]);
    setIsFanned(false);
    setIsShuffling(true);

    const shuffled = [...list].sort(() => Math.random() - 0.5);
    setDeckCards(shuffled);

    setTimeout(() => {
      setIsShuffling(false);
      setIsFanned(true); // Xòe quạt bung ra
    }, 600);
  };

  const handleCardClick = (card: CardDto) => {
    if (selectedCards.length >= 3) return;
    if (selectedCards.some((s) => s.card.id === card.id)) return;

    const isReversed = Math.random() < 0.35;
    setSelectedCards((prev) => [...prev, { card, isReversed }]);
  };

  const handleQuickPick = () => {
    if (deckCards.length < 3) return;
    const shuffled = [...deckCards].sort(() => Math.random() - 0.5);
    const chosen = shuffled.slice(0, 3).map((c) => ({
      card: c,
      isReversed: Math.random() < 0.35,
    }));
    setSelectedCards(chosen);
  };

  const handleConfirm = () => {
    if (selectedCards.length === 3) {
      onConfirmSelection(
        selectedCards.map((s) => ({
          cardId: s.card.id,
          isReversed: s.isReversed,
        }))
      );
    }
  };

  const currentSlotIndex = selectedCards.length;
  const totalCards = deckCards.length;

  return (
    <div className="w-full space-y-8 animate-fade-in select-none">
      {/* 🔮 TIÊU ĐỀ HƯỚNG DẪN */}
      <div className="text-center max-w-2xl mx-auto">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/[0.04] border border-white/15 text-xs text-slate-200 mb-3 shadow-xl backdrop-blur-md">
          <Moon className="w-4 h-4 text-slate-300 animate-pulse" />
          <span>Bàn Xòe Quạt 78 Lá Bài Tarot Chuẩn Nghệ Thuật</span>
        </div>
        <h2 className="text-xl sm:text-2xl font-bold text-white leading-relaxed">
          &ldquo;{userQuestion}&rdquo;
        </h2>
        <p className="mt-2 text-xs sm:text-sm text-slate-300">
          {currentSlotIndex < 3 ? (
            <span className="text-slate-100 font-medium">
              👉 Hãy rê chuột trên nan quạt và rút lá bài cho{" "}
              <strong className="text-white underline underline-offset-4 font-bold">
                {SLOT_NAMES[currentSlotIndex].title}
              </strong>{" "}
              ({currentSlotIndex + 1}/3)
            </span>
          ) : (
            <span className="text-emerald-400 font-medium flex items-center justify-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              Bạn đã rút đủ 3 lá bài! Hãy bấm xác nhận để AI bắt đầu luận giải.
            </span>
          )}
        </p>
      </div>

      {/* 🌟 3 VỊ TRÍ ĐÓN LÁ BÀI RÚT (SLOTS) */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 max-w-4xl mx-auto">
        {SLOT_NAMES.map((slot, idx) => {
          const picked = selectedCards[idx];
          return (
            <div
              key={idx}
              className={`p-4 rounded-3xl flex flex-col items-center justify-between text-center transition-all duration-500 min-h-[210px] ${
                picked
                  ? "silver-card border-white/40 shadow-2xl shadow-white/10"
                  : currentSlotIndex === idx
                  ? "bg-white/[0.06] border-2 border-dashed border-white/40 shadow-lg scale-[1.02]"
                  : "bg-white/[0.02] border border-dashed border-white/10 opacity-70"
              }`}
            >
              <div className="w-full">
                <span className="inline-flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider text-slate-300 bg-white/10 px-2.5 py-0.5 rounded-full mb-1.5">
                  <span>{slot.icon}</span>
                  <span>Lá số {idx + 1}</span>
                </span>
                <h4 className="text-sm font-bold text-white">{slot.title}</h4>
                <p className="text-[11px] text-slate-400 mt-1 line-clamp-1">{slot.desc}</p>
              </div>

              {/* Lá bài bay vào slot */}
              <div className="my-2 flex items-center justify-center">
                {picked ? (
                  <motion.div
                    initial={{ scale: 0.2, y: 80, rotateY: 180, opacity: 0 }}
                    animate={{ scale: 1, y: 0, rotateY: 0, opacity: 1 }}
                    transition={{ type: "spring", stiffness: 280, damping: 22 }}
                    className="w-18 h-26 sm:w-20 sm:h-30 rounded-xl bg-[#090D18] border-2 border-white/40 p-2 flex flex-col items-center justify-between shadow-2xl relative overflow-hidden"
                  >
                    <div className="absolute inset-1 border border-white/20 rounded-lg pointer-events-none"></div>
                    <div className="w-full flex justify-between text-[7px] text-slate-400">
                      <span>✦</span>
                      <span>✦</span>
                    </div>
                    <div className="w-7 h-7 rounded-full bg-gradient-to-br from-white to-slate-400 flex items-center justify-center text-slate-950 shadow-md">
                      <Moon className="w-3.5 h-3.5 fill-slate-950" />
                    </div>
                    <span className="text-[8px] font-bold text-slate-200 uppercase tracking-widest">
                      {picked.isReversed ? "Ngược" : "Xuôi"}
                    </span>
                  </motion.div>
                ) : (
                  <div className="w-18 h-26 sm:w-20 sm:h-30 rounded-xl border border-dashed border-white/20 flex flex-col items-center justify-center text-slate-500 gap-1">
                    <Sparkles className="w-4 h-4 opacity-40 animate-pulse" />
                    <span className="text-[9px] text-slate-500 font-medium">Chờ rút</span>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* 🎴 BÀN XÒE BÀI HÌNH CÁNH QUẠT TRÒN TỎA TỪ TÂM (TRUE RADIAL HAND FAN) */}
      <div className="rounded-3xl p-6 sm:p-8 silver-card relative overflow-hidden bg-gradient-to-b from-[#070A14] via-[#0C1224] to-[#050710] border border-white/20 shadow-2xl">
        {/* Ánh sáng tâm bàn chiêm tinh */}
        <div className="absolute inset-0 bg-radial from-white/[0.03] via-transparent to-transparent pointer-events-none"></div>
        <div className="absolute -bottom-24 left-1/2 -translate-x-1/2 w-96 h-96 rounded-full bg-slate-400/5 blur-3xl pointer-events-none"></div>

        {/* Thanh điều khiển */}
        <div className="relative z-20 flex flex-col sm:flex-row items-center justify-between gap-4 mb-4">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-white/10 flex items-center justify-center text-slate-200 shadow-md">
              <Hand className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-semibold text-white">
                Bộ bài 78 lá xòe quạt bàn tay
              </h3>
              <p className="text-[11px] text-slate-400">
                {deckCards.length - selectedCards.length} lá trên nan quạt • Rê chuột qua để rút trượt lá bài
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2.5">
            <button
              onClick={() => triggerFanAnimation()}
              disabled={isShuffling || isLoading}
              className="px-4 py-2 rounded-xl bg-white/[0.06] hover:bg-white/[0.12] border border-white/15 text-xs font-semibold text-slate-200 hover:text-white transition flex items-center gap-1.5 cursor-pointer disabled:opacity-50 shadow-md"
            >
              <RotateCcw className={`w-3.5 h-3.5 ${isShuffling ? "animate-spin" : ""}`} />
              <span>Gom & Xòe lại</span>
            </button>

            <button
              onClick={handleQuickPick}
              disabled={isShuffling || isLoading}
              className="px-4 py-2 rounded-xl bg-white/[0.1] hover:bg-white/[0.2] border border-white/25 text-xs font-bold text-white transition flex items-center gap-1.5 cursor-pointer disabled:opacity-50 shadow-md"
            >
              <Sparkles className="w-3.5 h-3.5 text-slate-200" />
              <span>Rút nhanh ngẫu nhiên</span>
            </button>
          </div>
        </div>

        {/* KHÔNG GIAN 3D CÁNH QUẠT TỎA TRÒN TỪ TÂM GỐC */}
        <div className="relative w-full h-[420px] sm:h-[480px] flex items-end justify-center overflow-hidden [perspective:1400px]">
          {/* Gốc tâm giữ bài ở đáy (Pivot Anchor) */}
          <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-16 h-16 rounded-full bg-white/5 border border-white/10 flex items-center justify-center pointer-events-none z-30 backdrop-blur-sm">
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-white/20 to-transparent flex items-center justify-center">
              <Moon className="w-4 h-4 text-slate-300" />
            </div>
          </div>

          {/* 78 LÁ BÀI BUNG HÌNH QUẠT TRÒN XÒE TAY */}
          <div className="absolute bottom-6 left-1/2 -translate-x-1/2 w-0 h-0 flex items-center justify-center">
            <AnimatePresence>
              {deckCards.map((card, idx) => {
                const isSelected = selectedCards.some((s) => s.card.id === card.id);
                if (isSelected) return null;

                // Tính góc xoay nan quạt từ -68deg đến +68deg
                const total = deckCards.length;
                const normalized = (idx - (total - 1) / 2) / ((total - 1) / 2); // -1.0 đến +1.0
                const targetAngle = normalized * 68; // Góc xoay của nan quạt
                const isHovered = hoveredIndex === idx;

                return (
                  <motion.div
                    key={card.id}
                    layout
                    initial={{
                      rotate: 0,
                      y: 100,
                      opacity: 0,
                    }}
                    animate={{
                      rotate: isFanned ? targetAngle : 0,
                      y: !isFanned
                        ? 0
                        : isHovered
                        ? -65 // Khi hover: lá bài trượt vọt lên dọc theo nan quạt
                        : 0,
                      scale: isHovered ? 1.25 : 1,
                      zIndex: isHovered ? 300 : idx + 10,
                      opacity: 1,
                    }}
                    transition={{
                      type: "spring",
                      stiffness: isHovered ? 400 : 180,
                      damping: isHovered ? 20 : 22,
                      delay: !isFanned ? 0 : idx * 0.005, // Xòe lần lượt mượt mà
                    }}
                    onMouseEnter={() => setHoveredIndex(idx)}
                    onMouseLeave={() => setHoveredIndex(null)}
                    onClick={() => handleCardClick(card)}
                    className="absolute w-24 h-40 sm:w-28 sm:h-48 -left-12 sm:-left-14 -bottom-4 rounded-xl bg-[#090D18] hover:bg-[#12192F] border border-white/30 hover:border-white/90 p-2 flex flex-col items-center justify-between cursor-pointer shadow-xl hover:shadow-2xl hover:shadow-white/30 transition-colors select-none group"
                    style={{
                      transformOrigin: "50% 125%", // Tâm xoay nằm dưới đáy cọc bài như ngón tay cầm
                    }}
                  >
                    {/* Viền đôi bạc */}
                    <div className="absolute inset-1.5 border border-white/20 rounded-lg pointer-events-none"></div>

                    {/* Đầu lá bài */}
                    <div className="w-full flex justify-between text-[8px] text-slate-400">
                      <span>🌑</span>
                      <span>🌕</span>
                    </div>

                    {/* Vòng tròn biểu tượng mặt trăng */}
                    <div className="w-8 h-8 rounded-full bg-white/10 group-hover:bg-white flex items-center justify-center transition shadow-md">
                      <Moon className="w-4 h-4 text-slate-200 group-hover:text-slate-950 fill-current transition" />
                    </div>

                    {/* Chân lá bài */}
                    <div className="w-full flex justify-between text-[8px] text-slate-500">
                      <span>✧</span>
                      <span>✧</span>
                    </div>

                    {/* Hào quang khi hover */}
                    {isHovered && (
                      <div className="absolute inset-0 rounded-xl bg-radial from-white/25 via-transparent to-transparent pointer-events-none"></div>
                    )}
                  </motion.div>
                );
              })}
            </AnimatePresence>
          </div>
        </div>
      </div>

      {/* 🚀 NÚT HÀNH ĐỘNG XÁC NHẬN */}
      <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-2">
        <button
          onClick={onCancel}
          disabled={isLoading}
          className="w-full sm:w-auto px-7 py-3.5 rounded-2xl bg-white/[0.04] hover:bg-white/[0.08] border border-white/10 text-slate-300 font-medium text-sm transition cursor-pointer"
        >
          Nhập lại câu hỏi
        </button>

        <button
          onClick={handleConfirm}
          disabled={selectedCards.length < 3 || isShuffling || isLoading}
          className="w-full sm:w-auto px-10 py-3.5 rounded-2xl silver-gradient-btn font-bold text-base flex items-center justify-center gap-2 disabled:opacity-40 disabled:cursor-not-allowed transition cursor-pointer shadow-2xl hover:scale-105"
        >
          {isLoading ? (
            <>
              <div className="w-5 h-5 border-2 border-slate-950 border-t-transparent rounded-full animate-spin"></div>
              <span>AI Reader đang kết nối năng lượng 3 lá bài...</span>
            </>
          ) : (
            <>
              <Sparkles className="w-5 h-5 text-slate-950" />
              <span>Xác Nhận 3 Lá Bài & Luận Giải</span>
              <ArrowRight className="w-5 h-5 text-slate-950" />
            </>
          )}
        </button>
      </div>
    </div>
  );
};
