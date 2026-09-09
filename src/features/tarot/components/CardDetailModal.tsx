"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { BookOpen, Sparkles, ArrowRight } from "lucide-react";
import { CardDto, DeckCode } from "../types/tarot.types";
import { getElementBadge } from "../utils/elementBadge";
import { Modal } from "@/components/ui/Modal";

interface CardDetailModalProps {
  card: CardDto | null;
  onClose: () => void;
  selectedDeckCode: DeckCode;
}

export const CardDetailModal: React.FC<CardDetailModalProps> = ({
  card,
  onClose,
  selectedDeckCode,
}) => {
  if (!card) return null;

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
      isOpen={!!card}
      onClose={onClose}
      title="Chi Tiết Lá Bài Tarot"
      icon={<BookOpen className="w-4 h-4 text-zinc-400" />}
      footer={footerContent}
      maxWidth="max-w-xl"
      maxHeight="max-h-[75vh]"
    >
      <div className="grid grid-cols-1 sm:grid-cols-12 gap-4 items-start">
        {/* Cột trái: Ảnh lá bài */}
        <div className="sm:col-span-5 flex flex-col items-center">
          <div className="w-full max-w-[150px] aspect-[1/1.65] rounded-xl overflow-hidden bg-black/80 shadow-lg relative">
            <Image
              src={card.imageUrl || "/cards/card-back.jpg"}
              alt={card.nameVi}
              fill
              sizes="150px"
              className="object-cover"
            />
          </div>
          <div className="mt-2.5 text-center">
            <h3 className="font-bold text-sm text-white">
              {card.nameVi}
            </h3>
            <p className="text-[11px] text-zinc-400 italic">
              {card.nameEn}
            </p>
          </div>
        </div>

        {/* Cột phải: Thông tin & Luận giải */}
        <div className="sm:col-span-7 space-y-2.5 text-xs">
          {/* Meta tags */}
          <div className="flex flex-wrap items-center gap-1.5 pb-1 border-b border-white/[0.06]">
            <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-white/[0.06] text-zinc-200">
              {card.arcanaType === "MAJOR" ? "Ẩn Chính" : "Ẩn Phụ"}
            </span>
            {card.suit && (
              <span className="px-2 py-0.5 rounded-full text-[10px] font-medium bg-white/[0.04] text-zinc-400">
                Bộ: {card.suit}
              </span>
            )}
            {card.element && getElementBadge(card.element)}
          </div>

          {/* Từ khóa */}
          {card.keywords && (
            <div className="p-2.5 rounded-xl bg-white/[0.03] space-y-0.5">
              <span className="font-semibold text-zinc-300 text-[11px] block">
                🔑 Từ Khóa Cốt Lõi:
              </span>
              <p className="text-zinc-400 text-[11px]">
                {card.keywords}
              </p>
            </div>
          )}

          {/* Ý nghĩa xuôi */}
          {card.uprightMeaning && (
            <div className="p-2.5 rounded-xl bg-emerald-950/20 border border-emerald-500/20 space-y-0.5">
              <h4 className="text-[11px] font-bold text-emerald-300 flex items-center gap-1">
                <span>☀️</span>
                <span>Ý Nghĩa Chiều Xuôi</span>
              </h4>
              <p className="text-[11px] text-zinc-200 leading-relaxed">
                {card.uprightMeaning}
              </p>
            </div>
          )}

          {/* Ý nghĩa ngược */}
          {card.reversedMeaning && (
            <div className="p-2.5 rounded-xl bg-rose-950/20 border border-rose-500/20 space-y-0.5">
              <h4 className="text-[11px] font-bold text-rose-300 flex items-center gap-1">
                <span>🌙</span>
                <span>Ý Nghĩa Chiều Ngược</span>
              </h4>
              <p className="text-[11px] text-zinc-200 leading-relaxed">
                {card.reversedMeaning}
              </p>
            </div>
          )}
        </div>
      </div>
    </Modal>
  );
};
