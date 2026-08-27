"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import { DrawnCardDto } from "../types/tarot.types";
import { Sparkles, RotateCw, Flame, Droplets, Wind, Mountain, Moon } from "lucide-react";

interface TarotCard3DProps {
  card: DrawnCardDto;
  isFlippedInitial?: boolean;
  onFlip?: () => void;
  index?: number;
}

export const TarotCard3D: React.FC<TarotCard3DProps> = ({
  card,
  isFlippedInitial = false,
  onFlip,
  index = 0,
}) => {
  const [isFlipped, setIsFlipped] = useState(isFlippedInitial);

  const handleCardClick = () => {
    if (!isFlipped) {
      setIsFlipped(true);
      if (onFlip) onFlip();
    }
  };

  const getElementIcon = (element?: string) => {
    switch (element?.toUpperCase()) {
      case "FIRE":
      case "LỬA":
        return <Flame className="w-3.5 h-3.5 text-amber-300" />;
      case "WATER":
      case "NƯỚC":
        return <Droplets className="w-3.5 h-3.5 text-sky-300" />;
      case "AIR":
      case "KHÍ":
        return <Wind className="w-3.5 h-3.5 text-slate-300" />;
      case "EARTH":
      case "ĐẤT":
        return <Mountain className="w-3.5 h-3.5 text-emerald-300" />;
      default:
        return <Sparkles className="w-3.5 h-3.5 text-slate-300" />;
    }
  };

  return (
    <div className="flex flex-col items-center">
      {/* Vị trí lá bài badge */}
      <div className="mb-3 px-3.5 py-1 rounded-full bg-white/[0.04] border border-white/15 text-xs font-medium text-slate-200 shadow-lg backdrop-blur-md flex items-center gap-1.5">
        <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse"></span>
        {card.positionName || `Lá số ${card.positionIndex + 1}`}
      </div>

      {/* Thẻ 3D Container */}
      <div
        className="w-56 h-88 sm:w-64 sm:h-96 [perspective:1200px] cursor-pointer group select-none"
        onClick={handleCardClick}
      >
        <motion.div
          className="w-full h-full relative [transform-style:preserve-3d] transition-all duration-700 rounded-2xl shadow-2xl shadow-black/90"
          initial={{ rotateY: 0, y: 20, opacity: 0 }}
          animate={{
            rotateY: isFlipped ? 180 : 0,
            y: 0,
            opacity: 1,
          }}
          transition={{
            duration: 0.8,
            delay: index * 0.15,
            ease: [0.16, 1, 0.3, 1],
          }}
          whileHover={!isFlipped ? { scale: 1.04, y: -6 } : { scale: 1.02 }}
        >
          {/* MẶT SAU (LƯNG BÀI - ÚP) - DEEP INDIGO & MOON PHASES SILVER FOIL */}
          <div className="absolute inset-0 w-full h-full rounded-2xl [backface-visibility:hidden] bg-[#0A0E1A] border border-slate-400/30 p-3.5 flex flex-col items-center justify-between overflow-hidden shadow-2xl">
            {/* Viền đôi bạc thanh mảnh */}
            <div className="absolute inset-1.5 border border-white/20 rounded-xl pointer-events-none"></div>
            <div className="absolute inset-3 border border-dashed border-white/10 rounded-lg pointer-events-none"></div>

            {/* Họa tiết chu kỳ mặt trăng trên đầu */}
            <div className="w-full flex justify-center items-center gap-2 text-slate-400 text-xs tracking-widest pt-1 opacity-75">
              <span>🌑</span>
              <span>🌓</span>
              <span>🌕</span>
              <span>🌗</span>
              <span>🌘</span>
            </div>

            {/* Vòng tròn thiên văn & Chòm sao trung tâm */}
            <div className="relative flex flex-col items-center justify-center">
              <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-full border border-white/25 flex items-center justify-center shadow-xl shadow-white/5 relative">
                <div className="absolute inset-1.5 border border-dashed border-white/20 rounded-full animate-spin [animation-duration:30s]"></div>
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-white to-slate-400 flex items-center justify-center text-slate-950 shadow-md">
                  <Moon className="w-6 h-6 text-slate-950 fill-slate-950" />
                </div>
              </div>
              <p className="mt-4 text-[11px]  tracking-[0.25em] text-slate-200 uppercase">
                Oracle Tarot
              </p>
              <p className="mt-1 text-[10px] text-slate-400">
                (Chạm để lật bài)
              </p>
            </div>

            {/* Họa tiết chân bài */}
            <div className="w-full flex justify-between text-slate-400 text-xs  px-1 pb-1 opacity-60">
              <span>✦ ✧</span>
              <span>✧ ✦</span>
            </div>
          </div>

          {/* MẶT TRƯỚC (LẬT MỞ 180 ĐỘ) - MINIMALIST SILVER TAROT */}
          <div className="absolute inset-0 w-full h-full rounded-2xl [backface-visibility:hidden] [transform:rotateY(180deg)] bg-[#0D1222] border border-white/30 p-3.5 flex flex-col justify-between overflow-hidden shadow-2xl">
            {/* Viền bạc mảnh */}
            <div className="absolute inset-1.5 border border-white/15 rounded-xl pointer-events-none"></div>

            {/* Header lá bài */}
            <div className="flex justify-between items-center z-10 px-1">
              <span className="text-[10px]  font-bold uppercase tracking-wider text-slate-200 bg-white/10 px-2 py-0.5 rounded border border-white/15">
                {card.cardCode}
              </span>
              {card.element && (
                <div className="flex items-center gap-1 text-[11px] font-medium text-slate-300 bg-black/40 px-2 py-0.5 rounded-full border border-white/10">
                  {getElementIcon(card.element)}
                  <span>{card.element}</span>
                </div>
              )}
            </div>

            {/* Hình ảnh minh họa & Tên lá bài */}
            <div className="my-auto flex flex-col items-center text-center px-2 py-2">
              <div
                className={`w-28 h-36 sm:w-32 sm:h-40 rounded-xl bg-gradient-to-b from-slate-900 to-[#12182B] border border-white/20 flex items-center justify-center p-3 relative overflow-hidden shadow-inner transition-transform duration-500 ${
                  card.isReversed ? "rotate-180" : ""
                }`}
              >
                <div className="absolute inset-0 bg-radial from-white/10 via-transparent to-transparent"></div>
                <Sparkles className="w-12 h-12 text-slate-200" />
              </div>

              {/* Tên lá bài tiếng Việt & Tiếng Anh */}
              <h3 className="mt-3 text-base sm:text-lg font-bold  text-white tracking-wide">
                {card.nameVi}
              </h3>
              <p className="text-xs text-slate-400 italic ">
                {card.nameEn}
              </p>

              {/* Trạng thái Xuôi / Ngược */}
              <div
                className={`mt-2 inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold ${
                  card.isReversed
                    ? "bg-rose-950/60 border border-rose-500/30 text-rose-300"
                    : "bg-slate-800/80 border border-white/20 text-slate-200"
                }`}
              >
                {card.isReversed ? (
                  <>
                    <RotateCw className="w-3 h-3" />
                    <span>Ngược (Reversed)</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="w-3 h-3 text-slate-300" />
                    <span>Xuôi (Upright)</span>
                  </>
                )}
              </div>
            </div>

            {/* Keywords ở chân lá bài */}
            {card.keywords && (
              <div className="z-10 bg-black/40 border border-white/10 rounded-lg p-1.5 text-center backdrop-blur-sm">
                <p className="text-[10px] text-slate-300 font-medium line-clamp-1">
                  🔑 {card.keywords}
                </p>
              </div>
            )}
          </div>
        </motion.div>
      </div>
    </div>
  );
};