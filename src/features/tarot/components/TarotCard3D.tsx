"use client";

import React from "react";
import { motion } from "framer-motion";
import { DrawnCardDto } from "../types/tarot.types";
import { Sparkles, RotateCw } from "lucide-react";

interface TarotCard3DProps {
  card: DrawnCardDto;
  isFlippedInitial?: boolean;
  onFlip?: () => void;
  index?: number;
}

export const TarotCard3D: React.FC<TarotCard3DProps> = ({
  card,
  index = 0,
}) => {
  const nameVi = card.nameVi || card.card?.nameVi || "Lá bài";
  const keywords = card.keywords || card.card?.keywords;
  const imageUrl = card.imageUrl || card.card?.imageUrl;

  const formatPositionName = (name?: string, idx?: number) => {
    if (!name) return `Lá số ${(idx ?? 0) + 1}`;
    const lower = name.toLowerCase();
    if (lower.includes("daily") || lower.includes("guidance")) return "Thông Điệp Ngày Mới";
    if (lower.includes("past") || lower.includes("quá khứ")) return "Quá Khứ";
    if (lower.includes("present") || lower.includes("hiện tại")) return "Hiện Tại";
    if (lower.includes("future") || lower.includes("tương lai")) return "Tương Lai";
    if (lower.includes("current reality") || lower.includes("thực tại")) return "Thực Tại";
    if (lower.includes("path a") || lower.includes("ngả rẽ a") || lower.includes("lựa chọn 1")) return "Ngả Rẽ A";
    if (lower.includes("path b") || lower.includes("ngả rẽ b") || lower.includes("lựa chọn 2")) return "Ngả Rẽ B";
    return name;
  };

  return (
    <div className="flex flex-col items-center">
      {/* Vị trí lá bài badge: 100% tiếng Việt thuần túy, đồng bộ tone than chì than bạc */}
      <div className="mb-2.5 px-3 py-1 rounded-full bg-[#25262c] border border-[#383a42] text-[11px] font-semibold text-amber-300 shadow-sm flex items-center gap-1.5">
        <span className="w-1.5 h-1.5 rounded-full bg-amber-400"></span>
        <span>{formatPositionName(card.positionName, index)}</span>
      </div>

      {/* Khung lá bài Tarot tĩnh trực diện, thanh thoát (w-36 h-[220px] sm:w-44 sm:h-[270px]) */}
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: index * 0.1 }}
        whileHover={{ y: -4, scale: 1.02 }}
        className="w-36 h-[220px] sm:w-44 sm:h-[270px] rounded-xl bg-[#212227] border border-[#383a44] p-1 flex flex-col justify-between overflow-hidden shadow-xl shadow-black/80 hover:border-zinc-400 transition-all select-none"
      >
        <div className="relative w-full h-full rounded-lg overflow-hidden bg-[#16171b] flex items-center justify-center">
          {imageUrl ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={imageUrl}
              alt={nameVi}
              className={`w-full h-full object-contain ${
                card.isReversed ? "rotate-180" : ""
              }`}
            />
          ) : (
            <div className="w-full h-full flex flex-col items-center justify-center bg-[#191a1e] text-amber-200 p-2 text-center">
              <Sparkles className="w-6 h-6 text-amber-300 mb-1" />
              <span className="text-[11px] font-medium">{nameVi}</span>
            </div>
          )}

          {/* Tag Xuôi / Ngược nhỏ xíu góc dưới */}
          <div className="absolute bottom-1.5 right-1.5 z-20">
            <span
              className={`px-1.5 py-0.5 rounded text-[9px] font-semibold backdrop-blur-md shadow flex items-center gap-0.5 border ${
                card.isReversed
                  ? "bg-rose-950/90 border-rose-400/40 text-rose-200"
                  : "bg-black/80 border-white/20 text-zinc-200"
              }`}
            >
              {card.isReversed ? (
                <>
                  <RotateCw className="w-2 h-2 text-rose-300" />
                  <span>Ngược</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-2 h-2 text-amber-300" />
                  <span>Xuôi</span>
                </>
              )}
            </span>
          </div>
        </div>
      </motion.div>

      {/* KHỐI THÔNG TIN DƯỚI THẺ BÀI: 100% Tiếng Việt thuần túy */}
      <div className="mt-2.5 flex flex-col items-center text-center max-w-[180px] sm:max-w-[210px]">
        <h3 className="text-sm sm:text-base font-bold text-zinc-100 tracking-wide">
          {nameVi}
        </h3>

        {/* Keywords ngắn gọn, hiển thị 2 dòng gọn gàng, không bị cụt chữ */}
        {keywords && (
          <p className="mt-1 text-[11px] text-zinc-400 leading-snug line-clamp-2">
            {keywords
              .split(",")
              .map((k) => k.trim())
              .filter((k) => k && k.toLowerCase() !== nameVi.toLowerCase())
              .join(", ")}
          </p>
        )}
      </div>
    </div>
  );
};