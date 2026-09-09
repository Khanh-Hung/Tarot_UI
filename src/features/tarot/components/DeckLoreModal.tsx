"use client";

import React from "react";
import Link from "next/link";
import { BookOpen, Sparkles, ArrowRight } from "lucide-react";
import { DeckCode } from "../types/tarot.types";
import { DECK_LORE_MAP } from "../constants/deckLore";
import { Modal } from "@/components/ui/Modal";

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

  const footerContent = (
    <>
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
    </>
  );

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={`Lịch Sử: ${lore.name || "Bộ Bài"}`}
      icon={<BookOpen className="w-4 h-4 text-zinc-300" />}
      footer={footerContent}
      maxWidth="max-w-[620px]"
      maxHeight="max-h-[74vh]"
      bodyClassName="space-y-4"
    >
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
    </Modal>
  );
};
