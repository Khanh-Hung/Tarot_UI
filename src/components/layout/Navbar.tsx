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
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

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
      label: "Các Bộ Bài",
      href: "/#decks",
      icon: <BookOpen className="w-3.5 h-3.5" />,
    },
  ];

  return (
    <header
      className={`sticky top-0 left-0 right-0 z-40 w-full shrink-0 transition-all duration-300 border-b ${
        scrolled
          ? "border-white/[0.12] bg-[#060910]/95 shadow-2xl shadow-black/60 backdrop-blur-2xl"
          : "border-white/[0.06] bg-[#060910]/80 backdrop-blur-md"
      }`}
    >
      <div className="w-full px-6 sm:px-8 lg:px-10">
        <div
          className={`flex items-center justify-between transition-all duration-300 ${
            scrolled ? "h-14" : "h-16"
          }`}
        >
          {/* 🌟 LEFT: BRAND */}
          <div className="flex-1 flex items-center justify-start">
            <Link href="/" className="flex items-center gap-3 group select-none">
              <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-xl bg-gradient-to-br from-white via-slate-200 to-slate-400 flex items-center justify-center shadow-lg shadow-white/10 group-hover:scale-105 transition duration-300">
                <Moon className="w-4 h-4 text-slate-950 fill-slate-950" />
              </div>
              <div className="flex flex-col">
                <span className="text-base sm:text-lg font-bold tracking-wider silver-gradient-text">
                  ORACLE TAROT
                </span>
                <span className="text-[9px] tracking-[0.25em] text-slate-400 uppercase -mt-0.5">
                  Moonlit Wisdom
                </span>
              </div>
            </Link>
          </div>

          {/* 🌟 CENTER: NAVIGATION */}
          <nav className="hidden md:flex items-center gap-2">
            {navItems.map((item) => {
              if (item.requireAuth && !isAuthenticated) return null;
              const active = pathname === item.href;
              return (
                <Link
                  key={item.label}
                  href={item.href}
                  className={`flex items-center gap-2 px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                    active
                      ? "text-white bg-white/[0.10] border border-white/20 shadow-sm"
                      : "text-slate-400 hover:text-slate-200 hover:bg-white/[0.03]"
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
          <div className="flex-1 flex items-center justify-end gap-3">
            {isAuthenticated && user ? (
              <div className="relative" ref={dropdownRef}>
                <button
                  onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                  className="w-8 h-8 sm:w-9 sm:h-9 rounded-full border border-white/20 hover:border-white/40 bg-gradient-to-br from-slate-200 via-slate-300 to-slate-500 flex items-center justify-center text-slate-950 font-bold text-xs sm:text-sm transition-all cursor-pointer shadow-md hover:scale-105 active:scale-95 ring-2 ring-white/10 hover:ring-white/25 select-none"
                  title={`${user.username} (${user.zodiacSign || "Seeker"})`}
                >
                  {user.username.charAt(0).toUpperCase()}
                </button>

                {isDropdownOpen && (
                  <div className="absolute right-0 mt-2.5 w-64 overflow-hidden rounded-2xl border border-white/[0.12] bg-[#0E1322]/95 p-2 shadow-2xl backdrop-blur-2xl z-50 animate-in fade-in slide-in-from-top-2">
                    <div className="p-3 border-b border-white/[0.08] mb-1 rounded-xl bg-white/[0.02] flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-gradient-to-br from-slate-200 to-slate-500 flex items-center justify-center text-slate-950 font-bold text-sm shrink-0">
                        {user.username.charAt(0).toUpperCase()}
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="text-xs font-bold text-white truncate">
                          {user.username}
                        </p>
                        <p className="text-[10px] text-slate-400 truncate">
                          {user.email}
                        </p>
                        <div className="flex items-center gap-1 text-[10px] text-slate-300 mt-1">
                          <Star className="w-3 h-3 text-slate-400" />
                          <span>Cung: {user.zodiacSign || "Chưa đặt"}</span>
                        </div>
                      </div>
                    </div>

                    <div className="py-1 space-y-0.5">
                      <Link
                        href="/reading"
                        onClick={() => setIsDropdownOpen(false)}
                        className="flex items-center gap-2.5 rounded-xl px-3 py-2 text-xs font-medium text-slate-300 hover:bg-white/[0.06] hover:text-white transition"
                      >
                        <Sparkles className="w-4 h-4 text-slate-300" />
                        <span>Bốc bài Tarot mới</span>
                      </Link>

                      <Link
                        href="/history"
                        onClick={() => setIsDropdownOpen(false)}
                        className="flex items-center gap-2.5 rounded-xl px-3 py-2 text-xs font-medium text-slate-300 hover:bg-white/[0.06] hover:text-white transition"
                      >
                        <History className="w-4 h-4 text-slate-300" />
                        <span>Lịch sử các quẻ bói</span>
                      </Link>
                    </div>

                    <div className="border-t border-white/[0.08] pt-1 mt-1">
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
              <div className="flex items-center gap-3">
                <Link
                  href="/login"
                  className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-300 hover:text-white transition flex items-center gap-1.5"
                >
                  <LogIn className="w-3.5 h-3.5" />
                  <span>Đăng nhập</span>
                </Link>
                <Link
                  href="/register"
                  className="px-5 py-2 rounded-xl text-xs font-bold silver-gradient-btn transition shadow-md whitespace-nowrap"
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