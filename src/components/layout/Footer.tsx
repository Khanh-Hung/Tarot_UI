import React from "react";
import Link from "next/link";
import { Shield, FileText, Layers } from "lucide-react";

export const Footer: React.FC = () => {
  return (
    <footer className="border-t border-[#26282e] bg-[#141518]/95 backdrop-blur-xl relative z-10 py-10 px-4 sm:px-6 lg:px-8 mt-auto">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start">
          {/* Cột 1: Logo & Giới thiệu (5 cols) */}
          <div className="md:col-span-5 space-y-3">
            <Link href="/" className="inline-flex items-center group select-none">
              <span className="font-sans text-xl font-black tracking-tighter text-zinc-100 transition-all duration-300 group-hover:text-white">
                Nyxoris
              </span>
            </Link>
            <p className="text-xs text-zinc-400 leading-relaxed max-w-sm">
              Nền tảng bốc bài Tarot 3D tương tác và khám phá chiều sâu nội tâm cùng trí tuệ nhân tạo chiêm tinh học. Mang lại góc nhìn sáng suốt, thông điệp chữa lành và định hướng tích cực.
            </p>
          </div>

          {/* Cột 2: Khám Phá Trải Nghiệm (3 cols) */}
          <div className="md:col-span-3 space-y-3">
            <h3 className="text-xs font-bold uppercase tracking-wider text-zinc-300 flex items-center gap-1.5">
              <Layers className="w-3.5 h-3.5 text-amber-400" />
              <span>Khám Phá</span>
            </h3>
            <ul className="space-y-2 text-xs text-zinc-400">
              <li>
                <Link href="/reading" className="hover:text-amber-200 transition-colors inline-flex items-center gap-1.5">
                  <span>Bốc bài</span>
                </Link>
              </li>
              <li>
                <Link href="/decks" className="hover:text-amber-200 transition-colors inline-flex items-center gap-1.5">
                  <span>Thư viện bài</span>
                </Link>
              </li>
              <li>
                <Link href="/history" className="hover:text-amber-200 transition-colors inline-flex items-center gap-1.5">
                  <span>Lịch sử</span>
                </Link>
              </li>
              <li>
                <Link href="/profile" className="hover:text-amber-200 transition-colors inline-flex items-center gap-1.5">
                  <span>Hồ sơ</span>
                </Link>
              </li>
            </ul>
          </div>

          {/* Cột 3: Pháp lý & Hỗ trợ (4 cols) */}
          <div className="md:col-span-4 space-y-3">
            <h3 className="text-xs font-bold uppercase tracking-wider text-zinc-300 flex items-center gap-1.5">
              <Shield className="w-3.5 h-3.5 text-amber-400" />
              <span>Chính Sách & Bảo Mật</span>
            </h3>
            <ul className="space-y-2 text-xs text-zinc-400">
              <li>
                <Link href="/privacy" className="hover:text-amber-200 transition-colors inline-flex items-center gap-1.5">
                  <Shield className="w-3 h-3 text-zinc-500" />
                  <span>Chính sách bảo mật</span>
                </Link>
              </li>
              <li>
                <Link href="/terms" className="hover:text-amber-200 transition-colors inline-flex items-center gap-1.5">
                  <FileText className="w-3 h-3 text-zinc-500" />
                  <span>Điều khoản dịch vụ</span>
                </Link>
              </li>
              <li className="pt-1.5 text-[11px] text-zinc-400">
                <span>Liên hệ: </span>
                <a href="mailto:suzji.mailer@gmail.com" className="text-amber-300 hover:underline">
                  suzji.mailer@gmail.com
                </a>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </footer>
  );
};
