"use client";

import React, { useState, useEffect, useRef, Suspense } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import {
  Sparkles,
  Search,
  BookOpen,
  ArrowRight,
  Loader2,
  X,
  Flame,
  Droplets,
  Wind,
  Globe2,
  Crown,
  Layers,
  ChevronRight,
  ChevronDown,
  Check,
  Users,
  Hash,
  RotateCcw,
} from "lucide-react";
import { CardDto, DeckCode, DeckDto } from "@/features/tarot/types/tarot.types";
import { tarotService } from "@/features/tarot/services/tarotService";
import { DECK_LORE_MAP } from "@/features/tarot/constants/deckLore";

type CategoryFilter = "ALL" | "MAJOR" | "COURT" | "PIPS" | "WANDS" | "CUPS" | "SWORDS" | "PENTACLES";

function DecksContent() {
  const searchParams = useSearchParams();
  const [decks, setDecks] = useState<DeckDto[]>([]);
  const [selectedDeckCode, setSelectedDeckCode] = useState<DeckCode>("RIDER_WAITE_CLASSIC");
  const [cards, setCards] = useState<CardDto[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState<CategoryFilter>("ALL");
  const [selectedCard, setSelectedCard] = useState<CardDto | null>(null);
  const [isDeckDropdownOpen, setIsDeckDropdownOpen] = useState(false);
  const [isCategoryDropdownOpen, setIsCategoryDropdownOpen] = useState(false);
  const [isDeckLoreModalOpen, setIsDeckLoreModalOpen] = useState(false);
  const deckDropdownRef = useRef<HTMLDivElement>(null);
  const categoryDropdownRef = useRef<HTMLDivElement>(null);

  // Đóng dropdown khi click ra ngoài
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (deckDropdownRef.current && !deckDropdownRef.current.contains(event.target as Node)) {
        setIsDeckDropdownOpen(false);
      }
      if (categoryDropdownRef.current && !categoryDropdownRef.current.contains(event.target as Node)) {
        setIsCategoryDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Load danh sách bộ bài
  useEffect(() => {
    async function loadDecks() {
      try {
        const data = await tarotService.getDecks();
        setDecks(data);
        const paramDeck = searchParams.get("deckCode") as DeckCode;
        if (paramDeck && data.some((d) => d.code === paramDeck)) {
          setSelectedDeckCode(paramDeck);
        } else if (data.length > 0) {
          setSelectedDeckCode(data[0].code);
        }
      } catch (err) {
        console.error("Failed to load decks:", err);
      }
    }
    loadDecks();
  }, [searchParams]);

  // Load 78 lá bài khi đổi bộ bài
  useEffect(() => {
    async function loadCards() {
      if (!selectedDeckCode) return;
      setIsLoading(true);
      try {
        const data = await tarotService.getCardsByDeck(selectedDeckCode);
        setCards(data);
      } catch (err) {
        console.error("Failed to load cards:", err);
      } finally {
        setIsLoading(false);
      }
    }
    loadCards();
  }, [selectedDeckCode]);

  // Lọc theo danh mục và từ khóa tìm kiếm
  const filteredCards = cards.filter((card) => {
    const isMajor = card.arcanaType === "MAJOR" || card.arcanaType === "MAJOR_ARCANA";
    const nameAll = `${card.nameEn || ""} ${card.nameVi || ""}`.toLowerCase();
    const isCourt = !isMajor && (
      nameAll.includes("page") || nameAll.includes("knight") || nameAll.includes("queen") || nameAll.includes("king") ||
      nameAll.includes("princess") || nameAll.includes("prince") ||
      nameAll.includes("tiểu đồng") || nameAll.includes("hiệp sĩ") || nameAll.includes("hoàng hậu") || nameAll.includes("vua") ||
      nameAll.includes("valet") || nameAll.includes("cavalier") || nameAll.includes("reine") || nameAll.includes("roi")
    );
    const isPip = !isMajor && !isCourt;

    // 1. Lọc theo danh mục
    if (activeCategory === "MAJOR" && !isMajor) return false;
    if (activeCategory === "COURT" && !isCourt) return false;
    if (activeCategory === "PIPS" && !isPip) return false;
    if (activeCategory === "WANDS" && card.arcanaType !== "WANDS" && !card.nameVi.includes("Gậy")) return false;
    if (activeCategory === "CUPS" && card.arcanaType !== "CUPS" && !card.nameVi.includes("Cốc")) return false;
    if (activeCategory === "SWORDS" && card.arcanaType !== "SWORDS" && !card.nameVi.includes("Kiếm")) return false;
    if (activeCategory === "PENTACLES" && card.arcanaType !== "PENTACLES" && !card.nameVi.includes("Tiền") && !card.nameVi.includes("Đĩa")) return false;

    // 2. Lọc theo từ khóa
    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase().trim();
    return (
      card.nameVi?.toLowerCase().includes(q) ||
      card.keywords?.toLowerCase().includes(q) ||
      card.uprightMeaning?.toLowerCase().includes(q) ||
      card.reversedMeaning?.toLowerCase().includes(q)
    );
  });

  const currentDeck = decks.find((d) => d.code === selectedDeckCode) || decks[0];

  const getElementBadge = (element?: string) => {
    switch (element?.toUpperCase()) {
      case "FIRE":
      case "LỬA":
        return (
          <span className="inline-flex items-center gap-1 text-[10px] font-medium text-amber-300 bg-amber-400/10 px-2 py-0.5 rounded-md border border-amber-300/20">
            <Flame className="w-3 h-3 text-amber-400" /> Hỏa
          </span>
        );
      case "WATER":
      case "NƯỚC":
        return (
          <span className="inline-flex items-center gap-1 text-[10px] font-medium text-sky-300 bg-sky-400/10 px-2 py-0.5 rounded-md border border-sky-300/20">
            <Droplets className="w-3 h-3 text-sky-400" /> Thủy
          </span>
        );
      case "AIR":
      case "KHÍ":
        return (
          <span className="inline-flex items-center gap-1 text-[10px] font-medium text-slate-300 bg-slate-400/10 px-2 py-0.5 rounded-md border border-slate-300/20">
            <Wind className="w-3 h-3 text-slate-300" /> Khí
          </span>
        );
      case "EARTH":
      case "ĐẤT":
        return (
          <span className="inline-flex items-center gap-1 text-[10px] font-medium text-emerald-300 bg-emerald-400/10 px-2 py-0.5 rounded-md border border-emerald-300/20">
            <Globe2 className="w-3 h-3 text-emerald-400" /> Đất
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1 text-[10px] font-medium text-zinc-400 bg-white/5 px-2 py-0.5 rounded-md border border-white/10">
            <Sparkles className="w-3 h-3 text-amber-300" /> Tâm Linh
          </span>
        );
    }
  };

  // Khóa cuộn trang khi modal đang mở để không bị trôi
  useEffect(() => {
    if (selectedCard) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [selectedCard]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8 animate-fade-in">
      {/* 🔮 HERO HEADER */}
      <div className="text-center max-w-3xl mx-auto space-y-2">
        <h1 className="text-3xl sm:text-4xl font-extrabold text-white">
          Khám Phá Các Bộ Bài Tarot Kinh Điển
        </h1>
        <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
          Tra cứu hình ảnh tranh vẽ sắc nét, biểu tượng huyền học, ý nghĩa chiều xuôi và chiều ngược của từng lá bài
        </p>
      </div>

      {/* 🔍 THANH ĐIỀU KHIỂN CHUYÊN NGHIỆP: DROPDOWN BỘ BÀI + TÌM KIẾM + BỘ LỌC */}
      <div className="space-y-4">
        {/* Hàng 1: Dropdown chọn bộ bài & Khung tóm tắt trường phái bộ bài */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-3 items-center">
          {/* 🎴 CỘT TRÁI: DROPDOWN CHỌN BỘ BÀI (4 COLS) */}
          <div ref={deckDropdownRef} className="relative lg:col-span-4 w-full">
            <button
              type="button"
              onClick={() => setIsDeckDropdownOpen(!isDeckDropdownOpen)}
              className={`w-full p-2.5 rounded-2xl border transition-all duration-200 cursor-pointer flex items-center justify-between gap-3 select-none text-left ${
                isDeckDropdownOpen
                  ? "bg-[#23242a] border-amber-400/80 shadow-lg shadow-black/40 ring-1 ring-amber-400/30"
                  : "bg-[#191a1e] border-[#2c2e35] hover:border-[#42454e] hover:bg-[#1e1f24]"
              }`}
            >
              <div className="flex items-center gap-3 min-w-0">
                {currentDeck?.coverImageUrl && (
                  <div className="w-8 sm:w-9 aspect-[1/1.6] shrink-0 rounded-lg overflow-hidden bg-black/60 border border-white/15 shadow">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={currentDeck.coverImageUrl}
                      alt={currentDeck.nameVi}
                      className="w-full h-full object-cover"
                    />
                  </div>
                )}
                <div className="min-w-0 flex-1">
                  <div className="text-[10px] text-zinc-400 font-medium">Bộ Bài Đang Xem</div>
                  <h3 className="text-xs sm:text-sm font-bold text-amber-200 truncate">
                    {currentDeck?.nameVi || "Chọn Bộ Bài"}
                  </h3>
                </div>
              </div>
              <ChevronDown className={`w-4 h-4 text-zinc-400 transition-transform duration-200 shrink-0 ${isDeckDropdownOpen ? "rotate-180 text-amber-300" : ""}`} />
            </button>

            {/* Menu danh sách bộ bài thả xuống */}
            {isDeckDropdownOpen && (
              <div className="absolute top-full left-0 mt-2 w-full z-50 rounded-2xl bg-[#1c1d22]/95 backdrop-blur-xl border border-[#31333a] shadow-2xl p-1.5 space-y-1 animate-in fade-in slide-in-from-top-2">
                <div className="px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-zinc-400 border-b border-[#2c2e35] mb-1">
                  Danh Sách Bộ Bài ({decks.length})
                </div>
                {decks.map((deck) => {
                  const isSelected = selectedDeckCode === deck.code;
                  const schoolLabel =
                    deck.code === "RIDER_WAITE_CLASSIC"
                      ? "🏛️ Kinh Điển 1909"
                      : deck.code === "THOTH_ALEISTER"
                      ? "🔮 Thoth Thelema"
                      : "⚜️ Marseille 1760";

                  return (
                    <div
                      key={deck.code}
                      onClick={() => {
                        setSelectedDeckCode(deck.code);
                        setActiveCategory("ALL");
                        setSearchQuery("");
                        setIsDeckDropdownOpen(false);
                      }}
                      className={`p-2 rounded-xl transition-all duration-150 cursor-pointer flex items-center justify-between gap-3 select-none ${
                        isSelected
                          ? "bg-[#282a32] text-amber-200 border border-amber-400/30 font-semibold"
                          : "hover:bg-[#23242a] text-zinc-200 hover:text-white"
                      }`}
                    >
                      <div className="flex items-center gap-2.5 min-w-0">
                        {deck.coverImageUrl && (
                          <div className="w-7 aspect-[1/1.6] shrink-0 rounded-md overflow-hidden bg-black/60 border border-white/10 shadow">
                            {/* eslint-disable-next-line @next/next/no-img-element */}
                            <img
                              src={deck.coverImageUrl}
                              alt={deck.nameVi}
                              className="w-full h-full object-cover"
                            />
                          </div>
                        )}
                        <div className="min-w-0">
                          <div className="text-xs font-bold truncate">{deck.nameVi}</div>
                          <div className="text-[10px] text-zinc-400">
                            <span className="truncate">{schoolLabel}</span>
                          </div>
                        </div>
                      </div>
                      {isSelected && <Check className="w-4 h-4 text-amber-400 shrink-0" />}
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* 📖 CỘT PHẢI: KHUNG TÓM TẮT TRƯỜNG PHÁI & NÚT BỐC BÀI NHANH (8 COLS) */}
          <div className="lg:col-span-8 p-2.5 sm:px-4 sm:py-2.5 rounded-2xl bg-[#191a1e] border border-[#2c2e35] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 shadow-md">
            <div className="min-w-0 flex-1 space-y-1">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="rounded-full bg-white/[0.06] px-2.5 py-0.5 text-[10px] font-bold text-amber-200 border border-white/10 flex items-center gap-1">
                  <span>{selectedDeckCode === "RIDER_WAITE_CLASSIC" ? "🏛️" : selectedDeckCode === "THOTH_ALEISTER" ? "🔮" : "⚜️"}</span>
                  <span>
                    {selectedDeckCode === "RIDER_WAITE_CLASSIC"
                      ? "Arthur E. Waite (1909)"
                      : selectedDeckCode === "THOTH_ALEISTER"
                      ? "Aleister Crowley & Lady Frieda Harris (1944)"
                      : "Nicolas Conver (Marseille 1760)"}
                  </span>
                </span>
                <span className="text-[10px] text-zinc-400 font-medium">Trọn bộ 78 lá bài</span>
                <button
                  type="button"
                  onClick={() => setIsDeckLoreModalOpen(true)}
                  className="text-[11px] font-bold text-amber-300 hover:text-amber-200 underline flex items-center gap-1 cursor-pointer transition ml-1"
                >
                  <BookOpen className="w-3 h-3" />
                  <span>Xem lịch sử & trường phái chi tiết</span>
                </button>
              </div>
              <p className="text-[11px] sm:text-xs text-zinc-300 leading-relaxed line-clamp-2">
                {currentDeck?.description || currentDeck?.descriptionVi || currentDeck?.nameVi}
              </p>
            </div>

            {/* Nút bốc quẻ với bộ bài này */}
            <Link
              href={`/reading?deckCode=${selectedDeckCode}`}
              className="shrink-0 px-3.5 py-1.5 rounded-xl silver-gradient-btn font-bold text-xs flex items-center gap-1.5 transition hover:scale-105 shadow-sm active:scale-95"
            >
              <Sparkles className="w-3.5 h-3.5 text-zinc-950" />
              <span>Bốc quẻ với bộ này</span>
              <ArrowRight className="w-3.5 h-3.5 text-zinc-950" />
            </Link>
          </div>
        </div>

        {/* Hàng 2: Ô tìm kiếm lá bài + Dropdown lọc danh mục + Đếm số lượng */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 pt-1">
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 flex-1">
            {/* Ô tìm kiếm lá bài */}
            <div className="relative w-full sm:w-80">
              <Search className="w-4 h-4 text-zinc-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Tìm kiếm theo tên lá bài hoặc từ khóa..."
                className="w-full h-10 pl-10 pr-8 rounded-xl bg-[#191a1e] border border-[#2c2e35] text-xs sm:text-sm text-zinc-100 placeholder-zinc-500 focus:outline-none focus:border-[#525560] transition"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery("")}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-white"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>

            {/* 🎴 DROPDOWN BỘ LỌC DANH MỤC COMPACT */}
            {(() => {
              const CATEGORY_OPTIONS: { key: CategoryFilter; label: string; countBadge: string; icon: React.ReactNode }[] = [
                { key: "ALL", label: "Tất Cả", countBadge: "78 lá", icon: <Layers className="w-3.5 h-3.5 text-zinc-400" /> },
                { key: "MAJOR", label: "22 Ẩn Chính", countBadge: "22 lá", icon: <Crown className="w-3.5 h-3.5 text-amber-400" /> },
                { key: "COURT", label: "16 Hoàng Gia", countBadge: "16 lá", icon: <Users className="w-3.5 h-3.5 text-purple-400" /> },
                { key: "PIPS", label: "40 Lá Số", countBadge: "40 lá", icon: <Hash className="w-3.5 h-3.5 text-zinc-300" /> },
                { key: "WANDS", label: "Gậy (Hỏa)", countBadge: "14 lá", icon: <Flame className="w-3.5 h-3.5 text-amber-400" /> },
                { key: "CUPS", label: "Cốc (Thủy)", countBadge: "14 lá", icon: <Droplets className="w-3.5 h-3.5 text-sky-400" /> },
                { key: "SWORDS", label: "Kiếm (Khí)", countBadge: "14 lá", icon: <Wind className="w-3.5 h-3.5 text-slate-300" /> },
                { key: "PENTACLES", label: "Tiền/Đĩa (Đất)", countBadge: "14 lá", icon: <Globe2 className="w-3.5 h-3.5 text-emerald-400" /> },
              ];
              const currentCat = CATEGORY_OPTIONS.find((c) => c.key === activeCategory) || CATEGORY_OPTIONS[0];

              return (
                <div ref={categoryDropdownRef} className="relative w-full sm:w-52 shrink-0">
                  <button
                    type="button"
                    onClick={() => setIsCategoryDropdownOpen(!isCategoryDropdownOpen)}
                    className={`w-full h-10 px-3.5 rounded-xl border transition-all duration-200 cursor-pointer flex items-center justify-between gap-2 select-none text-left ${
                      isCategoryDropdownOpen
                        ? "bg-[#23242a] border-amber-400/80 shadow-lg ring-1 ring-amber-400/30 text-amber-200"
                        : activeCategory !== "ALL"
                        ? "bg-[#23242a] border-amber-400/50 text-amber-200 font-semibold"
                        : "bg-[#191a1e] border-[#2c2e35] hover:border-[#42454e] hover:bg-[#1e1f24] text-zinc-200"
                    }`}
                  >
                    <div className="flex items-center gap-2 min-w-0">
                      <span className="shrink-0">{currentCat.icon}</span>
                      <span className="text-xs font-bold truncate">{currentCat.label}</span>
                    </div>
                    <ChevronDown className={`w-3.5 h-3.5 text-zinc-400 transition-transform duration-200 shrink-0 ${isCategoryDropdownOpen ? "rotate-180 text-amber-300" : ""}`} />
                  </button>

                  {/* Menu danh mục thả xuống nhỏ gọn & chống tràn màn hình */}
                  {isCategoryDropdownOpen && (
                    <div className="absolute top-full left-0 mt-1.5 w-full sm:w-60 max-h-[60vh] overflow-y-auto z-50 rounded-2xl bg-[#1c1d22]/95 backdrop-blur-xl border border-[#31333a] shadow-2xl p-1.5 space-y-0.5 animate-in fade-in slide-in-from-top-2">
                      <div className="px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-zinc-400 border-b border-[#2c2e35] mb-1 flex items-center justify-between">
                        <span>Danh Mục</span>
                        <span>8 Nhóm</span>
                      </div>
                      {CATEGORY_OPTIONS.map((cat) => {
                        const isSelected = activeCategory === cat.key;
                        return (
                          <div
                            key={cat.key}
                            onClick={() => {
                              setActiveCategory(cat.key);
                              setIsCategoryDropdownOpen(false);
                            }}
                            className={`px-2.5 py-1.5 rounded-xl transition-all duration-150 cursor-pointer flex items-center justify-between gap-2 select-none ${
                              isSelected
                                ? "bg-[#282a32] text-amber-200 border border-amber-400/30 font-semibold"
                                : "hover:bg-[#23242a] text-zinc-200 hover:text-white"
                            }`}
                          >
                            <div className="flex items-center gap-2 min-w-0">
                              <span className="shrink-0">{cat.icon}</span>
                              <span className="text-xs font-medium truncate">{cat.label}</span>
                            </div>
                            <span
                              className={`text-[10px] px-1.5 py-0.5 rounded-md border font-mono shrink-0 transition-colors ${
                                isSelected
                                  ? "text-amber-300 bg-amber-400/20 border-amber-400/40 font-bold"
                                  : "text-zinc-400 bg-black/40 border-white/5"
                              }`}
                            >
                              {cat.countBadge}
                            </span>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              );
            })()}

            {/* Nút xóa bộ lọc & tìm kiếm */}
            {(activeCategory !== "ALL" || searchQuery) && (
              <button
                type="button"
                onClick={() => {
                  setActiveCategory("ALL");
                  setSearchQuery("");
                }}
                className="h-10 px-3 rounded-xl border border-rose-500/30 bg-rose-950/20 hover:bg-rose-950/40 text-rose-300 hover:text-rose-200 text-xs font-semibold flex items-center gap-1.5 transition active:scale-95 shrink-0 animate-in fade-in zoom-in-95 cursor-pointer shadow-sm"
                title="Xóa bộ lọc và quay về Tất cả 78 lá"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Xóa bộ lọc</span>
              </button>
            )}
          </div>

          {/* Đếm số lá bài */}
          <div className="text-xs text-zinc-400 self-center sm:self-auto shrink-0">
            Hiển thị <strong className="text-white font-bold">{filteredCards.length}</strong> / {cards.length} lá bài
          </div>
        </div>
      </div>

      {/* 🎴 LƯỚI HIỂN THỊ 78 LÁ BÀI */}
      {isLoading ? (
        <div className="min-h-[40vh] flex flex-col items-center justify-center gap-3">
          <Loader2 className="w-8 h-8 animate-spin text-amber-300" />
          <p className="text-xs text-zinc-400">Đang nạp 78 lá bài...</p>
        </div>
      ) : filteredCards.length === 0 ? (
        <div className="text-center py-16 p-8 rounded-3xl border border-[#31333a] bg-[#191a1e]">
          <p className="text-sm text-zinc-400">Không tìm thấy lá bài nào khớp với từ khóa &ldquo;{searchQuery}&rdquo;</p>
          <button
            onClick={() => {
              setSearchQuery("");
              setActiveCategory("ALL");
            }}
            className="mt-3 text-xs text-amber-300 underline hover:text-amber-200 cursor-pointer"
          >
            Xóa bộ lọc
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
          {filteredCards.map((card) => (
            <div
              key={card.id}
              onClick={() => setSelectedCard(card)}
              className="group p-3 rounded-2xl border border-[#31333a] bg-[#191a1e] flex flex-col justify-between hover:border-[#525560] hover:bg-[#212227] transition-all duration-300 hover:scale-[1.03] cursor-pointer shadow-lg"
            >
              {/* Ảnh lá bài */}
              <div className="aspect-[1/1.7] w-full rounded-xl overflow-hidden bg-black/60 border border-[#31333a] mb-2.5 relative group-hover:border-amber-300/40 transition">
                {card.imageUrl ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={card.imageUrl}
                    alt={card.nameVi}
                    className="w-full h-full object-cover object-center group-hover:scale-105 transition duration-500"
                    loading="lazy"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-xs text-zinc-500">
                    Tarot Card
                  </div>
                )}
                {(card.arcanaType === "MAJOR" || card.arcanaType === "MAJOR_ARCANA") && (
                  <span className="absolute top-1.5 left-1.5 px-1.5 py-0.5 rounded-md bg-amber-400/90 text-zinc-950 text-[9px] font-extrabold shadow">
                    ẨN CHÍNH
                  </span>
                )}
              </div>

              {/* Tên lá bài */}
              <div className="space-y-1">
                <h3 className="text-xs font-bold text-zinc-100 group-hover:text-amber-200 transition line-clamp-1">
                  {card.nameVi}
                </h3>
                <div className="pt-1 flex items-center justify-between text-[10px] text-zinc-400">
                  {getElementBadge(card.element)}
                  <ChevronRight className="w-3 h-3 text-zinc-500 group-hover:text-white transition group-hover:translate-x-0.5" />
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* 🌟 MODAL XEM CHI TIẾT LÁ BÀI COMPACT & TINH TẾ (FIXED HEADER/FOOTER, SCROLLABLE BODY) */}
      {selectedCard && (
        <div
          onClick={() => setSelectedCard(null)}
          className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6 pt-16 pb-6 sm:pt-20 sm:pb-8 bg-black/85 backdrop-blur-md animate-in fade-in"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="relative w-full max-w-xl max-h-[75vh] flex flex-col rounded-2xl border border-white/10 bg-[#16171a] shadow-2xl overflow-hidden my-auto"
          >
            {/* Header Modal Cố Định */}
            <div className="shrink-0 flex items-center justify-between px-5 pt-4 pb-3 border-b border-white/[0.08] bg-[#16171a]">
              <div className="flex items-center gap-2 text-xs sm:text-sm font-bold text-zinc-300">
                <BookOpen className="w-4 h-4 text-zinc-400" />
                <span>Chi Tiết Lá Bài Tarot</span>
              </div>
              <button
                onClick={() => setSelectedCard(null)}
                className="w-6 h-6 rounded-full bg-white/[0.04] hover:bg-white/[0.08] flex items-center justify-center text-zinc-400 hover:text-white transition cursor-pointer"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Nội dung chi tiết lá bài (CHỈ CUỘN PHẦN NÀY) */}
            <div className="flex-1 min-h-0 overflow-y-auto px-5 py-4 [scrollbar-gutter:stable]">
              <div className="grid grid-cols-1 sm:grid-cols-12 gap-4 items-start">
                {/* Cột trái: Ảnh lá bài */}
                <div className="sm:col-span-5 flex flex-col items-center">
                  <div className="w-full max-w-[150px] aspect-[1/1.65] rounded-xl overflow-hidden bg-black/80 shadow-lg">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={selectedCard.imageUrl || "/cards/card-back.jpg"}
                      alt={selectedCard.nameVi}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="mt-2.5 text-center">
                    <h3 className="font-bold text-sm text-white">
                      {selectedCard.nameVi}
                    </h3>
                    <p className="text-[11px] text-zinc-400 italic">
                      {selectedCard.nameEn}
                    </p>
                  </div>
                </div>

                {/* Cột phải: Thông tin & Luận giải */}
                <div className="sm:col-span-7 space-y-2.5 text-xs">
                  {/* Meta tags */}
                  <div className="flex flex-wrap items-center gap-1.5 pb-1 border-b border-white/[0.06]">
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-white/[0.06] text-zinc-200">
                      {selectedCard.arcanaType === "MAJOR" ? "Ẩn Chính" : "Ẩn Phụ"}
                    </span>
                    {selectedCard.suit && (
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-medium bg-white/[0.04] text-zinc-400">
                        Bộ: {selectedCard.suit}
                      </span>
                    )}
                    {selectedCard.element && getElementBadge(selectedCard.element)}
                  </div>

                  {/* Từ khóa */}
                  {selectedCard.keywords && (
                    <div className="p-2.5 rounded-xl bg-white/[0.03] space-y-0.5">
                      <span className="font-semibold text-zinc-300 text-[11px] block">
                        🔑 Từ Khóa Cốt Lõi:
                      </span>
                      <p className="text-zinc-400 text-[11px]">
                        {selectedCard.keywords}
                      </p>
                    </div>
                  )}

                  {/* Ý nghĩa xuôi */}
                  {selectedCard.uprightMeaning && (
                    <div className="p-2.5 rounded-xl bg-emerald-950/20 border border-emerald-500/20 space-y-0.5">
                      <h4 className="text-[11px] font-bold text-emerald-300 flex items-center gap-1">
                        <span>☀️</span>
                        <span>Ý Nghĩa Chiều Xuôi</span>
                      </h4>
                      <p className="text-[11px] text-zinc-200 leading-relaxed">
                        {selectedCard.uprightMeaning}
                      </p>
                    </div>
                  )}

                  {/* Ý nghĩa ngược */}
                  {selectedCard.reversedMeaning && (
                    <div className="p-2.5 rounded-xl bg-rose-950/20 border border-rose-500/20 space-y-0.5">
                      <h4 className="text-[11px] font-bold text-rose-300 flex items-center gap-1">
                        <span>🌙</span>
                        <span>Ý Nghĩa Chiều Ngược</span>
                      </h4>
                      <p className="text-[11px] text-zinc-200 leading-relaxed">
                        {selectedCard.reversedMeaning}
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Footer modal Cố Định */}
            <div className="shrink-0 px-5 py-3 border-t border-white/[0.08] flex items-center justify-between gap-3 bg-[#16171a]">
              <button
                onClick={() => setSelectedCard(null)}
                className="px-3.5 py-1.5 rounded-xl bg-white/[0.04] hover:bg-white/[0.08] text-xs font-medium text-zinc-400 hover:text-white transition cursor-pointer"
              >
                Đóng
              </button>

              <Link
                href={`/reading?deckCode=${selectedDeckCode}`}
                className="px-4 py-1.5 rounded-xl silver-gradient-btn font-bold text-xs flex items-center gap-1.5 transition hover:scale-105 shadow-md"
              >
                <Sparkles className="w-3.5 h-3.5 text-zinc-950" />
                <span>Bốc bài với bộ này</span>
                <ArrowRight className="w-3.5 h-3.5 text-zinc-950" />
              </Link>
            </div>
          </div>
        </div>
      )}

      {/* 📜 MODAL BÁCH KHOA LỊCH SỬ & TRƯỜNG PHÁI BỘ BÀI (FIXED HEADER/FOOTER, SCROLLABLE BODY) */}
      {isDeckLoreModalOpen && (
        <div
          onClick={() => setIsDeckLoreModalOpen(false)}
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
                <span className="truncate">Lịch Sử: {DECK_LORE_MAP[selectedDeckCode]?.name || "Bộ Bài"}</span>
              </div>
              <button
                onClick={() => setIsDeckLoreModalOpen(false)}
                className="w-6 h-6 rounded-full bg-white/[0.04] hover:bg-white/[0.08] flex items-center justify-center text-zinc-400 hover:text-white transition cursor-pointer"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Scrollable Modal Body (CHỈ CUỘN NỘI DUNG NÀY) */}
            <div className="flex-1 min-h-0 overflow-y-auto px-5 py-4 space-y-4 [scrollbar-gutter:stable]">
              {(() => {
                const lore = DECK_LORE_MAP[selectedDeckCode] || DECK_LORE_MAP.RIDER_WAITE_CLASSIC;
                return (
                  <>
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
                  </>
                );
              })()}
            </div>

            {/* Footer Cố Định */}
            <div className="shrink-0 px-5 py-3 border-t border-white/[0.08] flex items-center justify-between gap-3 bg-[#16171a]">
              <button
                onClick={() => setIsDeckLoreModalOpen(false)}
                className="px-3.5 py-1.5 rounded-xl bg-white/[0.04] hover:bg-white/[0.08] text-xs font-medium text-zinc-400 hover:text-white transition cursor-pointer"
              >
                Đóng
              </button>

              <Link
                href={`/reading?deckCode=${selectedDeckCode}`}
                className="px-4 py-1.5 rounded-xl silver-gradient-btn font-bold text-xs flex items-center gap-1.5 transition hover:scale-105 shadow-md"
              >
                <Sparkles className="w-3.5 h-3.5 text-zinc-950" />
                <span>Bốc bài với bộ này</span>
                <ArrowRight className="w-3.5 h-3.5 text-zinc-950" />
              </Link>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default function DecksPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-[70vh] flex items-center justify-center">
          <Loader2 className="w-8 h-8 animate-spin text-slate-200" />
        </div>
      }
    >
      <DecksContent />
    </Suspense>
  );
}
