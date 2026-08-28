"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Moon,
  Sparkles,
  History,
  BookOpen,
  User as UserIcon,
  LogOut,
  ChevronRight,
  LogIn,
  Star,
} from "lucide-react";
import { useAuth } from "@/features/auth/hooks/useAuth";

export const Navbar: React.FC = () => {
  const pathname = usePathname();
  const { user, isAuthenticated, logout } = useAuth();

  const [scrolled, setScrolled] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

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
      icon: <Sparkles className="w-3.5 h-3.5" />,
    },
    {
      label: "Lịch Sử Quẻ",
      href: "/history",
      icon: <History className="w-3.5 h-3.5" />,
      requireAuth: true,
    },
    {
      label: "Thư Viện 78 Lá",
      href: "/decks",
      icon: <BookOpen className="w-3.5 h-3.5" />,
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
            <Link href="/" className="flex items-center gap-3 group select-none cursor-pointer">
              <div
                className={`rounded-xl bg-gradient-to-br from-white via-zinc-200 to-zinc-400 flex items-center justify-center shadow-md shadow-white/10 group-hover:scale-105 transition-all duration-500 ${
                  scrolled ? "w-8 h-8 rounded-lg" : "w-9 h-9"
                }`}
              >
                <Moon
                  className={`text-zinc-950 fill-zinc-950 transition-all duration-500 ${
                    scrolled ? "w-3.5 h-3.5" : "w-4 h-4"
                  }`}
                />
              </div>
              <div className="flex flex-col transition-all duration-500">
                <span className="font-sans text-base sm:text-lg font-bold tracking-wider text-zinc-100 group-hover:text-white transition-all duration-500">
                  ORACLE TAROT
                </span>
                <span
                  className={`tracking-[0.2em] text-zinc-400 uppercase transition-all duration-500 ${
                    scrolled ? "text-[8px] opacity-70" : "text-[9px] opacity-100 -mt-0.5"
                  }`}
                >
                  Moonlit Wisdom
                </span>
              </div>
            </Link>
          </div>

          {/* 🌟 CENTER: NAVIGATION */}
          <nav className="hidden md:flex items-center gap-2 transition-all duration-500">
            {navItems.map((item) => {
              if (item.requireAuth && !isAuthenticated) return null;
              const active = pathname === item.href;
              return (
                <Link
                  key={item.label}
                  href={item.href}
                  className={`flex items-center gap-2 px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all duration-500 ${
                    active
                      ? "text-white bg-white/[0.08] border border-white/10 shadow-sm"
                      : "text-zinc-400 hover:text-zinc-200 hover:bg-[#23242a]"
                  }`}
                >
                  <span className="transition-transform duration-300 group-hover:scale-110">
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
              <div className="relative" ref={dropdownRef}>
                <button
                  onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                  className={`rounded-full border border-[#3b3d46] hover:border-[#525560] bg-[#23242a] flex items-center justify-center text-zinc-100 font-bold transition-all duration-300 cursor-pointer shadow-sm active:scale-95 select-none ${
                    scrolled ? "w-8 h-8 text-xs" : "w-9 h-9 text-xs sm:text-sm"
                  }`}
                  title={`${user.username} (${user.zodiacSign || "Seeker"})`}
                >
                  {user.username.charAt(0).toUpperCase()}
                </button>

                {isDropdownOpen && (
                  <div className="absolute right-0 mt-2.5 w-64 overflow-hidden rounded-2xl border border-[#31333a] bg-[#212227] p-2 shadow-2xl backdrop-blur-xl z-50 animate-in fade-in slide-in-from-top-2">
                    <div className="p-3 border-b border-[#2c2e35] mb-1 rounded-xl bg-[#1a1b1f] flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-gradient-to-br from-zinc-200 to-zinc-500 flex items-center justify-center text-zinc-950 font-bold text-sm shrink-0">
                        {user.username.charAt(0).toUpperCase()}
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="text-xs font-bold text-zinc-100 truncate">
                          {user.username}
                        </p>
                        <p className="text-[10px] text-zinc-400 truncate">
                          {user.email}
                        </p>
                        <div className="flex items-center gap-1 text-[10px] text-zinc-300 mt-1">
                          <Star className="w-3 h-3 text-zinc-400" />
                          <span>Cung: {user.zodiacSign || "Chưa đặt"}</span>
                        </div>
                      </div>
                    </div>

                    <div className="py-1 space-y-0.5">
                      <Link
                        href="/reading"
                        onClick={() => setIsDropdownOpen(false)}
                        className="flex items-center gap-2.5 rounded-xl px-3 py-2 text-xs font-medium text-zinc-300 hover:bg-[#2b2c33] hover:text-zinc-100 transition"
                      >
                        <Sparkles className="w-4 h-4 text-zinc-400" />
                        <span>Bốc bài Tarot mới</span>
                      </Link>

                      <Link
                        href="/history"
                        onClick={() => setIsDropdownOpen(false)}
                        className="flex items-center gap-2.5 rounded-xl px-3 py-2 text-xs font-medium text-zinc-300 hover:bg-[#2b2c33] hover:text-zinc-100 transition"
                      >
                        <History className="w-4 h-4 text-zinc-400" />
                        <span>Lịch sử các quẻ bói</span>
                      </Link>
                    </div>

                    <div className="border-t border-[#2c2e35] pt-1 mt-1">
                      <button
                        onClick={() => {
                          logout();
                          setIsDropdownOpen(false);
                        }}
                        className="w-full flex items-center gap-2.5 rounded-xl px-3 py-2 text-xs font-medium text-rose-400 hover:bg-rose-950/30 transition cursor-pointer"
                      >
                        <LogOut className="w-4 h-4" />
                        <span>Đăng xuất tài khoản</span>
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex items-center gap-2 sm:gap-3 transition-all duration-500">
                <Link
                  href="/login"
                  className={`rounded-xl font-semibold border border-[#3b3d46] bg-[#23242a] text-zinc-200 hover:border-[#525560] hover:bg-[#2b2c33] hover:text-white transition-all duration-300 flex items-center gap-1.5 ${
                    scrolled ? "px-3 py-1.5 text-[11px]" : "px-4 py-2 text-xs"
                  }`}
                >
                  <LogIn className="w-3.5 h-3.5" />
                  <span>Đăng nhập</span>
                </Link>
                <Link
                  href="/register"
                  className={`rounded-xl font-bold silver-gradient-btn transition-all duration-300 shadow-md whitespace-nowrap ${
                    scrolled ? "px-4 py-1.5 text-[11px]" : "px-5 py-2 text-xs"
                  }`}
                >
                  Đăng ký
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};