import React from "react";

export function Skeleton({
  className = "",
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={`animate-pulse rounded-xl bg-white/[0.04] border border-white/[0.05] ${className}`}
      {...props}
    />
  );
}

// 🌟 SKELETON CHO BẢN ĐỒ NĂNG LƯỢNG
export function EnergyInsightsSkeleton() {
  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      {/* Thẻ Hero Năng lượng chủ đạo */}
      <div className="rounded-2xl border border-amber-400/20 bg-[#1e2025]/60 p-6 sm:p-8 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <Skeleton className="w-44 h-6 rounded-full bg-amber-400/10 border-amber-400/20" />
          <Skeleton className="w-40 h-4 rounded-md" />
        </div>
        <Skeleton className="w-40 h-8 rounded-lg" />
        <div className="space-y-2 max-w-2xl">
          <Skeleton className="w-full h-4 rounded-md" />
          <Skeleton className="w-5/6 h-4 rounded-md" />
        </div>
      </div>

      {/* Lưới 4 Nguyên Tố (2x2) */}
      <div className="rounded-2xl border border-[#31333a] bg-[#191a1e] p-6 sm:p-7 space-y-5">
        <div className="flex items-center justify-between">
          <Skeleton className="w-44 h-6 rounded-lg" />
          <Skeleton className="w-32 h-4 rounded-md" />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="p-4 rounded-xl border border-white/[0.06] bg-black/20 space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <Skeleton className="w-8 h-8 rounded-lg" />
                  <div className="space-y-1.5">
                    <Skeleton className="w-20 h-4 rounded-md" />
                    <Skeleton className="w-32 h-3 rounded-md" />
                  </div>
                </div>
                <div className="space-y-1 text-right">
                  <Skeleton className="w-12 h-5 rounded-md" />
                  <Skeleton className="w-8 h-3 rounded-md" />
                </div>
              </div>
              <Skeleton className="w-full h-2 rounded-full" />
            </div>
          ))}
        </div>
      </div>

      {/* Thẻ bài gắn liền (Top cards) */}
      <div className="rounded-2xl border border-[#31333a] bg-[#191a1e] p-6 sm:p-7 space-y-5">
        <Skeleton className="w-56 h-6 rounded-lg" />
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="rounded-xl border border-white/[0.06] bg-[#22242a] p-4 flex gap-3">
              <Skeleton className="w-14 h-22 rounded-lg shrink-0" />
              <div className="flex-1 space-y-2 py-1">
                <div className="flex justify-between">
                  <Skeleton className="w-12 h-4 rounded-md" />
                  <Skeleton className="w-14 h-4 rounded-full" />
                </div>
                <Skeleton className="w-28 h-4 rounded-md" />
                <Skeleton className="w-20 h-3 rounded-md" />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 4 Phương diện cuộc sống */}
      <div className="rounded-2xl border border-[#31333a] bg-[#191a1e] p-6 sm:p-7 space-y-4">
        <Skeleton className="w-64 h-6 rounded-lg" />
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {[1, 2, 3, 4].map((i) => (
            <Skeleton key={i} className="h-20 rounded-xl" />
          ))}
        </div>
      </div>
    </div>
  );
}

