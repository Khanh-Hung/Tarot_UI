"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { Sparkles, ArrowRight, BookOpen, HeartHandshake, Eye, Moon } from "lucide-react";
import { DeckDto } from "@/features/tarot/types/tarot.types";
import { tarotService } from "@/features/tarot/services/tarotService";

export default function HomePage() {
  const [decks, setDecks] = useState<DeckDto[]>([]);

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

  return (
    <div className="flex flex-col items-center">
      {/* 🌙 HERO SECTION */}
      <section className="w-full py-20 sm:py-28 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto text-center flex flex-col items-center">
        {/* Badge */}
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/[0.04] border border-white/15 text-xs sm:text-sm font-medium text-slate-200 shadow-xl backdrop-blur-md mb-8">
          <Moon className="w-4 h-4 text-slate-300" />
          <span>Trí Tuệ Nhân Tạo & Nghệ Thuật Chiêm Tinh Tarot Chữa Lành</span>
        </div>

        {/* Big Title */}
        <h1 className="text-4xl sm:text-6xl  font-extrabold tracking-tight text-white leading-tight">
          Lắng Nghe Thông Điệp <br className="hidden sm:inline" />
          <span className="silver-gradient-text">
            Dưới Ánh Trăng & Trực Giác Của Bạn
          </span>
        </h1>

        {/* Subtitle */}
        <p className="mt-6 text-base sm:text-lg text-slate-300 max-w-2xl leading-relaxed">
          Đặt câu hỏi về tình duyên, sự nghiệp hoặc những nút thắt trong tâm hồn. Bốc 3 lá bài 3D tương tác và nhận bản luận giải chuyên sâu từ Oracle AI Reader.
        </p>

        {/* Call to Actions */}
        <div className="mt-10 flex flex-col sm:flex-row items-center gap-4">
          <Link
            href="/reading"
            className="w-full sm:w-auto px-8 py-3.5 rounded-2xl silver-gradient-btn font-bold text-base flex items-center justify-center gap-2 hover:scale-105 transition duration-300"
          >
            <Sparkles className="w-5 h-5 text-slate-950" />
            <span>Bắt Đầu Bốc Bài Ngay</span>
            <ArrowRight className="w-5 h-5 text-slate-950" />
          </Link>
          <Link
            href="#decks"
            className="w-full sm:w-auto px-6 py-3.5 rounded-2xl bg-white/[0.04] hover:bg-white/[0.08] border border-white/10 text-slate-200 font-medium text-base transition flex items-center justify-center gap-2"
          >
            <BookOpen className="w-5 h-5 text-slate-300" />
            <span>Khám Phá Các Bộ Bài</span>
          </Link>
        </div>
      </section>

      {/* 🌟 3 ĐẶC ĐIỂM NỔI BẬT */}
      <section className="w-full py-12 px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="p-7 rounded-3xl silver-card flex flex-col items-start transition duration-300">
          <div className="w-12 h-12 rounded-2xl bg-white/[0.06] border border-white/15 flex items-center justify-center text-slate-200 mb-4">
            <Eye className="w-6 h-6" />
          </div>
          <h3 className="text-lg  font-bold text-slate-100">Trải Nghiệm 3D Chân Thực</h3>
          <p className="mt-2 text-sm text-slate-400 leading-relaxed">
            Tự tay chạm để xáo bài, rút và lật mở từng lá bài với chuyển động 3D mượt mà kèm hiệu ứng ánh trăng huyền ảo.
          </p>
        </div>

        <div className="p-7 rounded-3xl silver-card flex flex-col items-start transition duration-300">
          <div className="w-12 h-12 rounded-2xl bg-white/[0.06] border border-white/15 flex items-center justify-center text-slate-200 mb-4">
            <Moon className="w-6 h-6" />
          </div>
          <h3 className="text-lg  font-bold text-slate-100">Bộ Não AI Luận Giải 4 Phần</h3>
          <p className="mt-2 text-sm text-slate-400 leading-relaxed">
            Kết hợp ý nghĩa truyền thống, cung hoàng đạo và ngữ cảnh câu hỏi để đưa ra lời khuyên hành động và thông điệp chữa lành.
          </p>
        </div>

        <div className="p-7 rounded-3xl silver-card flex flex-col items-start transition duration-300">
          <div className="w-12 h-12 rounded-2xl bg-white/[0.06] border border-white/15 flex items-center justify-center text-slate-200 mb-4">
            <HeartHandshake className="w-6 h-6" />
          </div>
          <h3 className="text-lg  font-bold text-slate-100">Tâm Sự 1-1 Nối Tiếp</h3>
          <p className="mt-2 text-sm text-slate-400 leading-relaxed">
            Không dừng lại ở 1 lần luận giải, bạn có thể nhắn tin hỏi sâu bất kỳ thắc mắc nào bám sát vào 3 lá bài đang nằm trên bàn.
          </p>
        </div>
      </section>

      {/* 🎴 DANH MỤC BỘ BÀI TAROT */}
      <section id="decks" className="w-full py-16 px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto">
        <div className="text-center mb-10">
          <h2 className="text-2xl sm:text-3xl  font-bold silver-gradient-text">
            Các Bộ Bài Tarot Trong Hệ Thống
          </h2>
          <p className="mt-2 text-sm text-slate-400">
            Tuyển tập các trường phái Tarot kinh điển thế giới đã được nạp dữ liệu đầy đủ
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {decks.map((deck) => (
            <div
              key={deck.code}
              className="p-6 rounded-3xl silver-card flex flex-col justify-between group transition duration-300"
            >
              <div>
                <span className="text-[10px]  font-bold uppercase tracking-wider text-slate-200 bg-white/10 px-2.5 py-1 rounded-md border border-white/15">
                  {deck.styleTag || "Major Arcana"}
                </span>
                <h3 className="mt-3.5 text-base  font-bold text-slate-100 group-hover:text-white transition">
                  {deck.nameVi}
                </h3>
                <p className="text-xs text-slate-400 italic  mb-2">
                  {deck.nameEn}
                </p>
                <p className="text-xs text-slate-300 leading-relaxed line-clamp-3">
                  {deck.descriptionVi || deck.nameVi}
                </p>
              </div>

              <div className="mt-5 pt-3.5 border-t border-white/[0.07] flex items-center justify-between text-xs text-slate-400">
                <span>{deck.totalCards || 22} lá bài</span>
                <Link
                  href={`/reading?deckCode=${deck.code}`}
                  className="text-slate-200 hover:text-white font-semibold flex items-center gap-1 group-hover:translate-x-1 transition"
                >
                  <span>Chọn bài</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}