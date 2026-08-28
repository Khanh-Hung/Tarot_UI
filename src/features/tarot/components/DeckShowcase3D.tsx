"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import {
  Sparkles,
  ArrowRight,
  BookOpen,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { DeckDto } from "@/features/tarot/types/tarot.types";

interface DeckHeroData {
  code: string;
  nameVi: string;
  nameEn: string;
  schoolBadge: string;
  authorYear: string;
  description: string;
  highlightTag: string;
  cardsPreview: { src: string; name: string }[];
  gradientTheme: string;
  haloColor: string;
  accentBorder: string;
  buttonGradient: string;
}

const DECK_HERO_CONFIG: Record<string, DeckHeroData> = {
  RIDER_WAITE_CLASSIC: {
    code: "RIDER_WAITE_CLASSIC",
    nameVi: "Rider-Waite Classic",
    nameEn: "Rider-Waite-Smith 1909",
    schoolBadge: "🏛️ Kinh Điển 1909 • Trường Phái Golden Dawn",
    authorYear: "Arthur Edward Waite & Pamela Colman Smith (London, 1909)",
    description:
      "Bộ bài chuẩn mực quốc tế phổ biến nhất thế giới. Lần đầu tiên trong lịch sử, toàn bộ 56 lá Ẩn Phụ được minh họa với khung cảnh đời thực sinh động, biểu tượng màu nước trực quan và giàu cảm xúc con người.",
    highlightTag: "Phổ biến nhất thế giới • Phù hợp mọi câu hỏi thực tế",
    cardsPreview: [
      { src: "/cards/rws/m01.jpg", name: "I. The Magician (Pháp Sư)" },
      { src: "/cards/rws/m00.jpg", name: "0. The Fool (Chàng Khờ)" },
      { src: "/cards/rws/m02.jpg", name: "II. The High Priestess (Nữ Tư Tế)" },
    ],
    gradientTheme: "from-amber-500/10 via-orange-500/5 to-transparent",
    haloColor: "rgba(245, 158, 11, 0.12)",
    accentBorder: "border-amber-400/60",
    buttonGradient: "silver-gradient-btn text-zinc-950",
  },
  THOTH_ALEISTER: {
    code: "THOTH_ALEISTER",
    nameVi: "Thoth Tarot",
    nameEn: "Aleister Crowley Thoth Tarot",
    schoolBadge: "🔮 Huyền Học Thelema 1944 • Chiêm Tinh & Giả Kim Thuật",
    authorYear: "Aleister Crowley & Lady Frieda Harris (Anh Quốc, 1938–1944)",
    description:
      "Kiệt tác huyền học bậc nhất lịch sử. Kết hợp sâu sắc giữa triết lý Thelema, Cây Sự Sống Kabbalah và tranh sơn dầu Art Deco đa chiều, tái hiện nguồn năng lượng quang phổ và chiều sâu tiềm thức vô hạn.",
    highlightTag: "Huyền bí & Trừu tượng • Thiền định & chuyển hóa nội tâm",
    cardsPreview: [
      { src: "/cards/thoth/m01.jpg", name: "I. The Magus" },
      { src: "/cards/thoth/m00.jpg", name: "0. The Fool" },
      { src: "/cards/thoth/m02.jpg", name: "II. The Priestess" },
    ],
    gradientTheme: "from-purple-600/10 via-indigo-600/5 to-transparent",
    haloColor: "rgba(168, 85, 247, 0.12)",
    accentBorder: "border-purple-400/60",
    buttonGradient: "silver-gradient-btn text-zinc-950",
  },
  MARSEILLE_HERMETIC: {
    code: "MARSEILLE_HERMETIC",
    nameVi: "Tarot de Marseille",
    nameEn: "Nicolas Conver 1760 (CBD Restoration)",
    schoolBadge: "⚜️ Cổ Điển Pháp 1760 • Tranh Khắc Gỗ Phục Hưng",
    authorYear: "Nicolas Conver (Marseille, Pháp 1760 / Phục chế Dr. Yoav Ben-Dov)",
    description:
      "Cội nguồn lâu đời nhất của Tarot hiện đại châu Âu thế kỷ XVII - XVIII. Phong cách tranh in mộc bản khắc gỗ Trung Cổ mộc mạc với hệ màu nguyên bản, mang đến góc nhìn thông tuệ khách quan và logic biểu tượng thuần khiết.",
    highlightTag: "Cổ xưa & Nguyên bản • Trực giác số học & Hình học thiêng",
    cardsPreview: [
      { src: "/cards/marseille/m01.jpg", name: "I. Le Bateleur (Ảo Thuật Gia)" },
      { src: "/cards/marseille/m00.jpg", name: "Le Mat (Kẻ Lang Thang / The Fool)" },
      { src: "/cards/marseille/m02.jpg", name: "II. La Papesse (Nữ Giáo Hoàng)" },
    ],
    gradientTheme: "from-sky-500/10 via-blue-600/5 to-transparent",
    haloColor: "rgba(56, 189, 248, 0.12)",
    accentBorder: "border-sky-400/60",
    buttonGradient: "silver-gradient-btn text-zinc-950",
  },
};

