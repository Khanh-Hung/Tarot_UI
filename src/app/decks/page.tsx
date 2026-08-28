"use client";

import React, { useState, useEffect, Suspense } from "react";
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
} from "lucide-react";
import { CardDto, DeckCode, DeckDto } from "@/features/tarot/types/tarot.types";
import { tarotService } from "@/features/tarot/services/tarotService";

type CategoryFilter = "ALL" | "MAJOR" | "WANDS" | "CUPS" | "SWORDS" | "PENTACLES";

function DecksContent() {
  const searchParams = useSearchParams();
  const [decks, setDecks] = useState<DeckDto[]>([]);
  const [selectedDeckCode, setSelectedDeckCode] = useState<DeckCode>("RIDER_WAITE_CLASSIC");
  const [cards, setCards] = useState<CardDto[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState<CategoryFilter>("ALL");
  const [selectedCard, setSelectedCard] = useState<CardDto | null>(null);

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
    // 1. Lọc theo danh mục
    if (activeCategory === "MAJOR" && card.arcanaType !== "MAJOR" && card.arcanaType !== "MAJOR_ARCANA") return false;
    if (activeCategory === "WANDS") {
      const name = (card.nameEn + " " + card.nameVi).toLowerCase();
      if (!name.includes("wand") && !name.includes("gậy") && !name.includes("bâton")) return false;
    }
    if (activeCategory === "CUPS") {
      const name = (card.nameEn + " " + card.nameVi).toLowerCase();
      if (!name.includes("cup") && !name.includes("cốc") && !name.includes("ly") && !name.includes("coupe")) return false;
    }
    if (activeCategory === "SWORDS") {
      const name = (card.nameEn + " " + card.nameVi).toLowerCase();
      if (!name.includes("sword") && !name.includes("kiếm") && !name.includes("épée")) return false;
    }
    if (activeCategory === "PENTACLES") {
      const name = (card.nameEn + " " + card.nameVi).toLowerCase();
      if (
        !name.includes("pentacle") &&
        !name.includes("disk") &&
        !name.includes("tiền") &&
        !name.includes("đĩa") &&
        !name.includes("xu") &&
        !name.includes("denier")
      )
        return false;
    }

    // 2. Lọc theo từ khóa tìm kiếm
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      const matchNameVi = card.nameVi?.toLowerCase().includes(q);
      const matchNameEn = card.nameEn?.toLowerCase().includes(q);
      const matchKeywords = card.keywords?.toLowerCase().includes(q) || card.keywordsEn?.toLowerCase().includes(q);
      return matchNameVi || matchNameEn || matchKeywords;
    }

    return true;
  });

  const selectedDeck = decks.find((d) => d.code === selectedDeckCode);

  const getElementBadge = (element?: string) => {
    if (!element) return null;
    const el = element.toLowerCase();
    if (el.includes("lửa") || el.includes("fire"))
      return <span className="inline-flex items-center gap-1 text-[10px] text-amber-400 bg-amber-400/15 px-2 py-0.5 rounded-md border border-amber-400/30"><Flame className="w-3 h-3" /> Lửa</span>;
    if (el.includes("nước") || el.includes("water"))
      return <span className="inline-flex items-center gap-1 text-[10px] text-cyan-400 bg-cyan-400/15 px-2 py-0.5 rounded-md border border-cyan-400/30"><Droplets className="w-3 h-3" /> Nước</span>;
    if (el.includes("khí") || el.includes("air"))
      return <span className="inline-flex items-center gap-1 text-[10px] text-sky-300 bg-sky-400/15 px-2 py-0.5 rounded-md border border-sky-400/30"><Wind className="w-3 h-3" /> Khí</span>;
    if (el.includes("đất") || el.includes("earth"))
      return <span className="inline-flex items-center gap-1 text-[10px] text-emerald-400 bg-emerald-400/15 px-2 py-0.5 rounded-md border border-emerald-400/30"><Globe2 className="w-3 h-3" /> Đất</span>;
    return <span className="inline-flex items-center gap-1 text-[10px] text-purple-300 bg-purple-400/15 px-2 py-0.5 rounded-md border border-purple-400/30"><Sparkles className="w-3 h-3" /> {element}</span>;
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

      {/* 🎴 3 BỘ BÀI TAROT TRONG HỆ THỐNG (CLICK ĐỂ XEM 78 LÁ) */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {decks.map((deck) => {
          const isSelected = selectedDeckCode === deck.code;
          return (
            <div
              key={deck.code}
              onClick={() => {
                setSelectedDeckCode(deck.code);
                setActiveCategory("ALL");
                setSearchQuery("");
              }}
              className={`p-5 rounded-3xl border transition-all duration-300 cursor-pointer flex flex-col justify-between ${
                isSelected
                  ? "border-amber-400/80 bg-[#212227] shadow-xl shadow-black/40 scale-[1.02] ring-1 ring-amber-400/30"
                  : "border-[#31333a] bg-[#191a1e] hover:border-[#525560] hover:bg-[#212227]"
              }`}
            >
              <div>
                <div className="flex items-center justify-between gap-1.5 flex-wrap">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-amber-200 bg-amber-400/15 px-2.5 py-1 rounded-md border border-amber-300/30">
                    {deck.code === "RIDER_WAITE_CLASSIC" ? "Kinh Điển" : deck.code === "THOTH_ALEISTER" ? "Huyền Học Hermetic" : "Cổ Điển Pháp"}
                  </span>
                  {isSelected && (
                    <span className="text-[10px] font-bold uppercase tracking-wider text-amber-400 bg-amber-400/20 px-2 py-0.5 rounded-full border border-amber-400/40 flex items-center gap-1">
                      <Sparkles className="w-3 h-3" /> Đang Xem
                    </span>
                  )}
                </div>
                <h3 className="mt-3 text-base font-bold text-zinc-100">
                  {deck.nameVi}
                </h3>
                <p className="text-xs text-zinc-400 italic mb-2">
                  {deck.nameEn}
                </p>
                <p className="text-xs text-zinc-300 leading-relaxed line-clamp-3">
                  {deck.description || deck.descriptionVi || deck.nameVi}
                </p>
              </div>

              <div className="mt-4 pt-3 border-t border-[#31333a] flex items-center justify-between text-xs">
                <span className="text-amber-200/90 font-medium flex items-center gap-1">
                  <span>🎴</span>
                  <span>78 lá bài</span>
                </span>
                <span className={`font-semibold text-xs flex items-center gap-1 transition ${isSelected ? "text-amber-300" : "text-zinc-400 group-hover:text-white"}`}>
                  <span>{isSelected ? "Đang chọn" : "Nhấn để xem"}</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </span>
              </div>
            </div>
          );
        })}
      </div>

      {/* 🔍 THANH TÌM KIẾM & BỘ LỌC DANH MỤC */}
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
          {/* Ô tìm kiếm */}
          <div className="relative w-full sm:w-80">
            <Search className="w-4 h-4 text-zinc-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Tìm theo tên lá bài hoặc từ khóa..."
              className="w-full pl-10 pr-4 py-2 rounded-xl bg-[#191a1e] border border-[#31333a] text-xs sm:text-sm text-zinc-100 placeholder-zinc-500 focus:outline-none focus:border-[#525560] transition"
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

        {/* Nút lọc danh mục */}
        <div className="flex items-center gap-1.5 flex-wrap">
          {[
            { key: "ALL", label: "Tất Cả (78)", icon: <Layers className="w-3.5 h-3.5" /> },
            { key: "MAJOR", label: "22 Ẩn Chính", icon: <Crown className="w-3.5 h-3.5" /> },
            { key: "WANDS", label: "Gậy (Lửa)", icon: <Flame className="w-3.5 h-3.5" /> },
            { key: "CUPS", label: "Cốc (Nước)", icon: <Droplets className="w-3.5 h-3.5" /> },
            { key: "SWORDS", label: "Kiếm (Khí)", icon: <Wind className="w-3.5 h-3.5" /> },
            { key: "PENTACLES", label: "Tiền/Đĩa (Đất)", icon: <Globe2 className="w-3.5 h-3.5" /> },
          ].map((cat) => {
            const isActive = activeCategory === cat.key;
            return (
              <button
                key={cat.key}
                onClick={() => setActiveCategory(cat.key as CategoryFilter)}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition flex items-center gap-1.5 cursor-pointer ${
                  isActive
                    ? "bg-amber-400/20 text-amber-200 border border-amber-300/40 shadow-sm"
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
                <p className="text-[10px] text-zinc-400 italic line-clamp-1">
                  {card.nameEn}
                </p>
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
                  <p className="text-xs text-zinc-400 italic">
                    {selectedCard.nameEn}
                  </p>
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
                      <span>Ý Nghĩa Chiều Xuôi (Upright)</span>
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
                      <span>Ý Nghĩa Chiều Ngược (Reversed)</span>
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
