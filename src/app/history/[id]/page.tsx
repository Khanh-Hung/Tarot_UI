"use client";

import React, { useEffect, useState, useCallback } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Calendar, MessageSquare, Share2 } from "lucide-react";
import { ReadingDetailResponse } from "@/features/tarot/types/tarot.types";
import { tarotService } from "@/features/tarot/services/tarotService";
import { TarotCard3D } from "@/features/tarot/components/TarotCard3D";
import { MarkdownRenderer } from "@/features/chat/components/MarkdownRenderer";
import { ChatBox } from "@/features/chat/components/ChatBox";
import { ReadingDetailSkeleton } from "@/components/ui/Skeleton";
import { ShareTarotStoryModal } from "@/features/tarot/components/ShareTarotStoryModal";
import { getTopicLabel } from "@/features/tarot/utils/topicHelpers";
import { EmptyState } from "@/components/ui/EmptyState";

export default function HistoryDetailPage() {
  const params = useParams();
  const readingId = params?.id ? String(params.id) : "";

  const [reading, setReading] = useState<ReadingDetailResponse | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);

  const loadDetail = useCallback(async (id: string) => {
    try {
      const data = await tarotService.getReadingById(id);
      setReading(data);
    } catch (e) {
      console.error("Failed to load reading detail:", e);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    if (readingId) {
      loadDetail(readingId);
    } else {
      setIsLoading(false);
    }
  }, [readingId, loadDetail]);

  if (isLoading) {
    return <ReadingDetailSkeleton />;
  }

  if (!reading) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-16">
        <EmptyState
          title="Không tìm thấy quẻ bói này"
          description="Quẻ bài này có thể đã bị xóa hoặc đường dẫn liên kết không chính xác."
          action={{
            label: "Quay lại Lịch Sử Quẻ Bói",
            href: "/history",
            variant: "primary",
            icon: <ArrowLeft className="w-4 h-4" />,
          }}
        />
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10">
      {/* Top bar with back button & export button */}
      <div className="flex items-center justify-between gap-3">
        <Link
          href="/history"
          className="inline-flex items-center gap-1.5 text-xs text-slate-400 hover:text-slate-200 transition"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Quay lại Lịch Sử Quẻ Bói</span>
        </Link>

        <button
          type="button"
          onClick={() => setIsShareModalOpen(true)}
          className="px-3.5 py-1.5 rounded-xl bg-gradient-to-r from-amber-500/20 via-purple-500/20 to-sky-500/20 border border-amber-500/35 hover:border-amber-400 text-amber-200 hover:text-amber-100 font-semibold text-xs flex items-center gap-1.5 shadow-sm transition hover:scale-105 active:scale-95 cursor-pointer"
        >
          <Share2 className="w-3.5 h-3.5 text-amber-400" />
          <span>Xuất Ảnh Story ✨</span>
        </button>
      </div>

      {/* Header */}
      <div className="text-center max-w-3xl mx-auto">
        <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-white/[0.04] border border-white/15 text-xs text-slate-200 mb-3">
          <span>🔮 Chủ đề: {getTopicLabel(reading.topic)}</span>
          <span>•</span>
          <div className="flex items-center gap-1">
            <Calendar className="w-3 h-3" />
            <span>{new Date(reading.createdAt).toLocaleDateString("vi-VN")}</span>
          </div>
        </div>
        <h1 className="text-2xl sm:text-3xl font-bold text-white leading-relaxed">
          &ldquo;{reading.userQuestion}&rdquo;
        </h1>
      </div>

      {/* 🎴 3 LÁ BÀI (ĐÃ LẬT SẴN) */}
      <div className="py-6 px-4 rounded-3xl silver-card">
        <div className="flex flex-wrap justify-center items-center gap-6 sm:gap-10">
          {reading.drawnCards.map((card, idx) => (
            <TarotCard3D
              key={card.id || card.cardId || card.card?.id || idx}
              card={card}
              index={idx}
              isFlippedInitial={true}
            />
          ))}
        </div>
      </div>

      {/* 📜 BẢN LUẬN GIẢI AI */}
      <div className="p-6 sm:p-10 rounded-3xl silver-card">
        <MarkdownRenderer content={reading.initialReading} />
      </div>

      {/* 💬 KHUNG CHAT TIẾP NỐI */}
      <div className="space-y-4">
        <div className="flex items-center gap-2 silver-gradient-text text-lg font-bold">
          <MessageSquare className="w-5 h-5 text-slate-300" />
          <span>Lịch Sử Trò Chuyện & Tiếp Tục Tâm Sự</span>
        </div>
        <ChatBox
          readingId={reading.id}
          initialMessages={reading.chatMessages || []}
        />
      </div>

      {/* Modal Xuất Ảnh Story Quẻ Bài */}
      <ShareTarotStoryModal
        isOpen={isShareModalOpen}
        onClose={() => setIsShareModalOpen(false)}
        reading={reading}
        zodiacSign={reading.zodiacSign}
      />
    </div>
  );
}