interface DeckShowcase3DProps {
  decks: DeckDto[];
}

export function DeckShowcase3D({ decks }: DeckShowcase3DProps) {
  const [currentSlideIndex, setCurrentSlideIndex] = useState(0);
  const [direction, setDirection] = useState(1);
  const [isHovered, setIsHovered] = useState(false);

  const activeDeck = decks[currentSlideIndex] || decks[0];
  const activeHeroConfig = activeDeck
    ? DECK_HERO_CONFIG[activeDeck.code] || DECK_HERO_CONFIG.RIDER_WAITE_CLASSIC
    : DECK_HERO_CONFIG.RIDER_WAITE_CLASSIC;

  const nextSlide = () => {
    if (decks.length === 0) return;
    setDirection(1);
    setCurrentSlideIndex((prev) => (prev + 1) % decks.length);
  };

  const prevSlide = () => {
    if (decks.length === 0) return;
    setDirection(-1);
    setCurrentSlideIndex((prev) => (prev - 1 + decks.length) % decks.length);
  };

  const slideVariants = {
    enter: (dir: number) => ({
      x: dir > 0 ? "40%" : "-40%",
      opacity: 0,
      scale: 0.96,
    }),
    center: {
      x: 0,
      opacity: 1,
      scale: 1,
      transition: {
        x: { type: "spring" as const, stiffness: 240, damping: 26 },
        opacity: { duration: 0.35 },
        scale: { duration: 0.35 },
      },
    },
    exit: (dir: number) => ({
      x: dir > 0 ? "-40%" : "40%",
      opacity: 0,
      scale: 0.96,
      transition: {
        x: { type: "spring" as const, stiffness: 240, damping: 26 },
        opacity: { duration: 0.25 },
        scale: { duration: 0.25 },
      },
    }),
  };

  return (
    <section
      id="decks"
      className="w-full py-16 px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto space-y-6"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Header Controls */}
      <div className="flex flex-col sm:flex-row items-start sm:items-end justify-between gap-4">
        <div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-white">
            Thư Viện Bộ Bài Tarot Kinh Điển
          </h2>
          <p className="mt-1 text-xs sm:text-sm text-zinc-400">
            Khám phá các trường phái Tarot chuẩn quốc tế với đầy đủ các lá bài nguyên bản và triết lý luận giải chuyên sâu
          </p>
        </div>

        {/* CỤM ĐIỀU HƯỚNG & CHẤM CHỈ SỐ BẠC ÁNH TRĂNG GÓC TRÊN */}
        <div className="flex items-center gap-2.5 self-end sm:self-auto bg-[#191a1e] border border-[#31333a] p-1.5 rounded-2xl shadow-lg select-none">
          {/* Nút Slide Trước */}
          <button
            onClick={prevSlide}
            aria-label="Slide trước"
            className="w-8 h-8 rounded-xl bg-white/[0.04] hover:bg-white/[0.1] hover:text-white text-zinc-400 flex items-center justify-center transition active:scale-90 cursor-pointer"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>

          {/* 3 Chấm Đèn Bạc Ánh Trăng Tinh Tế Kèm Tiến Trình Chạy 6s (Đóng băng chính xác khi Hover) */}
          <div className="flex items-center gap-1.5 px-2">
            {decks.map((deck, idx) => {
              const isActive = idx === currentSlideIndex;
              return (
                <button
                  key={deck.code}
                  onClick={() => {
                    setDirection(idx > currentSlideIndex ? 1 : -1);
                    setCurrentSlideIndex(idx);
                  }}
                  title={`${deck.nameVi} (Bấm để xem)`}
                  className={`relative h-2 rounded-full overflow-hidden transition-all duration-400 cursor-pointer ${
                    isActive
                      ? "w-8 bg-white/20 ring-1 ring-white/30"
                      : "w-2 bg-white/20 hover:bg-white/40"
                  }`}
                >
                  {/* Vạch tiến trình ánh trăng lấp đầy sống động trong 6 giây - Đóng băng & tiếp tục mượt mà */}
                  {isActive && (
                    <div
                      key={currentSlideIndex}
                      onAnimationEnd={() => nextSlide()}
                      style={{
                        animationPlayState: isHovered ? "paused" : "running",
                      }}
                      className="h-full rounded-full bg-gradient-to-r from-white via-zinc-100 to-zinc-300 shadow-[0_0_10px_rgba(255,255,255,0.9)] animate-slide-progress"
                    />
                  )}
                </button>
              );
            })}
          </div>

          {/* Nút Slide Sau */}
          <button
            onClick={nextSlide}
            aria-label="Slide tiếp theo"
            className="w-8 h-8 rounded-xl bg-white/[0.04] hover:bg-white/[0.1] hover:text-white text-zinc-400 flex items-center justify-center transition active:scale-90 cursor-pointer"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* 🌟 3D INTERACTIVE FRAMER MOTION STAGE */}
      {activeDeck && (
        <div className="relative overflow-hidden rounded-3xl border border-white/10 bg-[#141518] shadow-[0_25px_70px_-15px_rgba(0,0,0,0.95)] p-6 sm:p-10 md:p-12 transition-colors duration-700">
          {/* Dynamic Ambient Background Glow */}
          <motion.div
            key={`halo-${activeDeck.code}`}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.8 }}
            className="absolute -top-32 -left-32 w-[450px] h-[450px] rounded-full blur-[120px] pointer-events-none"
            style={{ backgroundColor: activeHeroConfig.haloColor }}
          />

          <motion.div
            key={`halo2-${activeDeck.code}`}
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.2 }}
            transition={{ duration: 1 }}
            className="absolute -bottom-32 -right-32 w-[400px] h-[400px] rounded-full blur-[100px] pointer-events-none"
            style={{ backgroundColor: activeHeroConfig.haloColor }}
          />

          {/* Rotating Sacred Astrology Gear in Background */}
          <div className="absolute right-[-80px] top-1/2 -translate-y-1/2 w-[550px] h-[550px] rounded-full border border-white/[0.03] pointer-events-none flex items-center justify-center">
            <div className="w-[420px] h-[420px] rounded-full border border-dashed border-white/[0.04] animate-spin-slow" />
          </div>

          <AnimatePresence mode="popLayout" custom={direction}>
            <motion.div
              key={activeDeck.code}
              custom={direction}
              variants={slideVariants}
              initial="enter"
              animate="center"
              exit="exit"
              drag="x"
              dragConstraints={{ left: 0, right: 0 }}
              dragElastic={0.15}
              onDragEnd={(e, { offset }) => {
                if (offset.x < -40) nextSlide();
                else if (offset.x > 40) prevSlide();
              }}
              className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center cursor-grab active:cursor-grabbing"
            >
              {/* 🎴 CỘT TRÁI: 3 LÁ BÀI DÀN TRẬN CỰC ĐẸP & MƯỢT MÀ */}
              <div className="lg:col-span-5 flex flex-col items-center justify-center py-4">
                <div className="relative w-72 sm:w-80 h-76 sm:h-84 flex items-center justify-center">
                  {/* Quầng sáng dưới chân bài */}
                  <div className="absolute bottom-0 w-60 h-8 rounded-full bg-black/80 blur-xl pointer-events-none" />

                  {/* Lá 1 (Bên Trái) */}
                  <motion.div
                    whileHover={{ y: -14, scale: 1.08, rotate: 0, zIndex: 40 }}
                    transition={{ type: "spring", stiffness: 350, damping: 25 }}
                    className="absolute -left-2 sm:left-2 w-32 sm:w-36 aspect-[1/1.7] rounded-2xl overflow-hidden shadow-xl border border-white/20 bg-[#16171b] -rotate-10 translate-y-3 opacity-90 hover:opacity-100 hover:border-white/60 hover:shadow-2xl transition-shadow duration-200 z-10 cursor-pointer"
                  >
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={activeHeroConfig.cardsPreview[0].src}
                      alt={activeHeroConfig.cardsPreview[0].name}
                      className="w-full h-full object-cover pointer-events-none"
                    />
                  </motion.div>

                  {/* Lá 2 (Chính Giữa - Tâm Điểm Dát Vàng) */}
                  <motion.div
                    whileHover={{ y: -16, scale: 1.12, zIndex: 50 }}
                    transition={{ type: "spring", stiffness: 350, damping: 25 }}
                    className={`absolute w-36 sm:w-40 aspect-[1/1.7] rounded-2xl overflow-hidden shadow-[0_20px_50px_rgba(0,0,0,0.95),0_0_30px_rgba(251,191,36,0.3)] border-2 ${activeHeroConfig.accentBorder} bg-[#16171b] scale-105 -translate-y-1 hover:border-amber-300 ring-2 ring-white/10 z-30 cursor-pointer`}
                  >
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={activeHeroConfig.cardsPreview[1].src}
                      alt={activeHeroConfig.cardsPreview[1].name}
                      className="w-full h-full object-cover pointer-events-none"
                    />
                    {/* Shimmer Sheen Beam */}
                    <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/15 to-transparent opacity-40 pointer-events-none" />
                  </motion.div>

                  {/* Lá 3 (Bên Phải) */}
                  <motion.div
                    whileHover={{ y: -14, scale: 1.08, rotate: 0, zIndex: 40 }}
                    transition={{ type: "spring", stiffness: 350, damping: 25 }}
                    className="absolute -right-2 sm:right-2 w-32 sm:w-36 aspect-[1/1.7] rounded-2xl overflow-hidden shadow-xl border border-white/20 bg-[#16171b] rotate-10 translate-y-3 opacity-90 hover:opacity-100 hover:border-white/60 hover:shadow-2xl transition-shadow duration-200 z-10 cursor-pointer"
                  >
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={activeHeroConfig.cardsPreview[2].src}
                      alt={activeHeroConfig.cardsPreview[2].name}
                      className="w-full h-full object-cover pointer-events-none"
                    />
                  </motion.div>
                </div>

                {/* Tên 3 lá bài thu nhỏ thanh lịch */}
                <div className="flex items-center gap-2 mt-4 text-[11px] text-zinc-400 font-medium">
                  <span className="text-zinc-300">{activeHeroConfig.cardsPreview[0].name.split("(")[0].trim()}</span>
                  <span className="text-amber-400">•</span>
                  <span className="text-amber-200 font-bold">{activeHeroConfig.cardsPreview[1].name.split("(")[0].trim()}</span>
                  <span className="text-amber-400">•</span>
                  <span className="text-zinc-300">{activeHeroConfig.cardsPreview[2].name.split("(")[0].trim()}</span>
                </div>
              </div>

              {/* 📖 CỘT PHẢI: NỘI DUNG HOÀNG GIA */}
              <div className="lg:col-span-7 space-y-5">
                {/* School Badge */}
                <div className="flex items-center gap-2.5 flex-wrap">
                  <span className="rounded-full bg-[#23242a] px-3.5 py-1.5 text-xs font-semibold text-zinc-200 border border-[#3b3d46] shadow-md flex items-center gap-1.5 backdrop-blur-md">
                    <span>{activeHeroConfig.schoolBadge}</span>
                  </span>
                  <span className="rounded-full bg-white/[0.04] px-3 py-1 text-[11px] font-medium text-zinc-400 border border-white/10">
                    {activeHeroConfig.highlightTag}
                  </span>
                </div>

                {/* Title */}
                <div>
                  <h3 className="text-3xl sm:text-4xl font-extrabold tracking-tight bg-gradient-to-r from-white via-zinc-100 to-zinc-400 bg-clip-text text-transparent">
                    {activeHeroConfig.nameVi}
                  </h3>
                  <div className="text-xs sm:text-sm text-zinc-400 font-medium mt-1 flex items-center gap-2">
                    <span>✍️</span>
                    <span>{activeHeroConfig.authorYear}</span>
                  </div>
                </div>

                {/* Description */}
                <p className="text-xs sm:text-sm text-zinc-300 leading-relaxed bg-[#191a1e]/80 p-4 rounded-2xl border border-[#31333a] shadow-inner">
                  {activeHeroConfig.description}
                </p>

                {/* Action CTAs */}
                <div className="flex flex-col sm:flex-row items-center gap-3 pt-2">
                  <Link
                    href={`/reading?deckCode=${activeDeck.code}`}
                    className="w-full sm:w-auto px-7 py-3.5 rounded-2xl silver-gradient-btn font-extrabold text-xs sm:text-sm text-zinc-950 flex items-center justify-center gap-2 hover:scale-105 transition duration-300 shadow-xl active:scale-95 cursor-pointer"
                  >
                    <Sparkles className="w-4 h-4 text-zinc-950" />
                    <span>Bốc Quẻ Ngay Với Bộ Này</span>
                    <ArrowRight className="w-4 h-4 text-zinc-950" />
                  </Link>

                  <Link
                    href={`/decks?deckCode=${activeDeck.code}`}
                    className="w-full sm:w-auto px-6 py-3.5 rounded-2xl border border-[#3b3d46] bg-[#23242a] hover:bg-[#2b2c33] hover:border-[#525560] text-zinc-200 hover:text-white font-semibold text-xs sm:text-sm flex items-center justify-center gap-2 transition duration-200 cursor-pointer"
                  >
                    <BookOpen className="w-4 h-4 text-zinc-300" />
                    <span>Khám Phá Thư Viện Bài</span>
                  </Link>
                </div>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>
      )}
    </section>
  );
}
