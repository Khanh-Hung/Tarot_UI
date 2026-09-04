"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
  Flame,
  Droplets,
  Wind,
  Mountain,
  Sparkles,
  Loader2,
  TrendingUp,
  Compass,
  Heart,
  Briefcase,
  Leaf,
  Layers,
} from "lucide-react";
import { tarotService } from "../services/tarotService";
import { EnergyInsightsResponse } from "../types/tarot.types";
import { EnergyInsightsSkeleton } from "@/components/ui/Skeleton";

interface EnergyInsightsViewProps {
  userId: string | number;
}

export const EnergyInsightsView: React.FC<EnergyInsightsViewProps> = ({ userId }) => {
  const [data, setData] = useState<EnergyInsightsResponse | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;
    const loadInsights = async () => {
      setIsLoading(true);
      try {
        const res = await tarotService.getEnergyInsights(userId);
        if (isMounted) setData(res);
      } catch (err) {
        console.error("Failed to load energy insights:", err);
      } finally {
        if (isMounted) setIsLoading(false);
      }
    };

    if (userId) {
      loadInsights();
    } else {
      setIsLoading(false);
    }
    return () => {
      isMounted = false;
    };
  }, [userId]);

  if (isLoading) {
    return <EnergyInsightsSkeleton />;
  }

  if (!data || data.totalReadings === 0) {
    return (
      <div className="flex min-h-[380px] flex-col items-center justify-center rounded-3xl border border-dashed border-[#31333a] bg-[#212227]/40 p-10 text-center">
        <Sparkles className="h-10 w-10 text-amber-400 mb-3" />
        <h3 className="text-base font-bold text-zinc-200">
          Chưa có dữ liệu Bản đồ Năng lượng
        </h3>
        <p className="mt-1.5 text-xs sm:text-sm text-zinc-400 max-w-md leading-relaxed">
          Hãy bốc những quẻ bài đầu tiên để hệ thống bắt đầu vẽ nên bức tranh năng lượng của các nguyên tố Đất, Nước, Lửa, Khí xoay quanh bạn nhé!
        </p>
        <Link
          href="/reading"
          className="mt-5 px-6 py-2.5 rounded-full bg-amber-400 hover:bg-amber-300 text-zinc-950 font-bold text-xs sm:text-sm flex items-center gap-2 shadow-lg transition hover:scale-105 active:scale-95 cursor-pointer shrink-0"
        >
          <Sparkles className="w-4 h-4 text-zinc-950 fill-current" />
          <span>Bốc Quẻ Bài Ngay</span>
        </Link>
      </div>
    );
  }

  const elementsMeta = [
    {
      key: "FIRE",
      label: "Lửa",
      sub: "Hành động & Khát vọng",
      colorText: "text-amber-400",
      colorBg: "bg-amber-400/10",
      colorBorder: "border-amber-400/25",
      colorBar: "bg-amber-400",
      icon: <Flame className="w-4 h-4 text-amber-400" />,
      pct: data.elementPercentages["FIRE"] || 0,
      count: data.elementCounts["FIRE"] || 0,
    },
    {
      key: "WATER",
      label: "Nước",
      sub: "Cảm xúc & Trực giác",
      colorText: "text-sky-400",
      colorBg: "bg-sky-400/10",
      colorBorder: "border-sky-400/25",
      colorBar: "bg-sky-400",
      icon: <Droplets className="w-4 h-4 text-sky-400" />,
      pct: data.elementPercentages["WATER"] || 0,
      count: data.elementCounts["WATER"] || 0,
    },
    {
      key: "AIR",
      label: "Khí",
      sub: "Trí tuệ & Tư duy",
      colorText: "text-indigo-400",
      colorBg: "bg-indigo-400/10",
      colorBorder: "border-indigo-400/25",
      colorBar: "bg-indigo-400",
      icon: <Wind className="w-4 h-4 text-indigo-400" />,
      pct: data.elementPercentages["AIR"] || 0,
      count: data.elementCounts["AIR"] || 0,
    },
    {
      key: "EARTH",
      label: "Đất",
      sub: "Thực tế & Nền tảng",
      colorText: "text-emerald-400",
      colorBg: "bg-emerald-400/10",
      colorBorder: "border-emerald-400/25",
      colorBar: "bg-emerald-400",
      icon: <Mountain className="w-4 h-4 text-emerald-400" />,
      pct: data.elementPercentages["EARTH"] || 0,
      count: data.elementCounts["EARTH"] || 0,
    },
  ];

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      {/* 🌟 THẺ TỔNG QUAN NĂNG LƯỢNG CHỦ ĐẠO */}
      <div className="relative overflow-hidden rounded-2xl border border-amber-400/20 bg-gradient-to-br from-[#24262d] via-[#1d1e23] to-[#17181c] p-6 sm:p-8 shadow-xl">
        <div className="absolute top-0 right-0 -mr-16 -mt-16 w-64 h-64 bg-amber-400/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-amber-400/10 border border-amber-400/30 text-amber-300">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Năng Lượng Chủ Đạo Hiện Tại</span>
            </div>
            <span className="text-xs text-zinc-400 font-medium">
              Phân tích từ {data.totalReadings} quẻ bói ({data.totalCardsDrawn} lá bài)
            </span>
          </div>

          <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
            {data.dominantElementVi}
          </h2>

          <p className="text-sm sm:text-base text-zinc-200 leading-relaxed max-w-3xl">
            {data.energyAdvice}
          </p>
        </div>
      </div>

      {/* 🌟 KHỐI 1: CÂN BẰNG 4 NGUYÊN TỐ (ELEMENTAL BALANCE) */}
      <div className="rounded-2xl border border-[#31333a] bg-[#191a1e] p-6 sm:p-7 shadow-lg space-y-5">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <TrendingUp className="w-5 h-5 text-amber-400" />
            <h3 className="text-base sm:text-lg font-bold text-white">
              Cân Bằng 4 Nguyên Tố
            </h3>
          </div>
          <span className="text-xs text-zinc-400">Tỷ lệ năng lượng qua các lá bài</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {elementsMeta.map((elem) => (
            <div
              key={elem.key}
              className={`p-4 rounded-xl border ${elem.colorBorder} ${elem.colorBg} flex flex-col justify-between gap-3`}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="p-1.5 rounded-lg bg-black/30">{elem.icon}</div>
                  <div>
                    <h4 className={`text-xs sm:text-sm font-bold ${elem.colorText}`}>
                      {elem.label}
                    </h4>
                    <p className="text-[11px] text-zinc-400">{elem.sub}</p>
                  </div>
                </div>
                <div className="text-right">
                  <span className="text-base font-extrabold text-white">{elem.pct}%</span>
                  <p className="text-[10px] text-zinc-400">{elem.count} lá</p>
                </div>
              </div>

              {/* Thanh đo phần trăm */}
              <div className="w-full h-1.5 rounded-full bg-black/40 overflow-hidden">
                <div
                  className={`h-full rounded-full ${elem.colorBar} transition-all duration-700`}
                  style={{ width: `${Math.min(100, Math.max(2, elem.pct))}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 🌟 KHỐI 2: TOP CÁC LÁ BÀI DUYÊN NỢ (MOST FREQUENT CARDS) */}
      {data.topCards && data.topCards.length > 0 && (() => {
        const hasRepetition = data.topCards.some((c) => c.count > 1);

        return (
          <div className="rounded-2xl border border-[#31333a] bg-[#191a1e] p-6 sm:p-7 shadow-lg space-y-5">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div className="flex items-center gap-2.5">
                <Layers className="w-5 h-5 text-amber-400" />
                <h3 className="text-base sm:text-lg font-bold text-white">
                  {hasRepetition ? "Top 3 Lá Bài Gắn Liền Với Bạn Nhất" : "Các Lá Bài Xuất Hiện Gần Đây"}
                </h3>
              </div>
              <span className="text-xs text-zinc-400">
                {hasRepetition
                  ? "Xuất hiện nhiều lần nhất trong lịch sử"
                  : "Chưa có lá lặp lại • Hãy bốc thêm để tìm lá duyên nợ nhất!"}
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {data.topCards.map((card, idx) => {
                const rankStyles = [
                  "text-amber-300 bg-amber-400/10 border-amber-400/30",
                  "text-zinc-200 bg-white/10 border-white/20",
                  "text-amber-500 bg-amber-600/10 border-amber-600/30",
                ][idx] || "text-zinc-400 bg-white/5 border-white/10";

                return (
                  <div
                    key={card.cardCode || idx}
                    className="group relative overflow-hidden rounded-xl border border-[#31333a] bg-[#22242a] p-4 flex gap-3 hover:border-amber-400/40 transition-all shadow-sm"
                  >
                    {/* Hình lá bài */}
                    <div className="w-14 h-22 rounded-lg overflow-hidden border border-white/10 bg-black/40 shrink-0 relative">
                      {card.imageUrl ? (
                        <img
                          src={card.imageUrl}
                          alt={card.nameVi}
                          className="w-full h-full object-cover group-hover:scale-105 transition duration-300"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-zinc-600">
                          <Sparkles className="w-5 h-5" />
                        </div>
                      )}
                    </div>

                    {/* Thông tin chi tiết */}
                    <div className="min-w-0 flex-1 flex flex-col justify-between py-0.5">
                      <div>
                        <div className="flex items-center justify-between gap-1">
                          {hasRepetition ? (
                            <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-md border ${rankStyles}`}>
                              Hạng #{idx + 1}
                            </span>
                          ) : (
                            <span className="text-[10px] font-semibold text-zinc-400 bg-white/[0.05] border border-white/10 px-2 py-0.5 rounded-md">
                              Gần đây
                            </span>
                          )}
                          <span className="text-[11px] font-bold text-white bg-white/[0.08] px-2 py-0.5 rounded-full">
                            {card.count} lần ({card.percentage}%)
                          </span>
                        </div>
                        <h4 className="text-sm font-bold text-zinc-100 group-hover:text-amber-300 transition line-clamp-1 mt-2">
                          {card.nameVi}
                        </h4>
                      </div>

                      <div className="flex items-center gap-2 text-[10px] text-zinc-400 pt-2 border-t border-white/[0.06]">
                        <span className="flex items-center gap-1 text-emerald-400">
                          <span>Xuôi:</span> <strong className="text-white">{card.uprightCount}</strong>
                        </span>
                        <span>•</span>
                        <span className="flex items-center gap-1 text-amber-400">
                          <span>Ngược:</span> <strong className="text-white">{card.reversedCount}</strong>
                        </span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        );
      })()}

      {/* 🌟 KHỐI 3: PHÂN BỔ CHỦ ĐỀ QUAN TÂM */}
      {data.topicDistribution && Object.keys(data.topicDistribution).length > 0 && (
        <div className="rounded-2xl border border-[#31333a] bg-[#191a1e] p-6 sm:p-7 shadow-lg space-y-4">
          <div className="flex items-center gap-2.5">
            <Compass className="w-5 h-5 text-amber-400" />
            <h3 className="text-base sm:text-lg font-bold text-white">
              Phương Diện Cuộc Sống Bạn Quan Tâm Nhất
            </h3>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2">
            {[
              { key: "CAREER_AND_FINANCE", label: "Công Việc", sub: "Sự nghiệp & Tài chính", icon: <Briefcase className="w-4 h-4 text-amber-400" /> },
              { key: "LOVE_AND_RELATIONSHIP", label: "Tình Duyên", sub: "Mối quan hệ", icon: <Heart className="w-4 h-4 text-rose-400" /> },
              { key: "SELF_GROWTH_AND_HEALING", label: "Chữa Lành", sub: "Nội tâm & Bản thân", icon: <Leaf className="w-4 h-4 text-emerald-400" /> },
              { key: "GENERAL_GUIDANCE", label: "Định Hướng", sub: "Tổng quan cuộc sống", icon: <Compass className="w-4 h-4 text-indigo-400" /> },
            ].map((topic) => {
              const count = data.topicDistribution[topic.key] || 0;
              return (
                <div
                  key={topic.key}
                  className="bg-[#212329] border border-[#31333a] rounded-xl p-3.5 flex flex-col justify-between gap-1.5"
                >
                  <div className="flex items-center gap-2 text-zinc-200 text-xs font-semibold">
                    {topic.icon}
                    <span>{topic.label}</span>
                  </div>
                  <p className="text-[10px] text-zinc-400 pl-6 -mt-1">{topic.sub}</p>
                  <span className="text-lg font-extrabold text-white pl-6">{count} quẻ</span>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};
