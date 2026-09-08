"use client";

import React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Flame,
  Sparkles,
  Gift,
  Calendar,
  Check,
  ChevronRight,
  Sun,
  ShieldCheck,
  LogIn,
  ArrowLeft,
  Info,
} from "lucide-react";
import { useAuth } from "@/features/auth/hooks/useAuth";
import { useQuota } from "@/features/tarot/hooks/useQuota";
import { MILESTONES, WEEK_DAYS } from "@/features/tarot/constants/streakMilestones";
import { TierMedal } from "@/features/tarot/components/TierMedal";
import { RealisticFlameIcon } from "@/features/tarot/components/RealisticFlameIcon";
import { StreakSkeleton } from "@/components/ui/Skeleton";

export default function StreakPage() {
  const router = useRouter();
  const { user, isAuthenticated, isLoading: isAuthLoading } = useAuth();
  const { quota, isLoading } = useQuota();

  if (isAuthLoading || (isAuthenticated && isLoading)) {
    return <StreakSkeleton />;
  }

  if (!isAuthenticated || !user) {
    return (
      <div className="min-h-screen py-16 px-4 flex flex-col items-center justify-center text-center max-w-md mx-auto">
        <div className="w-16 h-16 rounded-full bg-orange-500/15 border border-orange-500/30 flex items-center justify-center text-orange-400 mb-4 shadow-[0_0_30px_rgba(249,115,22,0.2)]">
          <Flame className="w-8 h-8 fill-orange-400/40" />
        </div>
        <h1 className="text-xl sm:text-2xl font-bold text-white mb-2">
          Chuỗi Đồng Hành & Gắn Kết
        </h1>
        <p className="text-xs sm:text-sm text-zinc-400 mb-6 leading-relaxed">
          Đăng nhập tài khoản để bắt đầu theo dõi chuỗi bốc bài hàng ngày, nhận thêm lượt bốc bài miễn phí và mở khóa các danh hiệu đồng hành độc quyền.
        </p>
        <Link
          href="/login"
          className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl text-xs sm:text-sm font-bold silver-gradient-btn transition shadow-lg text-zinc-950"
        >
          <LogIn className="w-4 h-4" />
          <span>Đăng nhập ngay</span>
        </Link>
      </div>
    );
  }

  const currentStreak = quota?.currentStreak ?? 0;
  const longestStreak = quota?.longestStreak ?? 0;
  const isStreakActiveToday = quota?.isStreakActiveToday ?? false;

  const now = new Date();
  const rawDay = now.getDay();
  const currentDayIndex = rawDay === 0 ? 6 : rawDay - 1;

  const nextMilestone = MILESTONES.find((m) => m.days > currentStreak) || null;
  const daysToNext = nextMilestone ? nextMilestone.days - currentStreak : 0;

  return (
    <div className="min-h-screen py-8 sm:py-12 pb-36 sm:pb-44 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto space-y-7">
      {/* 🌟 Top Navigation Bar */}
      <div className="flex items-center justify-between border-b border-[#2c2e35] pb-5">
        <div className="flex items-center gap-3">
          <button
            onClick={() => router.back()}
            className="p-2 rounded-xl text-zinc-400 hover:text-white bg-[#212227] hover:bg-[#2b2c33] border border-[#31333a] transition cursor-pointer"
            title="Quay lại"
          >
            <ArrowLeft className="w-4 h-4" />
          </button>
          <div>
            <h1 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
              Chuỗi Đồng Hành
            </h1>
            <p className="text-xs text-zinc-400 mt-0.5">
              Duy trì thói quen bốc bài mỗi ngày để tích lũy năng lượng và nhận quà
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Link
            href="/reading"
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold silver-gradient-btn transition shadow-md text-zinc-950"
          >
            <span>Bốc bài ngay</span>
          </Link>
        </div>
      </div>

      {/* 🌟 Giant Flame Showcase Card */}
      <div className="relative rounded-3xl border border-[#2b2d35] bg-[#17181c] p-6 sm:p-8 shadow-2xl overflow-hidden text-center">
        {/* Cosmic Aura Glows */}
        <div className="absolute -top-20 -left-20 w-64 h-64 bg-gradient-to-br from-amber-500/20 via-orange-600/10 to-transparent rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-20 -right-20 w-64 h-64 bg-gradient-to-tl from-purple-500/15 via-amber-500/10 to-transparent rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col items-center">
          {/* Flame Icon with Pulse */}
          <div className="relative mb-3.5">
            <div
              className={`w-24 h-24 rounded-full flex items-center justify-center border transition-all ${
                isStreakActiveToday
                  ? "bg-gradient-to-b from-red-500/25 via-red-600/20 to-orange-600/20 border-red-500/50 shadow-[0_0_35px_rgba(239,68,68,0.4)]"
                  : "bg-zinc-800/60 border-zinc-700/50 shadow-[0_0_25px_rgba(0,0,0,0.2)]"
              }`}
            >
              {isStreakActiveToday ? (
                <RealisticFlameIcon className="w-14 h-14 animate-pulse" />
              ) : (
                <Flame className="w-13 h-13 text-zinc-500 fill-zinc-600/30" />
              )}
            </div>
            {isStreakActiveToday && (
              <div className="absolute -bottom-1 -right-1 bg-emerald-500 text-zinc-950 p-1.5 rounded-full border-2 border-[#17181c] shadow-md">
                <Check className="w-4 h-4 stroke-[3]" />
              </div>
            )}
          </div>

          {/* Main Streak Counter with refined typographic hierarchy */}
          <div className="flex items-baseline justify-center gap-2 mt-1">
            <span className="text-4xl sm:text-5xl font-black tracking-tight text-white">
              {currentStreak}
            </span>
            <span className="text-sm sm:text-base font-semibold text-zinc-400">
              ngày liên tiếp
            </span>
          </div>

          {/* Delicate Status Indicator */}
          <div className="flex items-center justify-center gap-2 mt-2 text-xs">
            {isStreakActiveToday ? (
              <>
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.8)]" />
                <span className="text-zinc-300 font-medium">Đã duy trì hôm nay</span>
                <span className="text-zinc-600">•</span>
                <span className="text-zinc-400">Hẹn gặp bạn ngày mai</span>
              </>
            ) : (
              <>
                <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse" />
                <span className="text-amber-300/90 font-medium">Chưa bốc bài hôm nay</span>
                <span className="text-zinc-600">•</span>
                <span className="text-zinc-400">Rút 1 lá để giữ chuỗi</span>
              </>
            )}
          </div>

          {/* Action Button */}
          <div className="mt-5 w-full max-w-xs">
            {!isStreakActiveToday ? (
              <Link
                href="/reading"
                className="w-full py-3 px-5 rounded-xl font-bold text-xs sm:text-sm bg-gradient-to-r from-red-500 via-orange-500 to-red-500 text-white hover:brightness-110 active:scale-[0.99] transition-all shadow-lg shadow-red-500/20 flex items-center justify-center gap-2"
              >
                <Flame className="w-4 h-4 fill-current" />
                <span>Rút lá bài ngày mới (+1 ngày)</span>
                <ChevronRight className="w-4 h-4" />
              </Link>
            ) : (
              <Link
                href="/reading"
                className="w-full py-3 px-5 rounded-xl font-bold text-xs sm:text-sm bg-[#24262d] hover:bg-[#2c2e36] text-zinc-200 border border-zinc-700/60 active:scale-[0.99] transition-all flex items-center justify-center gap-2"
              >
                <Sparkles className="w-4 h-4 text-amber-400" />
                <span>Khám phá trải bài</span>
                <ChevronRight className="w-4 h-4 text-zinc-400" />
              </Link>
            )}
          </div>
        </div>
      </div>

      {/* 📅 7-Day Week Calendar */}
      <div className="bg-[#191a1e] border border-[#2b2d35] rounded-3xl p-5 sm:p-6 shadow-xl">
        <div className="flex items-center justify-between text-xs font-semibold text-zinc-300 mb-4 px-1">
          <span className="flex items-center gap-1.5">
            <Calendar className="w-4 h-4 text-amber-400" />
            Lịch Điểm Danh Tuần Này
          </span>
          <span className="text-[11px] text-zinc-400">
            {isStreakActiveToday ? "Hôm nay: Đã điểm danh" : "Hôm nay: Chờ bốc bài"}
          </span>
        </div>

        <div className="grid grid-cols-7 gap-2 sm:gap-3 text-center">
          {WEEK_DAYS.map((dayLabel, idx) => {
            const isPast = idx < currentDayIndex;
            const isToday = idx === currentDayIndex;

            let isLit = false;
            if (isPast) {
              // Các ngày đã qua trong tuần: sáng nếu chuỗi ngày liên tiếp đủ dài
              const daysAgo = currentDayIndex - idx;
              const effectiveStreak = isStreakActiveToday ? currentStreak : currentStreak + 1;
              isLit = effectiveStreak > daysAgo;
            } else if (isToday) {
              // Ngày hôm nay: sáng nếu hôm nay đã điểm danh / bốc bài
              isLit = isStreakActiveToday;
            } else {
              // Các ngày trong tương lai: chưa đến, không thể điểm danh trước tương lai
              isLit = false;
            }

            return (
              <div
                key={dayLabel}
                className={`flex flex-col items-center justify-center py-3 px-1 rounded-2xl border transition-all ${
                  isToday
                    ? isLit
                      ? "bg-[#23252d] border-zinc-700 text-zinc-200"
                      : "bg-[#1f2026] border-dashed border-zinc-700 text-zinc-400"
                    : isLit
                    ? "bg-[#202127] border-[#2c2e36] text-zinc-300"
                    : "bg-[#1a1b20]/60 border-[#24252d] text-zinc-600"
                }`}
              >
                <span className="text-[10px] font-bold uppercase tracking-wider mb-2 opacity-80">
                  {dayLabel}
                </span>
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center transition-all ${
                    isLit
                      ? "bg-orange-500/10"
                      : isToday
                      ? "bg-zinc-800 text-zinc-400"
                      : "bg-zinc-800/50 text-zinc-600"
                  }`}
                >
                  {isLit ? (
                    <RealisticFlameIcon className="w-4 h-4" />
                  ) : isToday ? (
                    <Sun className="w-4 h-4 text-zinc-400" />
                  ) : (
                    <span className="w-1.5 h-1.5 rounded-full bg-zinc-700" />
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* 📊 Stats Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3.5">
        <div className="p-4 rounded-2xl bg-[#191a1e] border border-[#2b2d35] flex flex-col shadow-lg">
          <span className="text-[11px] font-medium text-zinc-400">Chuỗi hiện tại</span>
          <div className="flex items-baseline gap-1.5 mt-1.5">
            <span className="text-2xl sm:text-3xl font-black text-amber-400">
              {currentStreak}
            </span>
            <span className="text-xs text-zinc-400 font-medium">ngày</span>
          </div>
          <span className="text-[10px] text-zinc-500 mt-1">
            {isStreakActiveToday ? "Đang duy trì hôm nay" : "Cần bốc bài để giữ chuỗi"}
          </span>
        </div>

        <div className="p-4 rounded-2xl bg-[#191a1e] border border-[#2b2d35] flex flex-col shadow-lg">
          <span className="text-[11px] font-medium text-zinc-400">Kỷ lục cao nhất</span>
          <div className="flex items-baseline gap-1.5 mt-1.5">
            <span className="text-2xl sm:text-3xl font-black text-zinc-200">
              {longestStreak}
            </span>
            <span className="text-xs text-zinc-400 font-medium">ngày</span>
          </div>
          <span className="text-[10px] text-zinc-500 mt-1">Chuỗi dài nhất từng đạt</span>
        </div>

        <div className="col-span-2 sm:col-span-1 p-4 rounded-2xl bg-[#191a1e] border border-[#2b2d35] flex flex-col justify-between shadow-lg">
          <span className="text-[11px] font-medium text-zinc-400">Mốc phần thưởng</span>
          <div className="flex items-center gap-2 mt-1 min-w-0">
            {nextMilestone ? (
              <div className="flex items-center gap-2 min-w-0">
                <TierMedal tier={nextMilestone.tier} isUnlocked={false} size="xs" />
                <span className="text-xs font-bold text-amber-300 truncate">
                  {nextMilestone.badge} (+{nextMilestone.bonus} lượt)
                </span>
              </div>
            ) : (
              <div className="flex items-center gap-2 min-w-0">
                <TierMedal tier={7} isUnlocked={true} size="xs" />
                <span className="text-xs font-bold text-amber-300">Tri Kỷ</span>
              </div>
            )}
          </div>
          <span className="text-[10px] text-zinc-500 mt-1">
            {nextMilestone ? `Còn ${daysToNext} ngày nữa để nhận quà` : "Đã chinh phục đỉnh cao!"}
          </span>
        </div>
      </div>

      {/* 🎁 Milestone Rewards Detail & Infinite Loop */}
      <div className="bg-[#191a1e] border border-[#2b2d35] rounded-3xl p-5 sm:p-7 shadow-xl">
        <div className="flex items-center justify-between text-xs font-semibold text-zinc-300 mb-4 px-1">
          <span className="flex items-center gap-1.5">
            <Gift className="w-4 h-4 text-amber-400" />
            Chi Tiết Lượt Bốc Bài Nhận Được
          </span>
          {nextMilestone && (
            <span className="text-[11px] text-amber-400 font-medium">
              Mục tiêu kế tiếp: {daysToNext} ngày nữa
            </span>
          )}
        </div>

        <div className="divide-y divide-[#272932]">
          {MILESTONES.map((m) => {
            const isReached = currentStreak >= m.days;
            return (
              <div
                key={m.days}
                className={`flex items-center justify-between py-3.5 px-2.5 sm:px-3.5 rounded-xl transition-all ${
                  isReached
                    ? "hover:bg-[#202229]/60 text-zinc-300"
                    : "text-zinc-500 opacity-55 hover:bg-[#1b1c22]/40"
                }`}
              >
                <div className="flex items-center gap-4 min-w-0">
                  <div className="w-10 h-10 shrink-0 flex items-center justify-center">
                    <TierMedal tier={m.tier} isUnlocked={isReached} size="sm" />
                  </div>
                  <div className="min-w-0">
                    <div className="flex items-center gap-2.5">
                      <span className="font-semibold text-sm text-zinc-100">
                        {m.badge}
                      </span>
                      <span className="text-[11px] text-zinc-400 font-normal">
                        • {m.days} ngày liên tiếp
                      </span>
                    </div>
                    <p className="text-[11px] text-zinc-400 mt-0.5 truncate">
                      {m.description}
                    </p>
                  </div>
                </div>

                <div className="shrink-0 pl-3">
                  {isReached ? (
                    <span className="inline-flex items-center gap-1.5 text-xs font-medium text-emerald-400/90">
                      <ShieldCheck className="w-3.5 h-3.5 text-emerald-400/80" />
                      Đạt được
                    </span>
                  ) : (
                    <span className="text-xs text-zinc-400 font-medium">
                      Còn {m.days - currentStreak} ngày
                    </span>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* Infinite Weekly Rewards Note */}
        <div className="mt-4 p-3.5 sm:p-4 rounded-2xl bg-[#1d1f26] border border-[#2d303b] flex items-start gap-3 text-xs text-zinc-400 leading-relaxed">
          <Info className="w-4 h-4 text-amber-400/80 shrink-0 mt-0.5" />
          <div>
            <strong className="text-zinc-200 block mb-0.5 font-semibold">Vòng lặp duy trì sau 30 ngày:</strong>
            Sau khi vượt mốc 30 ngày, cứ mỗi <span className="text-zinc-300 font-medium">7 ngày duy trì liên tiếp</span> (ngày 37, 44, 51, 58...) bạn sẽ đều đặn nhận thêm <span className="text-amber-300/90 font-semibold">+3 lượt bốc bài chuyên sâu</span>.
          </div>
        </div>
      </div>
    </div>
  );
}
