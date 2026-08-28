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
      label: "Lịch Sử Xem Bài",
      href: "/history",
      icon: <History className="w-3.5 h-3.5" />,
      requireAuth: true,
    },
    {
      label: "Thư Viện Bài",
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
          {/* 🌟 LEFT: BRAND & LOGO (PURE WORDMARK) */}
          <div className="flex-1 flex items-center justify-start">
            <Link href="/" className="group select-none cursor-pointer flex items-center">
              <span className="font-sans text-lg sm:text-xl font-bold tracking-tight text-white group-hover:text-zinc-200 transition-colors">
                Nyxoris
              </span>
            </Link>
          </div>

          {/* 🌟 CENTER: NAVIGATION (PURE CLEAN TEXT) */}
          <nav className="hidden md:flex items-center gap-6">
            {navItems.map((item) => {
              if (item.requireAuth && !isAuthenticated) return null;
              const active = pathname === item.href;
              return (
                <Link
                  key={item.label}
                  href={item.href}
                  className={`flex items-center gap-2 text-xs sm:text-sm font-medium transition-colors duration-150 select-none py-1 ${
                    active
                      ? "text-white"
                      : "text-zinc-400 hover:text-white"
                  }`}
                >
                  <span className="shrink-0">
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
                        <span>Lịch sử xem bài</span>
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
    </header>
  );
};