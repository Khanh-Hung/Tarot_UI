import React from "react";
import { Flame, Droplets, Wind, Globe2, Sparkles } from "lucide-react";

export function getElementBadge(element?: string): React.ReactNode {
  switch (element?.toUpperCase()) {
    case "FIRE":
    case "LỬA":
      return (
        <span className="inline-flex items-center gap-1 text-[10px] font-medium text-amber-300 bg-amber-400/10 px-2 py-0.5 rounded-md border border-amber-300/20">
          <Flame className="w-3 h-3 text-amber-400" /> Hỏa
        </span>
      );
    case "WATER":
    case "NƯỚC":
      return (
        <span className="inline-flex items-center gap-1 text-[10px] font-medium text-sky-300 bg-sky-400/10 px-2 py-0.5 rounded-md border border-sky-300/20">
          <Droplets className="w-3 h-3 text-sky-400" /> Thủy
        </span>
      );
    case "AIR":
    case "KHÍ":
      return (
        <span className="inline-flex items-center gap-1 text-[10px] font-medium text-slate-300 bg-slate-400/10 px-2 py-0.5 rounded-md border border-slate-300/20">
          <Wind className="w-3 h-3 text-slate-300" /> Khí
        </span>
      );
    case "EARTH":
    case "ĐẤT":
      return (
        <span className="inline-flex items-center gap-1 text-[10px] font-medium text-emerald-300 bg-emerald-400/10 px-2 py-0.5 rounded-md border border-emerald-300/20">
          <Globe2 className="w-3 h-3 text-emerald-400" /> Đất
        </span>
      );
    default:
      return (
        <span className="inline-flex items-center gap-1 text-[10px] font-medium text-zinc-400 bg-white/5 px-2 py-0.5 rounded-md border border-white/10">
          <Sparkles className="w-3 h-3 text-amber-300" /> Tâm Linh
        </span>
      );
  }
}
