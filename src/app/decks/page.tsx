"use client";

import React, { useState, useEffect, useRef, Suspense } from "react";
import Image from "next/image";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import {
  Sparkles,
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
import { DeckCardsGridSkeleton, FullDeckPageSkeleton } from "@/components/ui/Skeleton";
import { CardDetailModal } from "@/features/tarot/components/CardDetailModal";
import { DeckLoreModal } from "@/features/tarot/components/DeckLoreModal";
import { getElementBadge } from "@/features/tarot/utils/elementBadge";
import { CustomSelect, OptionItem } from "@/components/ui/CustomSelect";
import { SearchInput } from "@/components/ui/SearchInput";
import { EmptyState } from "@/components/ui/EmptyState";

type CategoryFilter = "ALL" | "MAJOR" | "COURT" | "PIPS" | "WANDS" | "CUPS" | "SWORDS" | "PENTACLES";

const CATEGORY_OPTIONS: OptionItem[] = [
  { value: "ALL", label: "Tất Cả", sublabel: "78 lá", icon: <Layers className="w-3.5 h-3.5 text-zinc-400" /> },
  { value: "MAJOR", label: "22 Ẩn Chính", sublabel: "22 lá", icon: <Crown className="w-3.5 h-3.5 text-amber-400" /> },
  { value: "COURT", label: "16 Hoàng Gia", sublabel: "16 lá", icon: <Users className="w-3.5 h-3.5 text-purple-400" /> },
  { value: "PIPS", label: "40 Lá Số", sublabel: "40 lá", icon: <Hash className="w-3.5 h-3.5 text-zinc-300" /> },
  { value: "WANDS", label: "Gậy (Hỏa)", sublabel: "14 lá", icon: <Flame className="w-3.5 h-3.5 text-amber-400" /> },
  { value: "CUPS", label: "Cốc (Thủy)", sublabel: "14 lá", icon: <Droplets className="w-3.5 h-3.5 text-sky-400" /> },
  { value: "SWORDS", label: "Kiếm (Khí)", sublabel: "14 lá", icon: <Wind className="w-3.5 h-3.5 text-slate-300" /> },
  { value: "PENTACLES", label: "Tiền/Đĩa (Đất)", sublabel: "14 lá", icon: <Globe2 className="w-3.5 h-3.5 text-emerald-400" /> },
];

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
  const [isDeckLoreModalOpen, setIsDeckLoreModalOpen] = useState(false);
  const deckDropdownRef = useRef<HTMLDivElement>(null);

  // Đóng dropdown khi click ra ngoài
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (deckDropdownRef.current && !deckDropdownRef.current.contains(event.target as Node)) {
        setIsDeckDropdownOpen(false);
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
        <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-zinc-100">
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
                  <div className="w-8 sm:w-9 aspect-[1/1.6] shrink-0 rounded-lg overflow-hidden bg-black/60 border border-white/15 shadow relative">
                    <Image
                      src={currentDeck.coverImageUrl}
                      alt={currentDeck.nameVi}
                      fill
                      sizes="36px"
                      className="object-cover"
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
                          <div className="w-7 aspect-[1/1.6] shrink-0 rounded-md overflow-hidden bg-black/60 border border-white/10 shadow relative">
                            <Image
                              src={deck.coverImageUrl}
                              alt={deck.nameVi}
                              fill
                              sizes="28px"
                              className="object-cover"
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
            <SearchInput
              value={searchQuery}
              onChange={setSearchQuery}
              placeholder="Tìm kiếm theo tên lá bài hoặc từ khóa..."
              className="w-full sm:w-80"
            />

            {/* 🎴 DROPDOWN BỘ LỌC DANH MỤC */}
            <div className="w-full sm:w-52 shrink-0">
              <CustomSelect
                options={CATEGORY_OPTIONS}
                value={activeCategory}
                onChange={(val) => setActiveCategory(val as CategoryFilter)}
              />
            </div>

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
        <DeckCardsGridSkeleton />
      ) : filteredCards.length === 0 ? (
        <EmptyState
          title="Không tìm thấy lá bài nào"
          description={`Không có lá bài nào khớp với từ khóa "${searchQuery}" trong danh mục hiện tại.`}
          action={{
            label: "Xóa bộ lọc",
            onClick: () => {
              setSearchQuery("");
              setActiveCategory("ALL");
            },
          }}
        />
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
                  <Image
                    src={card.imageUrl}
                    alt={card.nameVi}
                    fill
                    sizes="(max-width: 640px) 45vw, (max-width: 768px) 30vw, (max-width: 1024px) 22vw, 15vw"
                    className="object-cover object-center group-hover:scale-105 transition duration-500"
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

      {/* 🌟 MODAL XEM CHI TIẾT LÁ BÀI */}
      <CardDetailModal
        card={selectedCard}
        onClose={() => setSelectedCard(null)}
        selectedDeckCode={selectedDeckCode}
      />

      {/* 📜 MODAL BÁCH KHOA LỊCH SỬ & TRƯỜNG PHÁI BỘ BÀI */}
      <DeckLoreModal
        isOpen={isDeckLoreModalOpen}
        onClose={() => setIsDeckLoreModalOpen(false)}
        selectedDeckCode={selectedDeckCode}
      />
    </div>
  );
}

export default function DecksPage() {
  return (
    <Suspense fallback={<FullDeckPageSkeleton />}>
      <DecksContent />
    </Suspense>
  );
}
