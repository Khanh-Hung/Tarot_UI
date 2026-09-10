"use client";

import React from "react";
import { Sparkles, MessageSquare, RotateCcw, Share2 } from "lucide-react";
import { CreateReadingResponse, SpreadType } from "../types/tarot.types";
import { TarotCard3D } from "./TarotCard3D";
import { MarkdownRenderer } from "@/features/chat/components/MarkdownRenderer";
import { ChatBox } from "@/features/chat/components/ChatBox";
import { SPREAD_OPTIONS } from "./ReadingWizardStep";

interface ReadingResultStepProps {
  readingResult: CreateReadingResponse;
  spreadType: SpreadType;
  onOpenShareModal: () => void;
  onReset: () => void;
}

export const ReadingResultStep: React.FC<ReadingResultStepProps> = ({
  readingResult,
  spreadType,
  onOpenShareModal,
  onReset,
}) => {
  return (
    <div className="space-y-6 sm:space-y-8 animate-fade-in">
      {/* Header câu hỏi & Nút Xuất Ảnh Story */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 px-1">
        <div className="text-center sm:text-left">
          {readingResult.userQuestion?.trim() ? (
            <h2 className="text-base sm:text-lg font-semibold text-amber-100/90 leading-snug">
              &ldquo;{readingResult.userQuestion.trim()}&rdquo;
            </h2>
          ) : (
            <div className="flex items-center gap-2 text-xs text-zinc-300 font-medium">
              <Sparkles className="w-4 h-4 text-amber-400" />
              <span>
                {readingResult.drawnCards.length === 1
                  ? "Thông Điệp Quẻ Bài Ngày Mới (1 Lá)"
                  : `Trải Bài ${readingResult.drawnCards.length} Lá (${SPREAD_OPTIONS.find((s) => s.type === spreadType)?.title || "Chuyên Sâu"})`}
              </span>
            </div>
          )}
        </div>

        <button
          type="button"
          onClick={onOpenShareModal}
          className="px-4 py-2 rounded-xl bg-gradient-to-r from-amber-500/20 via-purple-500/20 to-sky-500/20 hover:from-amber-500/30 hover:via-purple-500/30 hover:to-sky-500/30 border border-amber-500/40 hover:border-amber-400 text-amber-200 hover:text-amber-100 font-semibold text-xs flex items-center gap-2 shadow-md hover:scale-[1.02] active:scale-95 transition cursor-pointer shrink-0"
        >
          <Share2 className="w-3.5 h-3.5 text-amber-400" />
          <span>Xuất Ảnh Story / Chia Sẻ ✨</span>
        </button>
      </div>

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

      <div className="flex flex-wrap items-center justify-center gap-3 pt-6">
        <button
          type="button"
          onClick={onOpenShareModal}
          className="px-6 py-3 rounded-2xl border border-amber-500/40 bg-amber-500/10 hover:bg-amber-500/20 text-amber-200 hover:text-amber-100 font-semibold text-sm inline-flex items-center gap-2 transition cursor-pointer shadow-md hover:scale-[1.01] active:scale-95"
        >
          <Share2 className="w-4 h-4 text-amber-400" />
          <span>Xuất Ảnh Story / Chia Sẻ</span>
        </button>

        <button
          type="button"
          onClick={onReset}
          className="px-6 py-3 rounded-2xl border border-[#3b3d46] bg-[#23242a] hover:bg-[#2b2c33] hover:border-[#525560] text-zinc-200 hover:text-white font-medium text-sm inline-flex items-center gap-2 transition cursor-pointer"
        >
          <RotateCcw className="w-4 h-4 text-slate-300" />
          <span>Bốc Quẻ Bài Tarot Mới</span>
        </button>
      </div>
    </div>
  );
};
