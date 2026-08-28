"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import {
  Sparkles,
  ArrowRight,
  BookOpen,
  Eye,
  Moon,
  HeartHandshake,
} from "lucide-react";
import { DeckDto } from "@/features/tarot/types/tarot.types";
import { tarotService } from "@/features/tarot/services/tarotService";
import { DeckShowcase3D } from "@/features/tarot/components/DeckShowcase3D";

const FLOATING_CARD_PAIRS = [
  {
    id: "magician-world",
    left: { src: "/cards/rws/m01.jpg", name: "I. The Magician", halo: "rgba(251, 191, 36, 0.25)" },
    right: { src: "/cards/rws/m21.jpg", name: "XXI. The World", halo: "rgba(168, 85, 247, 0.25)" },
    tag: "Ý Chí Kiến Tạo & Sự Viên Mãn",
  },
  {
    id: "sun-moon",
    left: { src: "/cards/rws/m19.jpg", name: "XIX. The Sun", halo: "rgba(245, 158, 11, 0.25)" },
    right: { src: "/cards/rws/m18.jpg", name: "XVIII. The Moon", halo: "rgba(56, 189, 248, 0.25)" },
    tag: "Âm Dương Nhật Nguyệt",
  },
  {
    id: "priestess-empress",
    left: { src: "/cards/rws/m02.jpg", name: "II. The High Priestess", halo: "rgba(99, 102, 241, 0.25)" },
    right: { src: "/cards/rws/m03.jpg", name: "III. The Empress", halo: "rgba(236, 72, 153, 0.25)" },
    tag: "Trực Giác & Tình Yêu Thuần Khiết",
  },
  {
    id: "star-wheel",
    left: { src: "/cards/rws/m17.jpg", name: "XVII. The Star", halo: "rgba(56, 189, 248, 0.25)" },
    right: { src: "/cards/rws/m10.jpg", name: "X. Wheel of Fortune", halo: "rgba(234, 179, 8, 0.25)" },
    tag: "Ánh Sao Hy Vọng & Vận Mệnh",
  },
];

