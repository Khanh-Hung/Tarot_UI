"use client";

import React, { useEffect, useState, useMemo, useRef } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  History,
  Sparkles,
  Calendar,
  Loader2,
  ArrowRight,
  ChevronLeft,
  ChevronRight,
  Compass,
  Heart,
  Briefcase,
  Leaf,
  Search,
  X,
  ChevronDown,
  RotateCcw,
} from "lucide-react";
import { useAuth } from "@/features/auth/hooks/useAuth";
import { ReadingSummaryResponse } from "@/features/tarot/types/tarot.types";
import { tarotService } from "@/features/tarot/services/tarotService";

const ITEMS_PER_PAGE = 10;

const getTopicMeta = (topic?: string) => {
  switch (topic) {
    case "LOVE_AND_RELATIONSHIP":
    case "LOVE_RELATIONSHIP":
      return {
        label: "Tình Duyên & Mối Quan Hệ",
        badgeClass: "bg-rose-500/10 border-rose-500/25 text-rose-300",
        icon: <Heart className="w-5 h-5 text-rose-400" />,
        glow: "from-rose-500/[0.06] to-transparent",
      };
    case "CAREER_AND_FINANCE":
    case "CAREER_MONEY":
      return {
        label: "Sự Nghiệp & Tài Chính",
        badgeClass: "bg-amber-500/10 border-amber-500/25 text-amber-300",
        icon: <Briefcase className="w-5 h-5 text-amber-400" />,
        glow: "from-amber-500/[0.06] to-transparent",
      };
    case "SELF_GROWTH_AND_HEALING":
    case "SPIRITUAL_HEALING":
      return {
        label: "Chữa Lành & Nội Tâm",
        badgeClass: "bg-emerald-500/10 border-emerald-500/25 text-emerald-300",
        icon: <Leaf className="w-5 h-5 text-emerald-400" />,
        glow: "from-emerald-500/[0.06] to-transparent",
      };
    default:
      return {
        label: "Định Hướng Tổng Quan",
        badgeClass: "bg-indigo-500/10 border-indigo-500/25 text-indigo-300",
        icon: <Compass className="w-5 h-5 text-indigo-300" />,
        glow: "from-indigo-500/[0.06] to-transparent",
      };
  }
};

const getSpreadLabel = (spreadType?: string) => {
  switch (spreadType) {
    case "PAST_PRESENT_FUTURE":
    case "THREE_CARDS_TIMELINE":
      return "Quá Khứ • Hiện Tại • Tương Lai";
    case "SINGLE_CARD_FOCUS":
      return "1 Lá Trọng Tâm";
    case "TWO_PATHS_CHOICE":
      return "Hai Ngã Rẽ";
    case "CELTIC_CROSS":
      return "Celtic Cross";
    default:
      return "Trải Bài 3 Lá";
  }
};

const getDeckName = (deckCode?: string) => {
  switch (deckCode) {
    case "THOTH_ALEISTER":
      return "Thoth";
    case "MARSEILLE_HERMETIC":
      return "Marseille";
    default:
      return "Rider-Waite";
  }
};