// 🌟 SKELETON CHO DANH SÁCH LỊCH SỬ QUẺ BÀI (ĐỒNG NHẤT 1:1 VỚI GIAO DIỆN THỰC TẾ)
export function HistoryListSkeleton() {
  return (
    <div className="space-y-6">
      {/* 🔍 Placeholder Thanh Tìm Kiếm & Dropdown Bộ Lọc */}
      <div className="flex flex-col md:flex-row items-center gap-2.5 pb-2">
        <Skeleton className="h-10 w-full rounded-xl bg-white/[0.04]" />
        <div className="flex items-center gap-2 w-full md:w-auto">
          <Skeleton className="h-10 w-full sm:w-[170px] rounded-xl bg-white/[0.04] shrink-0" />
          <Skeleton className="h-10 w-full sm:w-[190px] rounded-xl bg-white/[0.04] shrink-0" />
        </div>
      </div>

      {/* 📄 Placeholder Danh Sách Liền Mạch Dạng List (divide-y) */}
      <div className="divide-y divide-white/[0.07] border-t border-b border-white/[0.08]">
        {[1, 2, 3, 4, 5, 6].map((i) => (
          <div
            key={i}
            className="py-4 px-2 sm:px-3 flex items-center justify-between gap-4"
          >
            {/* Metadata & Câu hỏi */}
            <div className="min-w-0 flex-1 space-y-2">
              {/* Dòng 1: Icon, Chủ đề & Metadata */}
              <div className="flex items-center gap-2 flex-wrap">
                <Skeleton className="w-4 h-4 rounded-full bg-white/[0.06] shrink-0" />
                <Skeleton className="w-28 sm:w-36 h-3.5 rounded-md bg-white/[0.06]" />
                <span className="text-zinc-700 text-xs">•</span>
                <Skeleton className="w-36 sm:w-48 h-3.5 rounded-md bg-white/[0.04]" />
                <span className="text-zinc-700 text-xs hidden sm:inline">•</span>
                <Skeleton className="w-20 h-3.5 rounded-md bg-white/[0.03] hidden sm:inline" />
              </div>

              {/* Dòng 2: Tiêu đề câu hỏi người dùng */}
              <Skeleton
                className={`h-4.5 sm:h-5 rounded-md bg-white/[0.06] ${
                  i % 3 === 0
                    ? "w-4/5 sm:w-3/5"
                    : i % 2 === 0
                    ? "w-3/4 sm:w-1/2"
                    : "w-2/3 sm:w-2/5"
                }`}
              />
            </div>

            {/* Mũi tên góc phải */}
            <div className="shrink-0 flex items-center pl-2">
              <Skeleton className="w-4 h-4 rounded-full bg-white/[0.04]" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// 🌟 SKELETON CHO TRANG CHI TIẾT QUẺ BÀI
export function ReadingDetailSkeleton() {
  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10">
      {/* Nút quay lại */}
      <Skeleton className="w-36 h-5 rounded-md" />

      {/* Header */}
      <div className="text-center max-w-2xl mx-auto space-y-3">
        <Skeleton className="w-48 h-6 rounded-full mx-auto" />
        <Skeleton className="w-3/4 h-8 rounded-lg mx-auto" />
      </div>

      {/* Khung 3 lá bài 3D */}
      <div className="py-8 px-4 rounded-3xl border border-[#31333a] bg-[#191a1e]">
        <div className="flex flex-wrap justify-center items-center gap-6 sm:gap-10">
          {[1, 2, 3].map((i) => (
            <div key={i} className="flex flex-col items-center gap-3">
              <Skeleton className="w-36 sm:w-44 h-56 sm:h-64 rounded-2xl border border-amber-400/20" />
              <Skeleton className="w-24 h-4 rounded-md" />
            </div>
          ))}
        </div>
      </div>

      {/* Bản luận giải AI */}
      <div className="p-6 sm:p-10 rounded-3xl border border-[#31333a] bg-[#191a1e] space-y-4">
        <Skeleton className="w-56 h-6 rounded-lg" />
        <Skeleton className="w-full h-4 rounded-md" />
        <Skeleton className="w-full h-4 rounded-md" />
        <Skeleton className="w-5/6 h-4 rounded-md" />
        <Skeleton className="w-2/3 h-4 rounded-md" />
      </div>

      {/* Khung chat */}
      <div className="p-6 rounded-3xl border border-[#31333a] bg-[#191a1e] space-y-4">
        <Skeleton className="w-48 h-6 rounded-lg" />
        <Skeleton className="w-full h-24 rounded-2xl" />
      </div>
    </div>
  );
}

// 🌟 SKELETON CHO THƯ VIỆN BÀI (78 LÁ)
export function DeckCardsGridSkeleton() {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
      {Array.from({ length: 12 }).map((_, i) => (
        <div key={i} className="space-y-2">
          <Skeleton className="w-full aspect-[2/3] rounded-2xl border border-white/[0.08]" />
          <Skeleton className="w-3/4 h-4 rounded-md mx-auto" />
          <Skeleton className="w-1/2 h-3 rounded-md mx-auto" />
        </div>
      ))}
    </div>
  );
}

// 🌟 SKELETON TOÀN DIỆN CHO TRANG THƯ VIỆN BÀI (DECKS PAGE SUSPENSE)
export function FullDeckPageSkeleton() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10 animate-in fade-in duration-300">
      {/* 3 bộ bài tab selector */}
      <div className="flex justify-center">
        <div className="flex items-center gap-2 p-1.5 rounded-2xl bg-[#1e2025] border border-white/[0.08]">
          <Skeleton className="w-36 h-10 rounded-xl" />
          <Skeleton className="w-36 h-10 rounded-xl" />
          <Skeleton className="w-36 h-10 rounded-xl" />
        </div>
      </div>

      {/* Hero banner */}
      <div className="rounded-3xl border border-amber-400/20 bg-[#1a1b20] p-6 sm:p-10 space-y-4">
        <Skeleton className="w-48 h-8 rounded-lg" />
        <Skeleton className="w-full max-w-xl h-4 rounded-md" />
        <Skeleton className="w-3/4 max-w-md h-4 rounded-md" />
      </div>

      {/* Thanh Search & Bộ lọc pills */}
      <div className="space-y-4">
        <Skeleton className="w-full h-12 rounded-2xl" />
        <div className="flex flex-wrap gap-2">
          {Array.from({ length: 7 }).map((_, i) => (
            <Skeleton key={i} className="w-24 h-9 rounded-xl" />
          ))}
        </div>
      </div>

      {/* Lưới 12 lá bài skeleton */}
      <DeckCardsGridSkeleton />
    </div>
  );
}

// 🌟 SKELETON CHO TRANG HỒ SƠ (PROFILE)
export function ProfileSkeleton() {
  return (
    <div className="min-h-screen py-8 sm:py-12 pb-36 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto space-y-8">
      {/* Header */}
      <div className="border-b border-[#2c2e35] pb-6 flex items-center justify-between">
        <div className="space-y-2">
          <Skeleton className="w-40 h-7 rounded-lg" />
          <Skeleton className="w-64 h-4 rounded-md" />
        </div>
        <Skeleton className="w-24 h-9 rounded-xl" />
      </div>

      {/* Thông tin tài khoản */}
      <div className="rounded-2xl border border-[#31333a] bg-[#191a1e] p-6 space-y-4">
        <Skeleton className="w-36 h-5 rounded-md" />
        <div className="flex items-center gap-4">
          <Skeleton className="w-16 h-16 rounded-full" />
          <div className="space-y-2 flex-1">
            <Skeleton className="w-48 h-5 rounded-md" />
            <Skeleton className="w-32 h-4 rounded-md" />
          </div>
        </div>
      </div>

      {/* Cung hoàng đạo */}
      <div className="rounded-2xl border border-[#31333a] bg-[#191a1e] p-6 space-y-4">
        <Skeleton className="w-44 h-5 rounded-md" />
        <div className="grid grid-cols-3 sm:grid-cols-6 gap-2.5">
          {Array.from({ length: 12 }).map((_, i) => (
            <Skeleton key={i} className="h-14 rounded-xl" />
          ))}
        </div>
      </div>
    </div>
  );
}

// 🌟 SKELETON CHO TRANG BỐC BÀI (READING WIZARD FORM)
export function ReadingFormSkeleton() {
  return (
    <div className="max-w-2xl mx-auto p-6 sm:p-8 rounded-3xl border border-[#31333a] bg-[#191a1e] space-y-6 my-10 animate-in fade-in duration-300">
      <div className="flex items-center justify-between pb-4 border-b border-[#2c2e35]">
        <div className="flex items-center gap-2">
          <Skeleton className="w-7 h-7 rounded-full" />
          <Skeleton className="w-36 h-5 rounded-md" />
        </div>
        <Skeleton className="w-16 h-4 rounded-full" />
      </div>
      <div className="space-y-4">
        <Skeleton className="w-48 h-5 rounded-md" />
        <Skeleton className="w-full h-24 rounded-2xl" />
      </div>
      <div className="space-y-3">
        <Skeleton className="w-36 h-5 rounded-md" />
        <div className="grid grid-cols-2 gap-3">
          <Skeleton className="h-16 rounded-2xl" />
          <Skeleton className="h-16 rounded-2xl" />
        </div>
      </div>
      <Skeleton className="w-full h-12 rounded-2xl" />
    </div>
  );
}

// 🌟 SKELETON TOÀN DIỆN CHO TRANG LỊCH SỬ (FULL HISTORY PAGE)
export function FullHistoryPageSkeleton() {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-14 space-y-8 animate-in fade-in duration-300">
      <div className="space-y-3 pb-2">
        <Skeleton className="w-48 h-7 rounded-lg" />
        <Skeleton className="w-80 h-4 rounded-md" />
      </div>
      <div className="flex items-center gap-8 border-b border-white/[0.08] pb-3.5">
        <Skeleton className="w-32 h-5 rounded-md" />
        <Skeleton className="w-36 h-5 rounded-md" />
      </div>
      <HistoryListSkeleton />
    </div>
  );
}

// 🌟 SKELETON CHO FORM ĐĂNG NHẬP / ĐĂNG KÝ
export function AuthFormSkeleton() {
  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 py-12 animate-in fade-in duration-300">
      <div className="w-full max-w-md p-7 sm:p-8 rounded-3xl bg-[#1a1b1f] border border-white/[0.08] shadow-2xl space-y-6">
        <div className="space-y-2 text-center">
          <Skeleton className="w-32 h-7 mx-auto rounded-lg" />
          <Skeleton className="w-48 h-4 mx-auto rounded-md" />
        </div>
        <div className="space-y-4">
          <Skeleton className="w-full h-12 rounded-xl" />
          <Skeleton className="w-full h-12 rounded-xl" />
          <Skeleton className="w-full h-12 rounded-xl" />
        </div>
        <Skeleton className="w-full h-12 rounded-xl bg-amber-400/20 border-amber-400/30" />
        <Skeleton className="w-44 h-4 mx-auto rounded-md" />
      </div>
    </div>
  );
}