export default function HomePage() {
  const [decks, setDecks] = useState<DeckDto[]>([]);
  const [currentPairIndex, setCurrentPairIndex] = useState(0);

  useEffect(() => {
    async function loadDecks() {
      try {
        const data = await tarotService.getDecks();
        setDecks(data);
      } catch (err) {
        console.error("Failed to load decks:", err);
      }
    }
    loadDecks();
  }, []);

  // Tự động xoay lật đổi cặp bài sau mỗi 8 giây
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentPairIndex((prev) => (prev + 1) % FLOATING_CARD_PAIRS.length);
    }, 8000);
    return () => clearInterval(timer);
  }, []);

  const activePair = FLOATING_CARD_PAIRS[currentPairIndex];

  return (
    <div className="flex flex-col items-center">
      {/* 🌙 CELESTIAL MOONLIT ORACLE HERO SECTION */}
      <section className="relative w-full pt-20 pb-16 sm:pt-28 sm:pb-24 px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto text-center flex flex-col items-center overflow-hidden">
        {/* Vầng hào quang ánh trăng sâu thẳm */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[650px] sm:w-[850px] h-[380px] bg-gradient-to-b from-white/[0.06] via-indigo-500/[0.03] to-transparent rounded-full blur-[130px] pointer-events-none" />

        {/* Vòng tròn ma pháp chiêm tinh xoay chậm phía sau */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[520px] sm:w-[680px] h-[520px] sm:h-[680px] rounded-full border border-white/[0.03] pointer-events-none flex items-center justify-center">
          <div className="w-[380px] sm:w-[480px] h-[380px] sm:h-[480px] rounded-full border border-dashed border-white/[0.04] animate-spin-slow" />
        </div>

        {/* Các hạt sao lấp lánh (Twinkling Constellation Stars) */}
        <div className="absolute top-16 left-1/4 w-1.5 h-1.5 rounded-full bg-white animate-twinkle pointer-events-none shadow-[0_0_8px_white]" />
        <div className="absolute top-28 right-1/4 w-1.5 h-1.5 rounded-full bg-amber-200 animate-twinkle pointer-events-none shadow-[0_0_8px_rgba(251,191,36,0.8)] [animation-delay:1.5s]" />
        <div className="absolute bottom-20 left-1/6 w-1 h-1 rounded-full bg-sky-200 animate-twinkle pointer-events-none shadow-[0_0_6px_cyan] [animation-delay:2.5s]" />
        <div className="absolute bottom-24 right-1/5 w-1 h-1 rounded-full bg-purple-200 animate-twinkle pointer-events-none shadow-[0_0_6px_purple] [animation-delay:0.8s]" />

        {/* 🎴 LÁ BÀI TRÁI BAY BỒNG BỀNH & TỰ ĐỔI 3D */}
        <div className="hidden lg:block absolute left-2 xl:left-8 top-16 z-0 select-none">
          <div className="animate-float-slow">
            <AnimatePresence mode="wait">
              <motion.div
                key={activePair.left.src}
                initial={{ opacity: 0, rotateY: 90, scale: 0.85 }}
                animate={{ opacity: 1, rotateY: 0, scale: 1 }}
                exit={{ opacity: 0, rotateY: -90, scale: 0.85 }}
                transition={{ duration: 0.75, ease: [0.22, 1, 0.36, 1] }}
                onClick={() => setCurrentPairIndex((prev) => (prev + 1) % FLOATING_CARD_PAIRS.length)}
                title="Bấm để đổi cặp bài tiếp theo"
                className="relative w-32 xl:w-36 aspect-[1/1.7] rounded-2xl overflow-hidden shadow-2xl border border-white/20 bg-[#16171b] cursor-pointer group backdrop-blur-md"
                style={{
                  boxShadow: `0 20px 50px rgba(0,0,0,0.9), 0 0 35px ${activePair.left.halo}`,
                }}
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={activePair.left.src}
                  alt={activePair.left.name}
                  className="w-full h-full object-cover opacity-90 group-hover:opacity-100 group-hover:scale-105 transition duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/15 to-transparent pointer-events-none" />
              </motion.div>
            </AnimatePresence>
          </div>
        </div>

        {/* 🎴 LÁ BÀI PHẢI BAY BỒNG BỀNH & TỰ ĐỔI 3D */}
        <div className="hidden lg:block absolute right-2 xl:right-8 top-16 z-0 select-none">
          <div className="animate-float-reverse">
            <AnimatePresence mode="wait">
              <motion.div
                key={activePair.right.src}
                initial={{ opacity: 0, rotateY: -90, scale: 0.85 }}
                animate={{ opacity: 1, rotateY: 0, scale: 1 }}
                exit={{ opacity: 0, rotateY: 90, scale: 0.85 }}
                transition={{ duration: 0.75, ease: [0.22, 1, 0.36, 1] }}
                onClick={() => setCurrentPairIndex((prev) => (prev + 1) % FLOATING_CARD_PAIRS.length)}
                title="Bấm để đổi cặp bài tiếp theo"
                className="relative w-32 xl:w-36 aspect-[1/1.7] rounded-2xl overflow-hidden shadow-2xl border border-white/20 bg-[#16171b] cursor-pointer group backdrop-blur-md"
                style={{
                  boxShadow: `0 20px 50px rgba(0,0,0,0.9), 0 0 35px ${activePair.right.halo}`,
                }}
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={activePair.right.src}
                  alt={activePair.right.name}
                  className="w-full h-full object-cover opacity-90 group-hover:opacity-100 group-hover:scale-105 transition duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/15 to-transparent pointer-events-none" />
              </motion.div>
            </AnimatePresence>
          </div>
        </div>

        {/* Micro Pill Badge */}
        <div className="relative z-10 inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/[0.04] border border-white/12 text-xs font-medium text-zinc-200 shadow-[0_0_20px_rgba(255,255,255,0.04)] backdrop-blur-xl mb-6 hover:border-white/25 transition-all">
          <Moon className="w-3.5 h-3.5 text-zinc-300" />
          <span>✦ Nyxoris AI & Chiêm Tinh Học Tarot ✦</span>
        </div>

        {/* Tiêu đề ngắn gọn, siêu sắc nét */}
        <h1 className="relative z-10 text-4xl sm:text-6xl md:text-7xl font-extrabold tracking-tight text-white leading-[1.12] max-w-3xl mx-auto">
          Lắng Nghe Tiềm Thức <br />
          <span className="bg-gradient-to-r from-white via-zinc-100 to-zinc-400 bg-clip-text text-transparent drop-shadow-[0_15px_35px_rgba(255,255,255,0.15)]">
            Dưới Ánh Trăng
          </span>
        </h1>

        {/* Lời dẫn tinh tế, súc tích */}
        <p className="relative z-10 mt-5 text-sm sm:text-base text-zinc-300/80 max-w-xl mx-auto leading-relaxed">
          Trải nghiệm bốc bài 3D tương tác với đa dạng trải bài và nhận bản luận giải sâu sắc về tình duyên, sự nghiệp và nội tâm từ Nyxoris AI.
        </p>

        {/* Nút bấm kim loại cao cấp bo tròn chuẩn High-Fashion */}
        <div className="relative z-10 mt-8 flex flex-col sm:flex-row items-center gap-3.5">
          <Link
            href="/reading"
            className="w-full sm:w-auto px-8 py-3.5 rounded-full silver-gradient-btn font-bold text-sm text-zinc-950 flex items-center justify-center gap-2 hover:scale-105 transition-all duration-300 shadow-[0_4px_25px_rgba(255,255,255,0.2)] active:scale-95 cursor-pointer"
          >
            <Sparkles className="w-4 h-4 text-zinc-950 fill-current" />
            <span>Bắt Đầu Bốc Bài Ngay</span>
            <ArrowRight className="w-4 h-4 text-zinc-950" />
          </Link>
          <Link
            href="/decks"
            className="w-full sm:w-auto px-6 py-3.5 rounded-full border border-white/12 bg-white/[0.04] hover:bg-white/[0.09] hover:border-white/25 text-zinc-200 hover:text-white font-medium text-sm transition-all duration-200 flex items-center justify-center gap-2 cursor-pointer shadow-md"
          >
            <BookOpen className="w-4 h-4 text-zinc-300" />
            <span>Thư Viện Bài</span>
          </Link>
        </div>
      </section>

      {/* 🎴 SHOWCASE BANNER TRƯỢT 3D FRAMER MOTION CAO CẤP */}
      <DeckShowcase3D decks={decks} />

      {/* 🌟 3 ĐẶC ĐIỂM NỔI BẬT (NGẮN GỌN & SÚC TÍCH) */}
      <section className="w-full py-12 px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {/* Card 1 */}
          <div className="relative p-6 sm:p-7 rounded-3xl border border-white/10 bg-[#151619] hover:bg-[#1b1c20] hover:border-emerald-400/30 transition-all duration-300 shadow-lg hover:-translate-y-1 overflow-hidden group">
            <div className="absolute -top-12 -right-12 w-28 h-28 rounded-full bg-emerald-500/10 blur-2xl pointer-events-none group-hover:bg-emerald-500/20 transition duration-500" />

            <div className="w-11 h-11 rounded-2xl bg-white/[0.04] border border-white/10 flex items-center justify-center text-emerald-300 mb-5 group-hover:scale-110 transition duration-300">
              <Eye className="w-5 h-5" />
            </div>

            <h3 className="text-lg font-bold text-white tracking-tight group-hover:text-emerald-200 transition duration-200">
              Chạm & Bốc Bài 3D
            </h3>
            <p className="mt-2 text-sm text-zinc-400 leading-relaxed">
              Đa dạng trải bài, tự tay xáo và lật mở từng lá bài 3D trực quan theo trực giác của bạn.
            </p>
          </div>

          {/* Card 2 */}
          <div className="relative p-6 sm:p-7 rounded-3xl border border-white/10 bg-[#151619] hover:bg-[#1b1c20] hover:border-purple-400/30 transition-all duration-300 shadow-lg hover:-translate-y-1 overflow-hidden group">
            <div className="absolute -top-12 -right-12 w-28 h-28 rounded-full bg-purple-500/10 blur-2xl pointer-events-none group-hover:bg-purple-500/20 transition duration-500" />

            <div className="w-11 h-11 rounded-2xl bg-white/[0.04] border border-white/10 flex items-center justify-center text-purple-300 mb-5 group-hover:scale-110 transition duration-300">
              <Moon className="w-5 h-5" />
            </div>

            <h3 className="text-lg font-bold text-white tracking-tight group-hover:text-purple-200 transition duration-200">
              Luận Giải & Chữa Lành
            </h3>
            <p className="mt-2 text-sm text-zinc-400 leading-relaxed">
              Nyxoris AI thấu cảm câu chuyện, gửi trao lời khuyên dịu dàng và định hướng tích cực.
            </p>
          </div>

          {/* Card 3 */}
          <div className="relative p-6 sm:p-7 rounded-3xl border border-white/10 bg-[#151619] hover:bg-[#1b1c20] hover:border-amber-400/30 transition-all duration-300 shadow-lg hover:-translate-y-1 overflow-hidden group">
            <div className="absolute -top-12 -right-12 w-28 h-28 rounded-full bg-amber-500/10 blur-2xl pointer-events-none group-hover:bg-amber-500/20 transition duration-500" />

            <div className="w-11 h-11 rounded-2xl bg-white/[0.04] border border-white/10 flex items-center justify-center text-amber-300 mb-5 group-hover:scale-110 transition duration-300">
              <HeartHandshake className="w-5 h-5" />
            </div>

            <h3 className="text-lg font-bold text-white tracking-tight group-hover:text-amber-200 transition duration-200">
              Tâm Sự 1-1 Nối Tiếp
            </h3>
            <p className="mt-2 text-sm text-zinc-400 leading-relaxed">
              Thoải mái hỏi sâu và trò chuyện cùng Nyxoris AI để gỡ rối mọi băn khoăn.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}