export default function HistoryPage() {
  const router = useRouter();
  const { user, isAuthenticated, isLoading: isAuthLoading } = useAuth();

  const [allHistory, setAllHistory] = useState<ReadingSummaryResponse[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedTopicFilter, setSelectedTopicFilter] = useState("ALL");
  const [selectedDeckFilter, setSelectedDeckFilter] = useState("ALL");
  const [page, setPage] = useState(0);

  const [isTopicDropdownOpen, setIsTopicDropdownOpen] = useState(false);
  const [isDeckDropdownOpen, setIsDeckDropdownOpen] = useState(false);
  const topicDropdownRef = useRef<HTMLDivElement>(null);
  const deckDropdownRef = useRef<HTMLDivElement>(null);

  // Đóng dropdown khi click ra ngoài
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (topicDropdownRef.current && !topicDropdownRef.current.contains(event.target as Node)) {
        setIsTopicDropdownOpen(false);
      }
      if (deckDropdownRef.current && !deckDropdownRef.current.contains(event.target as Node)) {
        setIsDeckDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    if (!isAuthLoading && !isAuthenticated) {
      router.push("/login");
      return;
    }

    const currentUserId = user?.userId || (user as any)?.id;
    if (currentUserId) {
      loadAllHistory(currentUserId);
    }
  }, [user, isAuthenticated, isAuthLoading]);

  const loadAllHistory = async (userId: string | number) => {
    setIsLoading(true);
    try {
      // Tải tối đa 100 quẻ để tìm kiếm và lọc tức thì
      const data = await tarotService.getReadingHistory(userId, 0, 100);
      setAllHistory(data.items || []);
    } catch (e) {
      console.error("Failed to load history:", e);
    } finally {
      setIsLoading(false);
    }
  };

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

  const TOPIC_OPTIONS = [
    { key: "ALL", label: "Tất Cả Chủ Đề", icon: "✨" },
    { key: "LOVE", label: "Tình Duyên", icon: "💖" },
    { key: "CAREER", label: "Sự Nghiệp", icon: "💼" },
    { key: "HEALING", label: "Chữa Lành", icon: "🌿" },
    { key: "GENERAL", label: "Định Hướng", icon: "🧭" },
  ];

  const DECK_OPTIONS = [
    { key: "ALL", label: "Tất Cả Bộ Bài", icon: "🏛️" },
    { key: "RIDER_WAITE_CLASSIC", label: "Rider-Waite 1909", icon: "🏛️" },
    { key: "THOTH_ALEISTER", label: "Thoth Thelema", icon: "🔮" },
    { key: "MARSEILLE_HERMETIC", label: "Marseille 1760", icon: "⚜️" },
  ];

  const activeTopicObj = TOPIC_OPTIONS.find((t) => t.key === selectedTopicFilter) || TOPIC_OPTIONS[0];
  const activeDeckObj = DECK_OPTIONS.find((d) => d.key === selectedDeckFilter) || DECK_OPTIONS[0];

  if (isAuthLoading || (isLoading && allHistory.length === 0)) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-zinc-300" />
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-14">
      {/* 🌟 HEADER LỊCH SỬ XEM BÀI RÕ RÀNG, DỄ HIỂU */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8 pb-6 border-b border-white/[0.08]">
        <div>
          <div className="inline-flex items-center gap-1.5 text-xs font-semibold tracking-wider uppercase text-zinc-400 mb-2">
            <History className="w-3.5 h-3.5 text-zinc-400" />
            <span>Lịch Sử Bốc Bài</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight bg-gradient-to-r from-white via-zinc-100 to-zinc-400 bg-clip-text text-transparent">
            Lịch Sử Xem Bài
          </h1>
          <p className="mt-1.5 text-xs sm:text-sm text-zinc-400">
            Xem lại toàn bộ câu hỏi và kết quả luận giải bài Tarot của bạn.
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

      {allHistory.length === 0 ? (
        <div className="text-center py-20 rounded-3xl border border-white/10 bg-[#151619] p-8 sm:p-12 shadow-2xl">
          <div className="w-16 h-16 rounded-full bg-white/[0.04] border border-white/10 flex items-center justify-center mx-auto mb-5 text-zinc-400">
            <Sparkles className="w-8 h-8" />
          </div>
          <h3 className="text-xl font-bold text-white">
            Bạn chưa có lần bốc bài nào
          </h3>
          <p className="text-sm text-zinc-400 mt-2 max-w-md mx-auto leading-relaxed">
            Hãy đặt câu hỏi và rút những lá bài đầu tiên để nhận lời giải đáp chi tiết từ Nyxoris AI.
          </p>
          <Link
            href="/reading"
            className="mt-7 inline-flex items-center gap-2 px-7 py-3.5 rounded-full silver-gradient-btn text-zinc-950 font-bold text-sm shadow-xl transition hover:scale-105 cursor-pointer"
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
              <div className="relative flex-1 w-full">
                <Search className="w-4 h-4 text-zinc-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => {
                    setSearchQuery(e.target.value);
                    setPage(0);
                  }}
                  placeholder="Tìm kiếm câu hỏi hoặc tên lá bài..."
                  className="w-full bg-white/[0.04] hover:bg-white/[0.06] focus:bg-white/[0.08] rounded-xl pl-10 pr-10 py-2.5 text-xs sm:text-sm text-white placeholder:text-zinc-500 outline-none transition"
                />
                {searchQuery && (
                  <button
                    onClick={() => {
                      setSearchQuery("");
                      setPage(0);
                    }}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-white transition cursor-pointer"
                  >
                    <X className="w-4 h-4" />
                  </button>
                )}
              </div>

              {/* Cụm 2 Custom Floating Dropdowns Lọc Chủ Đề & Bộ Bài */}
              <div className="flex items-center gap-2 w-full md:w-auto">
                {/* 🌟 Custom Dropdown 1: Lọc theo Chủ Đề */}
                <div className="relative flex-1 sm:w-auto sm:min-w-[170px]" ref={topicDropdownRef}>
                  <button
                    type="button"
                    onClick={() => {
                      setIsTopicDropdownOpen(!isTopicDropdownOpen);
                      setIsDeckDropdownOpen(false);
                    }}
                    className={`w-full ${
                      isTopicDropdownOpen ? "bg-white/[0.09]" : "bg-white/[0.04] hover:bg-white/[0.07]"
                    } rounded-xl px-4 py-2.5 text-xs font-semibold text-zinc-200 flex items-center justify-between gap-2.5 transition cursor-pointer select-none`}
                  >
                    <span className="flex items-center gap-1.5 whitespace-nowrap">
                      <span>{activeTopicObj.icon}</span>
                      <span>{activeTopicObj.label}</span>
                    </span>
                    <ChevronDown className={`w-3.5 h-3.5 text-zinc-400 shrink-0 transition-transform duration-200 ${isTopicDropdownOpen ? "rotate-180 text-white" : ""}`} />
                  </button>

                  {/* Menu Popup Chủ Đề Kính Mờ */}
                  {isTopicDropdownOpen && (
                    <div className="absolute right-0 top-full mt-2 w-52 rounded-2xl border border-white/12 bg-[#1b1c20]/95 backdrop-blur-2xl p-1.5 shadow-2xl z-50 animate-in fade-in slide-in-from-top-2">
                      {TOPIC_OPTIONS.map((opt) => {
                        const isSelected = selectedTopicFilter === opt.key;
                        return (
                          <button
                            key={opt.key}
                            type="button"
                            onClick={() => {
                              setSelectedTopicFilter(opt.key);
                              setIsTopicDropdownOpen(false);
                              setPage(0);
                            }}
                            className={`w-full flex items-center px-3 py-2.5 rounded-xl text-xs font-semibold transition cursor-pointer select-none ${
                              isSelected
                                ? "bg-white text-zinc-950 shadow-md font-bold"
                                : "text-zinc-300 hover:text-white hover:bg-white/[0.06]"
                            }`}
                          >
                            <span className="flex items-center gap-2 whitespace-nowrap">
                              <span>{opt.icon}</span>
                              <span>{opt.label}</span>
                            </span>
                          </button>
                        );
                      })}
                    </div>
                  )}
                </div>

                {/* 🌟 Custom Dropdown 2: Lọc theo Bộ Bài */}
                <div className="relative flex-1 sm:w-auto sm:min-w-[190px]" ref={deckDropdownRef}>
                  <button
                    type="button"
                    onClick={() => {
                      setIsDeckDropdownOpen(!isDeckDropdownOpen);
                      setIsTopicDropdownOpen(false);
                    }}
                    className={`w-full ${
                      isDeckDropdownOpen ? "bg-white/[0.09]" : "bg-white/[0.04] hover:bg-white/[0.07]"
                    } rounded-xl px-4 py-2.5 text-xs font-semibold text-zinc-200 flex items-center justify-between gap-2.5 transition cursor-pointer select-none`}
                  >
                    <span className="flex items-center gap-1.5 whitespace-nowrap">
                      <span>{activeDeckObj.icon}</span>
                      <span>{activeDeckObj.label}</span>
                    </span>
                    <ChevronDown className={`w-3.5 h-3.5 text-zinc-400 shrink-0 transition-transform duration-200 ${isDeckDropdownOpen ? "rotate-180 text-white" : ""}`} />
                  </button>

                  {/* Menu Popup Bộ Bài Kính Mờ */}
                  {isDeckDropdownOpen && (
                    <div className="absolute right-0 top-full mt-2 w-56 rounded-2xl border border-white/12 bg-[#1b1c20]/95 backdrop-blur-2xl p-1.5 shadow-2xl z-50 animate-in fade-in slide-in-from-top-2">
                      {DECK_OPTIONS.map((opt) => {
                        const isSelected = selectedDeckFilter === opt.key;
                        return (
                          <button
                            key={opt.key}
                            type="button"
                            onClick={() => {
                              setSelectedDeckFilter(opt.key);
                              setIsDeckDropdownOpen(false);
                              setPage(0);
                            }}
                            className={`w-full flex items-center px-3 py-2.5 rounded-xl text-xs font-semibold transition cursor-pointer select-none ${
                              isSelected
                                ? "bg-white text-zinc-950 shadow-md font-bold"
                                : "text-zinc-300 hover:text-white hover:bg-white/[0.06]"
                            }`}
                          >
                            <span className="flex items-center gap-2 whitespace-nowrap">
                              <span>{opt.icon}</span>
                              <span>{opt.label}</span>
                            </span>
                          </button>
                        );
                      })}
                    </div>
                  )}
                </div>

                {/* Nút Reset Lọc */}
                {(searchQuery || selectedTopicFilter !== "ALL" || selectedDeckFilter !== "ALL") && (
                  <button
                    onClick={resetFilters}
                    title="Đặt lại toàn bộ bộ lọc"
                    className="w-9 h-9 shrink-0 rounded-xl bg-white/[0.04] hover:bg-white/[0.08] text-zinc-400 hover:text-white flex items-center justify-center transition active:scale-95 cursor-pointer"
                  >
                    <RotateCcw className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* 🌟 DANH SÁCH LỊCH SỬ DẠNG LIST TINH GIẢN LIỀN MẠCH (KHÔNG LẠM DỤNG KHUNG) */}
          {filteredHistory.length === 0 ? (
            <div className="text-center py-14 rounded-2xl border border-white/10 bg-[#141518] p-6 shadow-lg">
              <p className="text-sm font-semibold text-white">
                Không tìm thấy quẻ bói nào phù hợp
              </p>
              <p className="text-xs text-zinc-400 mt-1">
                Hãy thử tìm với từ khóa khác hoặc đặt lại bộ lọc.
              </p>
              <button
                onClick={resetFilters}
                className="mt-4 px-4 py-2 rounded-xl bg-white/[0.06] hover:bg-white/[0.12] text-xs font-semibold text-zinc-200 border border-white/10 transition cursor-pointer"
              >
                Đặt Lại Bộ Lọc
              </button>
            </div>
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
          {totalPages > 1 && (
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-6 border-t border-white/[0.06]">
              <span className="text-xs text-zinc-400 font-medium">
                Hiển thị <span className="text-zinc-200 font-bold">{paginatedItems.length}</span> / <span className="text-white font-bold">{filteredHistory.length}</span> lượt xem bài
              </span>

              <div className="flex items-center gap-1.5">
                {/* Nút Trước */}
                <button
                  disabled={currentPage === 0}
                  onClick={() => setPage((prev) => Math.max(0, prev - 1))}
                  className="w-9 h-9 rounded-xl bg-white/[0.04] hover:bg-white/[0.08] hover:text-white disabled:opacity-20 disabled:cursor-not-allowed text-zinc-400 flex items-center justify-center transition active:scale-95 cursor-pointer"
                  title="Trang trước"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>

                {/* Các nút số trang */}
                {Array.from({ length: totalPages }, (_, i) => (
                  <button
                    key={i}
                    onClick={() => setPage(i)}
                    className={`w-9 h-9 rounded-xl text-xs font-bold transition active:scale-95 cursor-pointer ${
                      i === currentPage
                        ? "bg-white text-zinc-950 shadow-md font-extrabold"
                        : "bg-white/[0.04] hover:bg-white/[0.08] text-zinc-400 hover:text-white"
                    }`}
                  >
                    {i + 1}
                  </button>
                ))}

                {/* Nút Sau */}
                <button
                  disabled={currentPage >= totalPages - 1}
                  onClick={() => setPage((prev) => prev + 1)}
                  className="w-9 h-9 rounded-xl bg-white/[0.04] hover:bg-white/[0.08] hover:text-white disabled:opacity-20 disabled:cursor-not-allowed text-zinc-400 flex items-center justify-center transition active:scale-95 cursor-pointer"
                  title="Trang sau"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}