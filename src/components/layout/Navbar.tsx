"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Sparkles,
  History,
  BookOpen,
  LogOut,
  LogIn,
  Star,
  User,
  ChevronRight,
  Zap,
} from "lucide-react";
import { useAuth } from "@/features/auth/hooks/useAuth";
import { Avatar } from "@/components/ui/Avatar";
import { EnergyQuotaModal } from "@/features/ads/components/EnergyQuotaModal";
import { tarotService } from "@/features/tarot/services/tarotService";
import { UserQuotaDto } from "@/features/tarot/types/tarot.types";

const ZODIAC_LABEL_MAP: Record<string, string> = {
  ARIES: "Bạch Dương",
  TAURUS: "Kim Ngưu",
  GEMINI: "Song Tử",
  CANCER: "Cự Giải",
  LEO: "Sư Tử",
  VIRGO: "Xử Nữ",
  LIBRA: "Thiên Bình",
  SCORPIO: "Bọ Cạp",
  SAGITTARIUS: "Nhân Mã",
  CAPRICORN: "Ma Kết",
  AQUARIUS: "Bảo Bình",
  PISCES: "Song Ngư",
};

export const Navbar: React.FC = () => {
  const pathname = usePathname();
  const { user, isAuthenticated, logout } = useAuth();

  const [scrolled, setScrolled] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isQuotaModalOpen, setIsQuotaModalOpen] = useState(false);
  const [quota, setQuota] = useState<UserQuotaDto | null>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Lấy hạn mức năng lượng và lắng nghe sự kiện cập nhật
  useEffect(() => {
    if (!isAuthenticated || !user?.userId) {
      setQuota(null);
      return;
    }

    const fetchQuota = async () => {
      try {
        const data = await tarotService.getUserQuota(user.userId);
        setQuota(data);
      } catch (err) {
        // Silent catch in dev
      }
    };

    fetchQuota();

    const handleQuotaUpdated = (event: any) => {
      if (event?.detail) {
        setQuota(event.detail);
      } else {
        fetchQuota();
      }
    };

    window.addEventListener("tarot_quota_updated", handleQuotaUpdated);
    return () => {
      window.removeEventListener("tarot_quota_updated", handleQuotaUpdated);
    };
  }, [isAuthenticated, user?.userId]);

  useEffect(() => {
    const container = document.getElementById("main-scroll-container");

    const handleScroll = () => {
      const scrollTop = container ? container.scrollTop : window.scrollY;
      setScrolled((prev) => {
        if (prev) {
          return scrollTop > 15;
        }
        return scrollTop > 35;
      });
    };

    if (container) {
      container.addEventListener("scroll", handleScroll, { passive: true });
    } else {
      window.addEventListener("scroll", handleScroll, { passive: true });
    }

    // Check initial scroll value on mount / page change
    const checkInitialScroll = () => {
      if (container) {
        setScrolled(container.scrollTop > 35);
      } else {
        setScrolled(window.scrollY > 35);
      }
    };
    const timeoutId = setTimeout(checkInitialScroll, 0);

    return () => {
      clearTimeout(timeoutId);
      if (container) {
        container.removeEventListener("scroll", handleScroll);
      } else {
        window.removeEventListener("scroll", handleScroll);
      }
    };
  }, [pathname]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const navItems = [
    {
      label: "Bốc Bài Tarot",
      href: "/reading",
      icon: <Sparkles className="h-4 w-4" />,
    },
    {
      label: "Lịch Sử",
      href: "/history",
      icon: <History className="h-4 w-4" />,
      requireAuth: true,
    },
    {
      label: "Thư Viện Bài",
      href: "/decks",
      icon: <BookOpen className="h-4 w-4" />,
    },
  ];

  return (
    <header
      className={`sticky top-0 left-0 right-0 z-40 w-full shrink-0 transition-all duration-500 border-b ${
        scrolled
          ? "border-[#2c2e35] bg-[#1a1b1f]/95 shadow-xl shadow-black/30 backdrop-blur-xl"
          : "border-[#26282e] bg-[#18191c]/85 backdrop-blur-md"
      }`}
    >
      <div className="w-full px-4 sm:px-6 lg:px-8">
        <div
          className={`flex items-center justify-between transition-all duration-500 ${
            scrolled ? "h-14" : "h-16"
          }`}
        >
          {/* 🌟 LEFT: BRAND & LOGO */}
          <div className="flex-1 flex items-center justify-start">
            <Link href="/" className="flex items-center group cursor-pointer select-none">
              <span className="font-sans text-xl font-black tracking-tighter text-zinc-100 transition-all duration-300 group-hover:text-white">
                Nyxoris
              </span>
            </Link>
          </div>

          {/* 🌟 CENTER: NAVIGATION LINKS */}
          <nav className="hidden md:flex items-center gap-6">
            {navItems.map((item) => {
              if (item.requireAuth && !isAuthenticated) return null;
              const active = pathname === item.href;
              return (
                <Link
                  key={item.label}
                  href={item.href}
                  className={`flex items-center gap-2 text-xs font-semibold transition-colors py-2 px-1 ${
                    active
                      ? "text-white"
                      : "text-zinc-400 hover:text-zinc-200"
                  }`}
                >
                  <span className="transition-transform group-hover:scale-110">
                    {item.icon}
                  </span>
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </nav>

          {/* 🌟 RIGHT: AUTH */}
          <div className="flex-1 flex items-center justify-end gap-2.5 sm:gap-3 transition-all duration-500">
            {isAuthenticated && user ? (
              <>
                {/* 🔮 Energy HUD Chip */}
                {quota === null ? (
                  <div className="flex items-center gap-1.5 rounded-full px-2.5 py-1 border border-zinc-700/40 bg-zinc-800/40 text-zinc-400 text-xs select-none">
                    <Zap className="w-3.5 h-3.5 text-zinc-500 animate-pulse" />
                    <span className="w-3 h-3 bg-zinc-700 rounded-full animate-pulse inline-block" />
                    <span className="hidden sm:inline text-[11px] opacity-70">Lượt</span>
                  </div>
                ) : (
                  <button
                    onClick={() => setIsQuotaModalOpen(true)}
                    className={`flex items-center gap-1.5 rounded-full px-2.5 py-1 border transition-all cursor-pointer select-none text-xs font-medium shadow-sm active:scale-95 ${
                      quota.availableReadings > 0
                        ? "border-amber-500/30 bg-amber-500/10 text-amber-300 hover:bg-amber-500/20 hover:border-amber-400/50"
                        : "border-red-500/40 bg-red-500/15 text-red-300 animate-pulse hover:bg-red-500/25"
                    }`}
                    title="Bấm để xem hạn mức và nhận thêm lượt bói"
                  >
                    <Zap
                      className={`w-3.5 h-3.5 ${
                        quota.availableReadings > 0
                          ? "text-amber-400 fill-amber-400/30"
                          : "text-red-400 fill-red-400/30"
                      }`}
                    />
                    <span className="font-semibold">
                      {quota.availableReadings}
                    </span>
                    <span className="hidden sm:inline text-[11px] opacity-80">
                      Lượt
                    </span>
                  </button>
                )}

                <div className="relative" ref={dropdownRef}>
                  <button
                    onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                    className="relative flex items-center justify-center rounded-full p-0.5 border border-[#3b3d46] bg-[#23242a] hover:border-[#525560] transition-all cursor-pointer shadow-sm active:scale-95 shrink-0 select-none"
                    title={`${user.username} (${user.zodiacSign || "Seeker"})`}
                  >
                  <Avatar
                    src={(user as { avatarUrl?: string })?.avatarUrl}
                    alt={user.username}
                    size="sm"
                    className="!rounded-full !size-8 !h-8 !w-8 border-none shrink-0"
                  />
                </button>

                {isDropdownOpen && (() => {
                  const displayName = (user as { displayName?: string; username?: string })?.displayName || user.username;
                  const zodiacName = user.zodiacSign && user.zodiacSign !== "UNKNOWN"
                    ? ZODIAC_LABEL_MAP[user.zodiacSign] || user.zodiacSign
                    : "Chưa đặt";
                  return (
                    <div className="absolute right-0 mt-2.5 w-64 overflow-hidden rounded-2xl border border-[#31333a] bg-[#212227] p-2 shadow-2xl backdrop-blur-xl z-50 animate-in fade-in slide-in-from-top-2">
                      <Link
                        href="/profile"
                        onClick={() => setIsDropdownOpen(false)}
                        className="flex items-center justify-between gap-3 border-b border-[#2c2e35] p-2.5 mb-1 rounded-xl hover:bg-[#2b2c33] transition-colors cursor-pointer group"
                        title="Xem và chỉnh sửa hồ sơ cá nhân"
                      >
                        <div className="flex items-center gap-3 min-w-0 flex-1">
                          <Avatar
                            src={(user as { avatarUrl?: string })?.avatarUrl}
                            alt={displayName}
                            size="md"
                            className="!rounded-full !h-10 !w-10 border border-[#3b3d46] text-xs font-bold shrink-0"
                          />
                          <div className="min-w-0 flex-1">
                            <p className="text-xs font-bold text-zinc-100 group-hover:text-white transition-colors truncate">
                              {displayName}
                            </p>
                            <div className="flex items-center gap-1 text-[11px] text-zinc-400 font-medium mt-0.5">
                              <Star className="h-3 w-3 text-amber-400/90 shrink-0" />
                              <span className="truncate">Cung: {zodiacName}</span>
                            </div>
                          </div>
                        </div>
                        <ChevronRight className="h-4 w-4 text-zinc-400 group-hover:text-zinc-200 transition-colors shrink-0" />
                      </Link>

                      <div className="py-1 space-y-0.5">

                      <Link
                        href="/reading"
                        onClick={() => setIsDropdownOpen(false)}
                        className="flex items-center gap-2.5 rounded-xl px-3 py-2 text-xs font-medium text-zinc-300 hover:bg-[#2b2c33] hover:text-zinc-100 transition-colors"
                      >
                        <Sparkles className="w-4 h-4 text-pink-400" />
                        <span>Bốc bài Tarot mới</span>
                      </Link>

                      <Link
                        href="/history"
                        onClick={() => setIsDropdownOpen(false)}
                        className="flex items-center gap-2.5 rounded-xl px-3 py-2 text-xs font-medium text-zinc-300 hover:bg-[#2b2c33] hover:text-zinc-100 transition-colors"
                      >
                        <History className="w-4 h-4 text-emerald-400" />
                        <span>Lịch sử</span>
                      </Link>

                      <Link
                        href="/decks"
                        onClick={() => setIsDropdownOpen(false)}
                        className="flex items-center gap-2.5 rounded-xl px-3 py-2 text-xs font-medium text-zinc-300 hover:bg-[#2b2c33] hover:text-zinc-100 transition-colors"
                      >
                        <BookOpen className="w-4 h-4 text-sky-400" />
                        <span>Thư viện bài</span>
                      </Link>
                    </div>

                    <div className="border-t border-[#2c2e35] pt-1 mt-1">
                      <button
                        onClick={() => {
                          logout();
                          setIsDropdownOpen(false);
                        }}
                        className="w-full flex items-center gap-2.5 rounded-xl px-3 py-2 text-xs font-medium text-rose-400 hover:bg-rose-950/30 transition-colors cursor-pointer"
                      >
                        <LogOut className="w-4 h-4 text-rose-400" />
                        <span>Đăng xuất</span>
                      </button>
                    </div>
                  </div>
                  );
                })()}
              </div>
            </>
            ) : (
              <div className="flex items-center transition-all duration-500">
                <Link
                  href="/login"
                  className={`rounded-xl font-bold silver-gradient-btn transition-all duration-300 shadow-md whitespace-nowrap flex items-center gap-1.5 ${
                    scrolled ? "px-3.5 py-1.5 text-[11px]" : "px-4 py-2 text-xs"
                  }`}
                >
                  <LogIn className="w-3.5 h-3.5 text-zinc-950" />
                  <span>Đăng nhập</span>
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Modal Hạn Mức Năng Lượng & Xem Quảng Cáo */}
      <EnergyQuotaModal
        isOpen={isQuotaModalOpen}
        onClose={() => setIsQuotaModalOpen(false)}
        quota={quota}
        onQuotaUpdated={(newQuota) => setQuota(newQuota)}
        userId={user?.userId}
      />
    </header>
  );
};