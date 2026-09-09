"use client";

import React, { useEffect, useState, useMemo } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  History,
  Sparkles,
  Loader2,
  ArrowRight,
  X,
  RotateCcw,
} from "lucide-react";
import { useAuth } from "@/features/auth/hooks/useAuth";
import { ReadingSummaryResponse } from "@/features/tarot/types/tarot.types";
import { tarotService } from "@/features/tarot/services/tarotService";
import { EnergyInsightsView } from "@/features/tarot/components/EnergyInsightsView";
import { Skeleton, HistoryListSkeleton } from "@/components/ui/Skeleton";
import { getTopicMeta, getSpreadLabel, getDeckName } from "@/features/tarot/utils/topicHelpers";
import { CustomSelect, OptionItem } from "@/components/ui/CustomSelect";
import { SearchInput } from "@/components/ui/SearchInput";
import { Pagination } from "@/components/ui/Pagination";
import { EmptyState } from "@/components/ui/EmptyState";

const ITEMS_PER_PAGE = 10;

export default function HistoryPage() {
  const router = useRouter();
  const { user, isAuthenticated, isLoading: isAuthLoading } = useAuth();

  const [activeTab, setActiveTab] = useState<"HISTORY" | "INSIGHTS">("HISTORY");
  const [allHistory, setAllHistory] = useState<ReadingSummaryResponse[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedTopicFilter, setSelectedTopicFilter] = useState("ALL");
  const [selectedDeckFilter, setSelectedDeckFilter] = useState("ALL");
  const [page, setPage] = useState(0);

  // Lấy userId từ user context hoặc fallback trực tiếp từ localStorage
  const resolvedUserId = useMemo(() => {
    let id = user?.userId || (user as { id?: string | number })?.id;
    if (!id && typeof window !== "undefined") {
      try {
        const raw = localStorage.getItem("tarot_user");
        if (raw) {
          const parsed = JSON.parse(raw);
          id = parsed.userId || parsed.id;
        }
      } catch {
        // ignore
      }
    }
    return id;
  }, [user]);

  const loadAllHistory = React.useCallback(async (userId: string | number) => {
    setIsLoading(true);
    try {
      // Tải tối đa 50 quẻ gần nhất để hiển thị và tìm kiếm tức thì
      const data = await tarotService.getReadingHistory(userId, 0, 50);
      setAllHistory(data?.items || []);
    } catch (e) {
      console.error("Failed to load history:", e);
      setAllHistory([]);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    if (!isAuthLoading && !isAuthenticated) {
      router.push("/login");
      return;
    }

    if (resolvedUserId) {
      loadAllHistory(resolvedUserId);
    } else if (!isAuthLoading) {
      setIsLoading(false);
    }
  }, [resolvedUserId, isAuthenticated, isAuthLoading, router, loadAllHistory]);

  // 🔍 TÌM KIẾM & LỌC DỮ LIỆU
  const filteredHistory = useMemo(() => {
    return allHistory.filter((item) => {
      // 1. Lọc theo chủ đề
      if (selectedTopicFilter === "LOVE") {
        if (item.topic !== "LOVE_AND_RELATIONSHIP" && item.topic !== "LOVE_RELATIONSHIP") return false;
      } else if (selectedTopicFilter === "CAREER") {
        if (item.topic !== "CAREER_AND_FINANCE" && item.topic !== "CAREER_MONEY") return false;
      } else if (selectedTopicFilter === "HEALING") {
        if (item.topic !== "SELF_GROWTH_AND_HEALING" && item.topic !== "SPIRITUAL_HEALING") return false;
      } else if (selectedTopicFilter === "GENERAL") {
        if (
          item.topic !== "GENERAL_GUIDANCE" &&
          item.topic !== "DAILY_GUIDANCE" &&
          item.topic !== "GENERAL_QUESTION"
        )
          return false;
      }

      // 2. Lọc theo bộ bài
      if (selectedDeckFilter !== "ALL" && item.deckCode !== selectedDeckFilter) {
        return false;
      }

      // 3. Tìm kiếm theo từ khóa (câu hỏi hoặc tên lá bài đã rút)
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase().trim();
        const questionMatch = item.userQuestion?.toLowerCase().includes(q);
        const cardMatch = item.drawnCards?.some((c) =>
          c.nameVi?.toLowerCase().includes(q) || c.nameEn?.toLowerCase().includes(q)
        );
        if (!questionMatch && !cardMatch) return false;
      }

      return true;
    });
  }, [allHistory, selectedTopicFilter, selectedDeckFilter, searchQuery]);

  // 📄 TÍNH TOÁN PHÂN TRANG
  const totalPages = Math.max(1, Math.ceil(filteredHistory.length / ITEMS_PER_PAGE));
  const currentPage = Math.min(page, totalPages - 1);
  const paginatedItems = filteredHistory.slice(
    currentPage * ITEMS_PER_PAGE,
    (currentPage + 1) * ITEMS_PER_PAGE
  );

  const resetFilters = () => {
    setSearchQuery("");
    setSelectedTopicFilter("ALL");
    setSelectedDeckFilter("ALL");
    setPage(0);
  };

  const TOPIC_OPTIONS: OptionItem[] = [
    { value: "ALL", label: "Tất Cả Chủ Đề" },
    { value: "LOVE", label: "Tình Duyên" },
    { value: "CAREER", label: "Sự Nghiệp" },
    { value: "HEALING", label: "Chữa Lành" },
    { value: "GENERAL", label: "Định Hướng" },
  ];

  const DECK_OPTIONS: OptionItem[] = [
    { value: "ALL", label: "Tất Cả Bộ Bài" },
    { value: "RIDER_WAITE_CLASSIC", label: "Rider-Waite 1909" },
    { value: "THOTH_ALEISTER", label: "Thoth Thelema" },
    { value: "MARSEILLE_HERMETIC", label: "Marseille 1760" },
  ];

  if (isAuthLoading) {
    return (
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-14 space-y-8">
        <div className="space-y-3 pb-6 border-b border-white/[0.08]">
          <Skeleton className="w-32 h-7 rounded-lg" />
          <Skeleton className="w-64 h-4 rounded-md" />
        </div>
        <HistoryListSkeleton />
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-14">
      {/* 🌟 HEADER TRANG: TIÊU ĐỀ ĐỘNG THEO TAB */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-6">
        <div>
          <div className="flex items-center gap-2.5">
            {activeTab === "HISTORY" ? (
              <History className="h-6 w-6 text-zinc-300" />
            ) : (
              <Sparkles className="h-6 w-6 text-amber-400" />
            )}
            <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-zinc-100">
              {activeTab === "HISTORY" ? "Lịch Sử Quẻ Bài" : "Bản Đồ Năng Lượng"}
            </h1>
          </div>
          <p className="mt-1 text-xs sm:text-sm text-zinc-400 font-normal">
            {activeTab === "HISTORY"
              ? "Xem lại toàn bộ câu hỏi và kết quả luận giải bài Tarot của bạn"
              : "Thống kê chiêm tinh về 4 nguyên tố và các lá bài định mệnh gắn liền với bạn"}
          </p>
        </div>

        <Link
          href="/reading"
          className="self-start sm:self-auto px-6 py-2.5 rounded-full silver-gradient-btn text-zinc-950 font-bold text-xs sm:text-sm flex items-center gap-2 shadow-lg transition hover:scale-105 active:scale-95 cursor-pointer shrink-0"
        >
          <Sparkles className="w-4 h-4 text-zinc-950 fill-current" />
          <span>Bốc Bài Mới</span>
        </Link>
      </div>

      {/* 🌟 TAB NAVIGATION PHẲNG GẮN LIỀN ĐƯỜNG KẺ HEADER */}
      <div className="flex items-center gap-8 border-b border-white/[0.08] mb-8">
        <button
          onClick={() => setActiveTab("HISTORY")}
          className={`pb-3.5 text-sm font-semibold flex items-center gap-2 border-b-2 transition-all cursor-pointer -mb-px ${
            activeTab === "HISTORY"
              ? "border-amber-400 text-white font-bold"
              : "border-transparent text-zinc-400 hover:text-zinc-200"
          }`}
        >
          <History className={`w-4 h-4 ${activeTab === "HISTORY" ? "text-amber-400" : "text-zinc-400"}`} />
          <span>Lịch Sử Quẻ Bài</span>
          {allHistory.length > 0 && (
            <span className="text-[11px] px-2 py-0.5 rounded-full bg-white/[0.08] text-zinc-300 font-normal">
              {allHistory.length}
            </span>
          )}
        </button>

        <button
          onClick={() => setActiveTab("INSIGHTS")}
          className={`pb-3.5 text-sm font-semibold flex items-center gap-2 border-b-2 transition-all cursor-pointer -mb-px ${
            activeTab === "INSIGHTS"
              ? "border-amber-400 text-amber-300 font-bold"
              : "border-transparent text-zinc-400 hover:text-zinc-200"
          }`}
        >
          <Sparkles className={`w-4 h-4 ${activeTab === "INSIGHTS" ? "text-amber-400" : "text-zinc-400"}`} />
          <span>Bản Đồ Năng Lượng</span>
        </button>
      </div>

      {activeTab === "INSIGHTS" ? (
        <EnergyInsightsView userId={resolvedUserId || ""} />
      ) : isLoading ? (
        <HistoryListSkeleton />
      ) : allHistory.length === 0 ? (
        <div className="flex min-h-[380px] flex-col items-center justify-center rounded-3xl border border-dashed border-[#31333a] bg-[#212227]/40 p-10 text-center">
          <Sparkles className="h-10 w-10 text-zinc-500 mb-3" />
          <h3 className="text-base font-bold text-zinc-200">
            Bạn chưa có lần bốc bài nào
          </h3>
          <p className="mt-1 text-xs text-zinc-400 max-w-sm leading-relaxed">
            Hãy đặt câu hỏi và rút những lá bài đầu tiên để nhận lời giải đáp chi tiết từ Nyxoris AI.
          </p>
          <Link
            href="/reading"
            className="mt-6 inline-flex items-center gap-2 rounded-xl bg-zinc-100 hover:bg-white text-zinc-950 py-2.5 px-5 text-xs sm:text-sm font-bold shadow-md shadow-white/5 transition-all cursor-pointer active:scale-98"
          >
            <span>Bốc Bài Ngay</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      ) : (
        <div className="space-y-6">
          {/* 🔍 THANH TÌM KIẾM & BỘ LỌC ĐA NĂNG SANG TRỌNG (BORDERLESS MINIMALIST) */}
          <div className="relative z-20 pb-2">
            <div className="flex flex-col md:flex-row items-center gap-2.5">
              {/* Search Bar */}
              <SearchInput
                value={searchQuery}
                onChange={(val) => {
                  setSearchQuery(val);
                  setPage(0);
                }}
                onClear={() => setPage(0)}
                placeholder="Tìm kiếm câu hỏi hoặc tên lá bài..."
                className="flex-1 w-full"
              />

              {/* Cụm 2 Custom Floating Dropdowns Lọc Chủ Đề & Bộ Bài */}
              <div className="flex items-center gap-2 w-full md:w-auto">
                {/* 🌟 Custom Dropdown 1: Lọc theo Chủ Đề */}
                <div className="w-full sm:w-[170px] shrink-0">
                  <CustomSelect
                    options={TOPIC_OPTIONS}
                    value={selectedTopicFilter}
                    onChange={(val) => {
                      setSelectedTopicFilter(val);
                      setPage(0);
                    }}
                  />
                </div>

                {/* 🌟 Custom Dropdown 2: Lọc theo Bộ Bài */}
                <div className="w-full sm:w-[190px] shrink-0">
                  <CustomSelect
                    options={DECK_OPTIONS}
                    value={selectedDeckFilter}
                    onChange={(val) => {
                      setSelectedDeckFilter(val);
                      setPage(0);
                    }}
                  />
                </div>

                {/* Nút Reset Lọc */}
                {(searchQuery || selectedTopicFilter !== "ALL" || selectedDeckFilter !== "ALL") && (
                  <button
                    onClick={resetFilters}
                    title="Đặt lại toàn bộ bộ lọc"
                    className="w-10 h-10 shrink-0 rounded-xl bg-[#212227] hover:bg-[#25262c] text-zinc-400 hover:text-white flex items-center justify-center transition active:scale-95 cursor-pointer border border-[#31333a]"
                  >
                    <RotateCcw className="w-4 h-4" />
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* 🌟 DANH SÁCH LỊCH SỬ DẠNG LIST TINH GIẢN LIỀN MẠCH (KHÔNG LẠM DỤNG KHUNG) */}
          {filteredHistory.length === 0 ? (
            <EmptyState
              title="Không tìm thấy quẻ bói nào phù hợp"
              description="Hãy thử tìm với từ khóa khác hoặc đặt lại bộ lọc."
              action={{
                label: "Đặt Lại Bộ Lọc",
                onClick: resetFilters,
              }}
            />
          ) : (
            <div className="divide-y divide-white/[0.07] border-t border-b border-white/[0.08]">
              {paginatedItems.map((item) => {
                const topicMeta = getTopicMeta(item.topic);
                const spreadLabel = getSpreadLabel(item.spreadType);
                const deckName = getDeckName(item.deckCode);
                const formattedDate = new Date(item.createdAt).toLocaleDateString("vi-VN", {
                  day: "2-digit",
                  month: "2-digit",
                  year: "numeric",
                });

                return (
                  <Link
                    key={item.id}
                    href={`/history/${item.id}`}
                    className="group py-4 px-2 sm:px-3 hover:bg-white/[0.03] transition-colors duration-150 flex items-center justify-between gap-4 cursor-pointer"
                  >
                    {/* Cụm Thông Tin Trải Bài Liền Mạch */}
                    <div className="min-w-0 flex-1 space-y-1">
                      {/* Dòng Tag & Metadata */}
                      <div className="flex items-center gap-2 flex-wrap text-xs">
                        <span className="font-semibold text-xs flex items-center gap-1.5 text-zinc-300 group-hover:text-white transition">
                          <span>{topicMeta.icon}</span>
                          <span>{topicMeta.label}</span>
                        </span>

                        <span className="text-zinc-600">•</span>

                        <span className="text-zinc-400 text-xs">
                          {deckName} • {spreadLabel}
                        </span>

                        <span className="text-zinc-600 hidden sm:inline">•</span>

                        <span className="text-zinc-500 text-xs hidden sm:inline">
                          {formattedDate}
                        </span>
                      </div>

                      {/* Tiêu đề câu hỏi người dùng */}
                      <h3 className="text-sm sm:text-base font-semibold text-white group-hover:text-zinc-200 transition line-clamp-1 tracking-tight">
                        &ldquo;{item.userQuestion}&rdquo;
                      </h3>
                    </div>

                    {/* Mũi Tên Đơn Giản Thanh Thoát */}
                    <div className="shrink-0 flex items-center pl-2 text-zinc-500 group-hover:text-white transition">
                      <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-200" />
                    </div>
                  </Link>
                );
              })}
            </div>
          )}

          {/* 🌟 PHÂN TRANG TINH TẾ */}
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={setPage}
            totalItems={filteredHistory.length}
            currentCount={paginatedItems.length}
            itemLabel="lượt xem bài"
          />
        </div>
      )}
    </div>
  );
}