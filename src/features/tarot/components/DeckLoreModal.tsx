"use client";

import React from "react";
import Link from "next/link";
import { BookOpen, X, Sparkles, ArrowRight } from "lucide-react";
import { DeckCode } from "../types/tarot.types";
import { DECK_LORE_MAP } from "../constants/deckLore";

interface DeckLoreModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedDeckCode: DeckCode;
}

export const DeckLoreModal: React.FC<DeckLoreModalProps> = ({
  isOpen,
  onClose,
  selectedDeckCode,
}) => {
  if (!isOpen) return null;

  const lore = DECK_LORE_MAP[selectedDeckCode] || DECK_LORE_MAP.RIDER_WAITE_CLASSIC;

  return (
    <div
      onClick={onClose}
      className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6 pt-16 pb-6 sm:pt-20 sm:pb-8 bg-black/85 backdrop-blur-md animate-in fade-in"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="relative w-full max-w-[620px] max-h-[74vh] flex flex-col rounded-2xl border border-white/10 bg-[#16171a] shadow-2xl overflow-hidden my-auto"
      >
        {/* Header Cố Định */}
        <div className="shrink-0 flex items-center justify-between px-5 pt-4 pb-3 border-b border-white/[0.08] bg-[#16171a]">
          <div className="flex items-center gap-2 text-xs sm:text-sm font-bold text-zinc-100">
            <BookOpen className="w-4 h-4 text-zinc-300" />
            <span className="truncate">Lịch Sử: {lore.name || "Bộ Bài"}</span>
          </div>
          <button
            onClick={onClose}
            className="w-6 h-6 rounded-full bg-white/[0.04] hover:bg-white/[0.08] flex items-center justify-center text-zinc-400 hover:text-white transition cursor-pointer"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Scrollable Modal Body */}
        <div className="flex-1 min-h-0 overflow-y-auto px-5 py-4 space-y-4 [scrollbar-gutter:stable]">
          <div className="flex gap-3.5 items-center p-3 rounded-xl bg-white/[0.03]">
            <div className="w-12 aspect-[1/1.65] shrink-0 rounded-md overflow-hidden bg-black/80 shadow">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={lore.coverImage} alt={lore.name} className="w-full h-full object-cover" />
            </div>
            <div className="min-w-0 flex-1 space-y-1 text-xs">
              <h3 className="font-bold text-sm text-white truncate">{lore.originalName}</h3>
              <div className="text-zinc-400 flex flex-col gap-1 text-[11px]">
                <div>
                  <span className="text-zinc-500 font-medium">🏛️ Tác giả:</span>{" "}
                  <span className="text-zinc-300">{lore.author}</span>
                </div>
                <div>
                  <span className="text-zinc-500 font-medium">🎨 Họa sĩ:</span>{" "}
                  <span className="text-zinc-300">{lore.illustrator}</span>
                </div>
                <div>
                  <span className="text-zinc-500 font-medium">📅 Năm sáng tác:</span>{" "}
                  <span className="text-zinc-300">{lore.year}</span>
                </div>
                <div>
                  <span className="text-zinc-500 font-medium">🔮 Trường phái:</span>{" "}
                  <span className="text-zinc-300">{lore.school}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Body Sections Stream */}
          <div className="space-y-3 text-xs leading-relaxed text-zinc-300">
            {/* Tổng quan */}
            <div className="space-y-1">
              <h4 className="font-semibold text-zinc-200 text-xs flex items-center gap-1.5">
                <span>🌟</span>
                <span>Tổng Quan</span>
              </h4>
              <p className="text-zinc-400 text-[11.5px]">{lore.summary}</p>
            </div>

            {/* Lịch sử */}
            <div className="space-y-1 pt-2 border-t border-white/[0.06]">
              <h4 className="font-semibold text-zinc-200 text-xs flex items-center gap-1.5">
                <span>📜</span>
                <span>Hoàn Cảnh Ra Đời</span>
              </h4>
              <p className="text-zinc-400 text-[11.5px]">{lore.history}</p>
            </div>

            {/* Nghệ thuật */}
            <div className="space-y-1 pt-2 border-t border-white/[0.06]">
              <h4 className="font-semibold text-zinc-200 text-xs flex items-center gap-1.5">
                <span>🎨</span>
                <span>Phong Cách Nghệ Thuật</span>
              </h4>
              <p className="text-zinc-400 text-[11.5px]">{lore.artStyle}</p>
            </div>

            {/* Điểm khác biệt */}
            <div className="space-y-1.5 pt-2 border-t border-white/[0.06]">
              <h4 className="font-semibold text-zinc-200 text-xs flex items-center gap-1.5">
                <span>🔮</span>
                <span>Điểm Khác Biệt Nổi Bật</span>
              </h4>
              <ul className="space-y-1 pl-1 text-[11.5px] text-zinc-400">
                {lore.keyDifferences.map((diff, i) => (
                  <li key={i} className="flex items-start gap-1.5">
                    <span className="text-zinc-500 font-bold">•</span>
                    <span>{diff}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Phù hợp cho ai */}
            <div className="p-2.5 rounded-xl bg-white/[0.03] space-y-0.5 text-[11.5px]">
              <span className="font-semibold text-zinc-200 block">🎯 Phù hợp nhất khi:</span>
              <p className="text-zinc-400">{lore.bestFor}</p>
            </div>
          </div>
        </div>

        {/* Footer Cố Định */}
        <div className="shrink-0 px-5 py-3 border-t border-white/[0.08] flex items-center justify-between gap-3 bg-[#16171a]">
          <button
            onClick={onClose}
            className="px-3.5 py-1.5 rounded-xl bg-white/[0.04] hover:bg-white/[0.08] text-xs font-medium text-zinc-400 hover:text-white transition cursor-pointer"
          >
            Đóng
          </button>

          <Link
            href={`/reading?deckCode=${selectedDeckCode}`}
            className="px-4 py-1.5 rounded-xl silver-gradient-btn font-bold text-xs flex items-center gap-1.5 transition hover:scale-105 shadow-md text-zinc-950"
          >
            <Sparkles className="w-3.5 h-3.5 text-zinc-950" />
            <span>Bốc bài với bộ này</span>
            <ArrowRight className="w-3.5 h-3.5 text-zinc-950" />
          </Link>
        </div>
      </div>
    </div>
  );
};
