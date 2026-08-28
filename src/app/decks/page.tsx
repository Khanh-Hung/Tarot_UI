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
      <div className="text-center max-w-3xl mx-auto space-y-3">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/[0.04] border border-white/15 text-xs text-slate-200 shadow-xl backdrop-blur-md">
          <BookOpen className="w-4 h-4 text-amber-300" />
          <span>Bách Khoa Toàn Thư & Tra Cứu Ý Nghĩa 78 Lá Bài Tarot</span>
        </div>
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
                          <div className="text-[10px] text-zinc-400 flex items-center gap-1.5">
                            <span className="truncate">{schoolLabel}</span>
                            <span>•</span>
                            <span>78 lá</span>
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

        {/* Hàng 2: Ô tìm kiếm lá bài + Bộ lọc danh mục */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-1">
          {/* Ô tìm kiếm lá bài */}
          <div className="relative w-full sm:w-80">
            <Search className="w-4 h-4 text-zinc-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Tìm kiếm theo tên lá bài hoặc từ khóa..."
              className="w-full pl-10 pr-4 py-2 rounded-xl bg-[#191a1e] border border-[#2c2e35] text-xs sm:text-sm text-zinc-100 placeholder-zinc-500 focus:outline-none focus:border-[#525560] transition"
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

          {/* Đếm số lá bài */}
          <div className="text-xs text-zinc-400">
            Hiển thị <strong className="text-white font-bold">{filteredCards.length}</strong> / {cards.length} lá bài
          </div>
        </div>

        {/* Nút lọc danh mục chuẩn quốc tế */}
        <div className="flex items-center gap-1.5 flex-wrap">
          {[
            { key: "ALL", label: "Tất Cả (78)", icon: <Layers className="w-3.5 h-3.5" /> },
            { key: "MAJOR", label: "22 Ẩn Chính", icon: <Crown className="w-3.5 h-3.5" /> },
            { key: "COURT", label: "16 Hoàng Gia", icon: <Users className="w-3.5 h-3.5" /> },
            { key: "PIPS", label: "40 Lá Số", icon: <Hash className="w-3.5 h-3.5" /> },
            { key: "WANDS", label: "Gậy (Hỏa)", icon: <Flame className="w-3.5 h-3.5" /> },
            { key: "CUPS", label: "Cốc (Thủy)", icon: <Droplets className="w-3.5 h-3.5" /> },
            { key: "SWORDS", label: "Kiếm (Khí)", icon: <Wind className="w-3.5 h-3.5" /> },
            { key: "PENTACLES", label: "Tiền/Đĩa (Đất)", icon: <Globe2 className="w-3.5 h-3.5" /> },
          ].map((cat) => {
            const isActive = activeCategory === cat.key;
            return (
              <button
                key={cat.key}
                onClick={() => setActiveCategory(cat.key as CategoryFilter)}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all duration-200 flex items-center gap-1.5 cursor-pointer select-none ${
                  isActive
                    ? "bg-zinc-100 text-zinc-950 shadow-md shadow-white/10 font-bold active:scale-95"
                    : "bg-[#23242a] text-zinc-400 hover:text-zinc-200 hover:bg-[#2b2c33] border border-[#3b3d46]"
                }`}
              >
                {cat.icon}
                <span>{cat.label}</span>
              </button>
            );
          })}
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

      {/* 🌟 MODAL XEM CHI TIẾT LÁ BÀI COMPACT & TINH TẾ */}
      {selectedCard && (
        <div
          onClick={() => setSelectedCard(null)}
          className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6 bg-black/90 backdrop-blur-xl animate-in fade-in"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="relative w-full max-w-xl max-h-[85vh] overflow-y-auto rounded-3xl border border-[#31333a] bg-[#1a1b1f] p-5 sm:p-6 shadow-2xl space-y-4 my-auto"
          >
            {/* Header Modal: Tiêu đề & Nút đóng */}
            <div className="flex items-center justify-between pb-2.5 border-b border-[#2c2e35]">
              <div className="flex items-center gap-2 text-xs font-bold text-zinc-300">
                <BookOpen className="w-4 h-4 text-amber-400" />
                <span>Chi Tiết Lá Bài Tarot</span>
              </div>

              {/* Nút đóng */}
              <button
                onClick={() => setSelectedCard(null)}
                className="w-7 h-7 rounded-full bg-[#23242a] hover:bg-[#2b2c33] border border-[#3b3d46] flex items-center justify-center text-zinc-300 hover:text-white transition cursor-pointer"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Khung nội dung */}
            <div className="flex flex-col sm:flex-row gap-5 items-start">
              {/* Cột trái: Ảnh lá bài nhỏ gọn */}
              <div className="w-32 sm:w-36 aspect-[1/1.7] shrink-0 rounded-2xl overflow-hidden bg-black/80 border-2 border-amber-400/40 shadow-xl mx-auto sm:mx-0">
                {selectedCard.imageUrl && (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={selectedCard.imageUrl}
                    alt={selectedCard.nameVi}
                    className="w-full h-full object-cover"
                  />
                )}
              </div>

              {/* Cột phải: Thông tin chi tiết */}
              <div className="flex-1 space-y-3 min-w-0">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-[9px] font-bold uppercase tracking-wider text-amber-200 bg-amber-400/20 px-2 py-0.5 rounded-md border border-amber-300/30">
                      {(selectedCard.arcanaType === "MAJOR" || selectedCard.arcanaType === "MAJOR_ARCANA")
                        ? "22 Ẩn Chính"
                        : "56 Ẩn Phụ"}
                    </span>
                    {getElementBadge(selectedCard.element)}
                  </div>
                  <h2 className="text-lg sm:text-xl font-bold text-zinc-100 leading-tight">
                    {selectedCard.nameVi}
                  </h2>
                </div>

                {/* Từ khóa */}
                {selectedCard.keywords && (
                  <div>
                    <h4 className="text-[10px] font-bold uppercase tracking-wider text-zinc-400 mb-0.5">
                      Từ Khóa Cốt Lõi
                    </h4>
                    <p className="text-xs text-amber-200/90 font-medium leading-relaxed">
                      {selectedCard.keywords}
                    </p>
                  </div>
                )}

                {/* Ý nghĩa xuôi */}
                {selectedCard.uprightMeaning && (
                  <div className="p-2.5 sm:p-3 rounded-xl bg-emerald-950/20 border border-emerald-500/25 space-y-1">
                    <h4 className="text-xs font-bold text-emerald-300 flex items-center gap-1">
                      <span>☀️</span>
                      <span>Ý Nghĩa Chiều Xuôi</span>
                    </h4>
                    <p className="text-xs text-zinc-200 leading-relaxed">
                      {selectedCard.uprightMeaning}
                    </p>
                  </div>
                )}

                {/* Ý nghĩa ngược */}
                {selectedCard.reversedMeaning && (
                  <div className="p-2.5 sm:p-3 rounded-xl bg-rose-950/20 border border-rose-500/25 space-y-1">
                    <h4 className="text-xs font-bold text-rose-300 flex items-center gap-1">
                      <span>🌙</span>
                      <span>Ý Nghĩa Chiều Ngược</span>
                    </h4>
                    <p className="text-xs text-zinc-200 leading-relaxed">
                      {selectedCard.reversedMeaning}
                    </p>
                  </div>
                )}
              </div>
            </div>

            {/* Footer modal */}
            <div className="pt-3 border-t border-[#2c2e35] flex items-center justify-between gap-3">
              <button
                onClick={() => setSelectedCard(null)}
                className="px-4 py-2 rounded-xl border border-[#3b3d46] bg-[#23242a] hover:bg-[#2b2c33] hover:border-[#525560] text-xs font-medium text-zinc-300 hover:text-white transition cursor-pointer"
              >
                Đóng
              </button>

              <Link
                href={`/reading?deckCode=${selectedDeckCode}`}
                className="px-5 py-2 rounded-xl silver-gradient-btn font-bold text-xs flex items-center gap-1.5 transition hover:scale-105 shadow-md"
              >
                <Sparkles className="w-4 h-4 text-zinc-950" />
                <span>Bốc quẻ bài với bộ này</span>
                <ArrowRight className="w-4 h-4 text-zinc-950" />
              </Link>
            </div>
          </div>
        </div>
      )}

      {/* 📜 MODAL BÁCH KHOA LỊCH SỬ & TRƯỜNG PHÁI BỘ BÀI */}
      {isDeckLoreModalOpen && (
        <div
          onClick={() => setIsDeckLoreModalOpen(false)}
          className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6 bg-black/90 backdrop-blur-xl animate-in fade-in"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="relative w-full max-w-2xl max-h-[88vh] overflow-y-auto rounded-3xl border border-[#31333a] bg-[#1a1b1f] p-5 sm:p-7 shadow-2xl space-y-5 my-auto"
          >
            {/* Header */}
            <div className="flex items-center justify-between pb-3 border-b border-[#2c2e35]">
              <div className="flex items-center gap-2 text-sm font-bold text-zinc-100">
                <BookOpen className="w-4 h-4 text-amber-400" />
                <span>Bách Khoa Lịch Sử & Trường Phái: {DECK_LORE_MAP[selectedDeckCode]?.name || "Bộ Bài"}</span>
              </div>
              <button
                onClick={() => setIsDeckLoreModalOpen(false)}
                className="w-7 h-7 rounded-full bg-[#23242a] hover:bg-[#2b2c33] border border-[#3b3d46] flex items-center justify-center text-zinc-300 hover:text-white transition cursor-pointer"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Meta Card */}
            {(() => {
              const lore = DECK_LORE_MAP[selectedDeckCode] || DECK_LORE_MAP.RIDER_WAITE_CLASSIC;
              return (
                <>
                  <div className="flex gap-4 items-center p-4 rounded-2xl bg-[#212227] border border-[#2c2e35]">
                    <div className="w-14 sm:w-16 aspect-[1/1.65] shrink-0 rounded-lg overflow-hidden bg-black/80 border border-amber-400/40 shadow-lg">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={lore.coverImage} alt={lore.name} className="w-full h-full object-cover" />
                    </div>
                    <div className="min-w-0 flex-1 space-y-1.5 text-xs">
                      <h3 className="font-bold text-base text-amber-200">{lore.originalName}</h3>
                      <div className="text-zinc-300 flex flex-col gap-1 text-[11px] pt-0.5">
                        <div className="flex items-start gap-1.5">
                          <span className="shrink-0 text-zinc-400 font-semibold">🏛️ Tác giả:</span>
                          <span className="text-zinc-200">{lore.author}</span>
                        </div>
                        <div className="flex items-start gap-1.5">
                          <span className="shrink-0 text-zinc-400 font-semibold">🎨 Họa sĩ:</span>
                          <span className="text-zinc-200">{lore.illustrator}</span>
                        </div>
                        <div className="flex items-start gap-1.5">
                          <span className="shrink-0 text-zinc-400 font-semibold">📅 Năm sáng tác:</span>
                          <span className="text-zinc-200">{lore.year}</span>
                        </div>
                        <div className="flex items-start gap-1.5">
                          <span className="shrink-0 text-zinc-400 font-semibold">🔮 Trường phái:</span>
                          <span className="text-zinc-200">{lore.school}</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Body Sections */}
                  <div className="space-y-3.5 text-xs leading-relaxed text-zinc-200">
                    {/* Tóm tắt */}
                    <div className="p-3.5 rounded-2xl bg-white/[0.02] border border-white/[0.06] space-y-1">
                      <h4 className="font-bold text-amber-300 flex items-center gap-1.5 text-xs uppercase tracking-wider">
                        <span>🌟</span>
                        <span>Tổng Quan</span>
                      </h4>
                      <p className="text-zinc-300">{lore.summary}</p>
                    </div>

                    {/* Lịch sử */}
                    <div className="p-3.5 rounded-2xl bg-white/[0.02] border border-white/[0.06] space-y-1">
                      <h4 className="font-bold text-amber-300 flex items-center gap-1.5 text-xs uppercase tracking-wider">
                        <span>📜</span>
                        <span>Lịch Sử & Hoàn Cảnh Ra Đời</span>
                      </h4>
                      <p className="text-zinc-300">{lore.history}</p>
                    </div>

                    {/* Nghệ thuật */}
                    <div className="p-3.5 rounded-2xl bg-white/[0.02] border border-white/[0.06] space-y-1">
                      <h4 className="font-bold text-sky-300 flex items-center gap-1.5 text-xs uppercase tracking-wider">
                        <span>🎨</span>
                        <span>Phong Cách Nghệ Thuật & Biểu Tượng</span>
                      </h4>
                      <p className="text-zinc-300">{lore.artStyle}</p>
                    </div>

                    {/* Điểm khác biệt */}
                    <div className="p-3.5 rounded-2xl bg-white/[0.02] border border-white/[0.06] space-y-2">
                      <h4 className="font-bold text-emerald-300 flex items-center gap-1.5 text-xs uppercase tracking-wider">
                        <span>🔮</span>
                        <span>Điểm Khác Biệt So Với Các Bộ Bài Khác</span>
                      </h4>
                      <ul className="space-y-1.5 pl-1">
                        {lore.keyDifferences.map((diff, i) => (
                          <li key={i} className="flex items-start gap-2 text-zinc-300">
                            <span className="text-amber-400 font-bold mt-0.5">•</span>
                            <span>{diff}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    {/* Phù hợp cho ai */}
                    <div className="p-3.5 rounded-2xl bg-amber-950/20 border border-amber-500/25 space-y-1">
                      <h4 className="font-bold text-amber-200 flex items-center gap-1.5 text-xs uppercase tracking-wider">
                        <span>🎯</span>
                        <span>Khi Nào Nên Bốc Quẻ Bộ Bài Này?</span>
                      </h4>
                      <p className="text-zinc-200">{lore.bestFor}</p>
                    </div>

                    {/* Triết lý tâm linh */}
                    <div className="p-3.5 rounded-2xl bg-purple-950/20 border border-purple-500/25 space-y-1">
                      <h4 className="font-bold text-purple-200 flex items-center gap-1.5 text-xs uppercase tracking-wider">
                        <span>🕊️</span>
                        <span>Triết Lý Huyền Học Cốt Lõi</span>
                      </h4>
                      <p className="text-zinc-200 italic">{lore.spiritualMeaning}</p>
                    </div>
                  </div>
                </>
              );
            })()}

            {/* Footer */}
            <div className="pt-3 border-t border-[#2c2e35] flex items-center justify-between gap-3">
              <button
                onClick={() => setIsDeckLoreModalOpen(false)}
                className="px-4 py-2 rounded-xl border border-[#3b3d46] bg-[#23242a] hover:bg-[#2b2c33] hover:border-[#525560] text-xs font-medium text-zinc-300 hover:text-white transition cursor-pointer"
              >
                Đóng
              </button>

              <Link
                href={`/reading?deckCode=${selectedDeckCode}`}
                className="px-5 py-2 rounded-xl silver-gradient-btn font-bold text-xs flex items-center gap-1.5 transition hover:scale-105 shadow-md"
              >
                <Sparkles className="w-4 h-4 text-zinc-950" />
                <span>Bốc quẻ bài với bộ này</span>
                <ArrowRight className="w-4 h-4 text-zinc-950" />
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
