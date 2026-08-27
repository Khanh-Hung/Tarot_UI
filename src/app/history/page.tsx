"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { History, Sparkles, Calendar, ChevronRight, Loader2, ArrowRight } from "lucide-react";
import { useAuth } from "@/features/auth/hooks/useAuth";
import { ReadingSummaryResponse } from "@/features/tarot/types/tarot.types";
import { tarotService } from "@/features/tarot/services/tarotService";

export default function HistoryPage() {
  const router = useRouter();
  const { user, isAuthenticated, isLoading: isAuthLoading } = useAuth();

  const [historyList, setHistoryList] = useState<ReadingSummaryResponse[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    if (!isAuthLoading && !isAuthenticated) {
      router.push("/login");
      return;
    }

    if (user?.userId) {
      loadHistory(page);
    }
  }, [user, page, isAuthenticated, isAuthLoading]);

  const loadHistory = async (pageIndex: number) => {
    setIsLoading(true);
    try {
      const data = await tarotService.getReadingHistory(user!.userId, pageIndex, 8);
      setHistoryList(data.items || []);
      setTotalPages(data.totalPages || 1);
    } catch (e) {
      console.error("Failed to load history:", e);
    } finally {
      setIsLoading(false);
    }
  };

  if (isAuthLoading || (isLoading && historyList.length === 0)) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-amber-400" />
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="flex items-center justify-between mb-8">
        <div>
          <div className="inline-flex items-center gap-1.5 text-xs font-medium text-amber-300 mb-1">
            <History className="w-3.5 h-3.5" />
            <span>Nhật Ký Tâm Thức</span>
          </div>
          <h1 className="text-2xl sm:text-3xl  font-bold text-white">
            Lịch Sử Các Quẻ Bói Của Bạn
          </h1>
        </div>

        <Link
          href="/reading"
          className="px-4 py-2 rounded-xl bg-gradient-to-r from-amber-500 to-purple-600 hover:from-amber-400 hover:to-purple-500 text-slate-950 font-bold text-xs sm:text-sm flex items-center gap-1.5 shadow-md shadow-purple-950/50 transition"
        >
          <Sparkles className="w-4 h-4 text-slate-950" />
          <span>Bốc Quẻ Mới</span>
        </Link>
      </div>

      {historyList.length === 0 ? (
        <div className="text-center py-20 bg-slate-900/60 rounded-3xl border border-purple-500/20 p-8">
          <Sparkles className="w-12 h-12 text-purple-400/50 mx-auto mb-4" />
          <h3 className="text-lg  font-semibold text-white">
            Bạn chưa có quẻ bói Tarot nào
          </h3>
          <p className="text-xs text-purple-300/70 mt-1 max-w-sm mx-auto">
            Hãy tĩnh tâm và bắt đầu rút 3 lá bài đầu tiên để lắng nghe thông điệp từ vũ trụ.
          </p>
          <Link
            href="/reading"
            className="mt-6 inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-purple-900/80 hover:bg-purple-800 text-amber-300 font-semibold text-sm border border-purple-500/30 transition"
          >
            <span>Bốc Bài Ngay</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {historyList.map((item) => (
            <Link
              key={item.id}
              href={`/history/${item.id}`}
              className="p-5 rounded-2xl bg-slate-900/80 hover:bg-slate-900 border border-purple-500/20 hover:border-amber-400/50 transition duration-300 flex flex-col justify-between group shadow-lg"
            >
              <div>
                <div className="flex items-center justify-between text-xs text-purple-300/70 mb-2">
                  <span className="px-2 py-0.5 rounded bg-purple-950 text-amber-300 font-medium border border-purple-500/20">
                    {item.topic}
                  </span>
                  <div className="flex items-center gap-1">
                    <Calendar className="w-3 h-3" />
                    <span>{new Date(item.createdAt).toLocaleDateString("vi-VN")}</span>
                  </div>
                </div>

                <h3 className="text-base  font-bold text-white group-hover:text-amber-200 transition line-clamp-2">
                  &ldquo;{item.userQuestion}&rdquo;
                </h3>
              </div>

              <div className="mt-4 pt-3 border-t border-purple-500/10 flex items-center justify-between text-xs">
                <span className="text-purple-300/60">
                  {item.drawnCards?.length || 3} lá bài
                </span>
                <span className="text-amber-300 font-semibold flex items-center gap-1 group-hover:translate-x-1 transition">
                  <span>Xem chi tiết</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </span>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}