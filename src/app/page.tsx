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
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#23242a] border border-[#3b3d46] text-xs sm:text-sm font-medium text-zinc-200 shadow-md backdrop-blur-md mb-8">
          <Moon className="w-4 h-4 text-zinc-400" />
          <span>Trí Tuệ Nhân Tạo & Nghệ Thuật Chiêm Tinh Tarot Chữa Lành</span>
        </div>

        {/* Big Title */}
        <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight text-white leading-tight">
          Lắng Nghe Thông Điệp <br className="hidden sm:inline" />
          <span className="silver-gradient-text">
            Dưới Ánh Trăng & Trực Giác Của Bạn
          </span>
        </h1>

        {/* Subtitle */}
        <p className="mt-6 text-base sm:text-lg text-zinc-300 max-w-2xl leading-relaxed">
          Đặt câu hỏi về tình duyên, sự nghiệp hoặc những nút thắt trong tâm hồn. Bốc 3 lá bài 3D tương tác và nhận bản luận giải chuyên sâu từ Oracle AI Reader.
        </p>

        {/* Call to Actions */}
        <div className="mt-10 flex flex-col sm:flex-row items-center gap-4">
          <Link
            href="/reading"
            className="w-full sm:w-auto px-8 py-3.5 rounded-2xl silver-gradient-btn font-bold text-base flex items-center justify-center gap-2 hover:scale-105 transition duration-300 shadow-lg"
          >
            <Sparkles className="w-5 h-5 text-zinc-950" />
            <span>Bắt Đầu Bốc Bài Ngay</span>
            <ArrowRight className="w-5 h-5 text-zinc-950" />
          </Link>
          <Link
            href="/decks"
            className="w-full sm:w-auto px-6 py-3.5 rounded-2xl border border-[#3b3d46] bg-[#23242a] hover:bg-[#2b2c33] hover:border-[#525560] text-zinc-200 hover:text-white font-medium text-base transition flex items-center justify-center gap-2"
          >
            <BookOpen className="w-5 h-5 text-zinc-300" />
            <span>Thư Viện Tra Cứu 78 Lá</span>
          </Link>
        </div>
      </section>

      {/* 🌟 3 ĐẶC ĐIỂM NỔI BẬT */}
      <section className="w-full py-12 px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="p-7 rounded-3xl border border-[#31333a] bg-[#191a1e] hover:border-[#525560] hover:bg-[#212227] flex flex-col items-start transition duration-300 shadow-md">
          <div className="w-12 h-12 rounded-2xl bg-[#23242a] border border-[#3b3d46] flex items-center justify-center text-zinc-200 mb-4">
            <Eye className="w-6 h-6" />
          </div>
          <h3 className="text-lg font-bold text-zinc-100">Trải Nghiệm 3D Chân Thực</h3>
          <p className="mt-2 text-sm text-zinc-400 leading-relaxed">
            Tự tay chạm để xáo bài, rút và lật mở từng lá bài với chuyển động 3D mượt mà kèm hiệu ứng ánh trăng huyền ảo.
          </p>
        </div>

        <div className="p-7 rounded-3xl border border-[#31333a] bg-[#191a1e] hover:border-[#525560] hover:bg-[#212227] flex flex-col items-start transition duration-300 shadow-md">
          <div className="w-12 h-12 rounded-2xl bg-[#23242a] border border-[#3b3d46] flex items-center justify-center text-zinc-200 mb-4">
            <Moon className="w-6 h-6" />
          </div>
          <h3 className="text-lg font-bold text-zinc-100">Bộ Não AI Luận Giải 4 Phần</h3>
          <p className="mt-2 text-sm text-zinc-400 leading-relaxed">
            Kết hợp ý nghĩa truyền thống, cung hoàng đạo và ngữ cảnh câu hỏi để đưa ra lời khuyên hành động và thông điệp chữa lành.
          </p>
        </div>

        <div className="p-7 rounded-3xl border border-[#31333a] bg-[#191a1e] hover:border-[#525560] hover:bg-[#212227] flex flex-col items-start transition duration-300 shadow-md">
          <div className="w-12 h-12 rounded-2xl bg-[#23242a] border border-[#3b3d46] flex items-center justify-center text-zinc-200 mb-4">
            <HeartHandshake className="w-6 h-6" />
          </div>
          <h3 className="text-lg font-bold text-zinc-100">Tâm Sự 1-1 Nối Tiếp</h3>
          <p className="mt-2 text-sm text-zinc-400 leading-relaxed">
            Không dừng lại ở 1 lần luận giải, bạn có thể nhắn tin hỏi sâu bất kỳ thắc mắc nào bám sát vào 3 lá bài đang nằm trên bàn.
          </p>
        </div>
      </section>

      {/* 🎴 DANH MỤC BỘ BÀI TAROT */}
      <section id="decks" className="w-full py-16 px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto">
        <div className="text-center mb-10">
          <h2 className="text-2xl sm:text-3xl font-bold text-zinc-100">
            Các Bộ Bài Tarot Trong Hệ Thống
          </h2>
          <p className="mt-2 text-sm text-zinc-400">
            Tuyển tập các trường phái Tarot kinh điển thế giới đã được nạp dữ liệu đầy đủ
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {decks.map((deck) => (
            <div
              key={deck.code}
              className="group relative overflow-hidden p-5 sm:p-6 rounded-3xl border border-[#2c2e35] bg-[#191a1e] hover:border-[#42454e] hover:bg-[#1e1f24] hover:shadow-2xl hover:shadow-black/60 flex flex-col justify-between transition-all duration-300 select-none"
            >
              {/* Ambient Background Glow */}
              {deck.coverImageUrl && (
                <div className="absolute -right-6 -bottom-6 w-36 h-48 opacity-[0.06] pointer-events-none overflow-hidden rounded-2xl rotate-12 blur-sm">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={deck.coverImageUrl} alt="" className="w-full h-full object-cover" />
                </div>
              )}

              {/* Top Row: Badges */}
              <div className="relative z-10 flex items-center justify-between gap-2">
                <span className="rounded-full bg-white/[0.06] backdrop-blur-md px-3 py-1 text-[11px] font-semibold text-zinc-200 border border-white/10 flex items-center gap-1.5 shadow-sm">
                  <span>{deck.code === "RIDER_WAITE_CLASSIC" ? "🏛️" : deck.code === "THOTH_ALEISTER" ? "🔮" : "⚜️"}</span>
                  <span>{deck.code === "RIDER_WAITE_CLASSIC" ? "Kinh Điển 1909" : deck.code === "THOTH_ALEISTER" ? "Huyền Học Thelema" : "Cổ Điển Pháp 1760"}</span>
                </span>
                <span className="text-[10px] font-semibold text-zinc-300 bg-[#23242a] px-2.5 py-1 rounded-full border border-[#3b3d46]">
                  78 Lá Bài
                </span>
              </div>

              {/* Center Row: Cover Artwork + Text */}
              <div className="relative z-10 my-4 flex gap-4 items-center">
                {deck.coverImageUrl && (
                  <div className="w-16 sm:w-20 aspect-[1/1.65] shrink-0 rounded-xl overflow-hidden bg-black/60 border border-white/15 shadow-xl group-hover:scale-105 group-hover:border-amber-300/40 transition-all duration-300">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={deck.coverImageUrl}
                      alt={deck.nameVi}
                      className="w-full h-full object-cover"
                    />
                  </div>
                )}
                <div className="min-w-0 flex-1 space-y-1">
                  <h3 className="text-base sm:text-lg font-bold text-zinc-100 group-hover:text-amber-200 transition leading-snug">
                    {deck.nameVi}
                  </h3>
                  <p className="text-[11px] sm:text-xs text-zinc-300 leading-relaxed line-clamp-3">
                    {deck.description || deck.descriptionVi || deck.nameVi}
                  </p>
                </div>
              </div>

              {/* Bottom Row: Actions */}
              <div className="relative z-10 mt-2 pt-4 border-t border-white/[0.08] space-y-2.5">
                <div className="text-[11px] text-zinc-400 font-medium flex items-center gap-1.5">
                  <span>🎴</span>
                  <span>22 Ẩn Chính + 56 Ẩn Phụ Chuẩn Quốc Tế</span>
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <Link
                    href={`/decks?deckCode=${deck.code}`}
                    className="px-3 py-2 rounded-xl border border-[#3b3d46] bg-[#23242a] hover:bg-[#2b2c33] hover:border-[#525560] text-zinc-200 hover:text-white font-semibold text-xs text-center transition flex items-center justify-center gap-1 group-hover:border-amber-300/30"
                  >
                    <span>Xem 78 lá bài</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                  <Link
                    href={`/reading?deckCode=${deck.code}`}
                    className="px-3 py-2 rounded-xl silver-gradient-btn font-bold text-xs text-center transition flex items-center justify-center gap-1 shadow-md hover:scale-[1.02]"
                  >
                    <Sparkles className="w-3.5 h-3.5 text-zinc-950" />
                    <span>Bốc quẻ ngay</span>
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}