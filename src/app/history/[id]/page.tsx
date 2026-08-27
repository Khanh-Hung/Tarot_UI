"use client";

import React, { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Sparkles, Calendar, MessageSquare, Loader2 } from "lucide-react";
import { ReadingDetailResponse } from "@/features/tarot/types/tarot.types";
import { tarotService } from "@/features/tarot/services/tarotService";
import { TarotCard3D } from "@/features/tarot/components/TarotCard3D";
import { MarkdownRenderer } from "@/features/chat/components/MarkdownRenderer";
import { ChatBox } from "@/features/chat/components/ChatBox";

export default function HistoryDetailPage() {
  const params = useParams();
  const router = useRouter();
  const readingId = Number(params?.id);

  const [reading, setReading] = useState<ReadingDetailResponse | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (readingId) {
      loadDetail(readingId);
    }
  }, [readingId]);

  const loadDetail = async (id: number) => {
    try {
      const data = await tarotService.getReadingById(id);
      setReading(data);
    } catch (e) {
      console.error(e);
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-amber-400" />
      </div>
    );
  }

  if (!reading) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-20 text-center">
        <h2 className="text-xl  text-white">Không tìm thấy quẻ bói này</h2>
        <Link href="/history" className="mt-4 inline-block text-amber-300 text-sm hover:underline">
          Quay lại danh sách lịch sử
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10">
      {/* Back button */}
      <Link
        href="/history"
        className="inline-flex items-center gap-1.5 text-xs text-purple-300 hover:text-amber-300 transition"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>Quay lại Lịch Sử Quẻ Bói</span>
      </Link>

      {/* Header */}
      <div className="text-center max-w-3xl mx-auto">
        <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-purple-950 border border-purple-500/40 text-xs text-amber-300 mb-3">
          <span>🔮 Chủ đề: {reading.topic}</span>
          <span>•</span>
          <div className="flex items-center gap-1">
            <Calendar className="w-3 h-3" />
            <span>{new Date(reading.createdAt).toLocaleDateString("vi-VN")}</span>
          </div>
        </div>
        <h1 className="text-2xl sm:text-3xl  font-bold text-white leading-relaxed">
          &ldquo;{reading.userQuestion}&rdquo;
        </h1>
      </div>

      {/* 🎴 3 LÁ BÀI (ĐÃ LẬT SẴN) */}
      <div className="py-6 px-4 rounded-3xl bg-gradient-to-b from-purple-950/30 via-slate-950 to-purple-950/20 border border-purple-500/20 shadow-2xl">
        <div className="flex flex-wrap justify-center items-center gap-6 sm:gap-10">
          {reading.drawnCards.map((card, idx) => (
            <TarotCard3D
              key={card.cardId}
              card={card}
              index={idx}
              isFlippedInitial={true}
            />
          ))}
        </div>
      </div>

      {/* 📜 BẢN LUẬN GIẢI AI */}
      <div className="p-6 sm:p-10 rounded-3xl bg-slate-900/90 border border-purple-500/30 shadow-2xl shadow-purple-950/80">
        <MarkdownRenderer content={reading.initialReading} />
      </div>

      {/* 💬 KHUNG CHAT TIẾP NỐI */}
      <div className="space-y-4">
        <div className="flex items-center gap-2 text-amber-200  text-lg font-bold">
          <MessageSquare className="w-5 h-5 text-amber-400" />
          <span>Lịch Sử Trò Chuyện & Tiếp Tục Tâm Sự</span>
        </div>
        <ChatBox
          readingId={reading.id}
          initialMessages={reading.chatMessages || []}
        />
      </div>
    </div>
  );
}