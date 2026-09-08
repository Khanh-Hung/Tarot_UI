import React from "react";
import { Heart, Briefcase, Leaf, Compass } from "lucide-react";

export function getTopicLabel(topic?: string): string {
  switch (topic) {
    case "LOVE_AND_RELATIONSHIP":
    case "LOVE_RELATIONSHIP":
      return "Tình Duyên & Mối Quan Hệ";
    case "CAREER_AND_FINANCE":
    case "CAREER_MONEY":
      return "Sự Nghiệp & Tài Chính";
    case "SELF_GROWTH_AND_HEALING":
    case "SPIRITUAL_HEALING":
      return "Chữa Lành & Nội Tâm";
    default:
      return "Định Hướng Cuộc Sống";
  }
}

export function getTopicMeta(topic?: string): {
  label: string;
  badgeClass: string;
  icon: React.ReactNode;
  glow: string;
} {
  switch (topic) {
    case "LOVE_AND_RELATIONSHIP":
    case "LOVE_RELATIONSHIP":
      return {
        label: "Tình Duyên & Mối Quan Hệ",
        badgeClass: "bg-rose-500/10 border-rose-500/25 text-rose-300",
        icon: <Heart className="w-5 h-5 text-rose-400" />,
        glow: "from-rose-500/[0.06] to-transparent",
      };
    case "CAREER_AND_FINANCE":
    case "CAREER_MONEY":
      return {
        label: "Sự Nghiệp & Tài Chính",
        badgeClass: "bg-amber-500/10 border-amber-500/25 text-amber-300",
        icon: <Briefcase className="w-5 h-5 text-amber-400" />,
        glow: "from-amber-500/[0.06] to-transparent",
      };
    case "SELF_GROWTH_AND_HEALING":
    case "SPIRITUAL_HEALING":
      return {
        label: "Chữa Lành & Nội Tâm",
        badgeClass: "bg-emerald-500/10 border-emerald-500/25 text-emerald-300",
        icon: <Leaf className="w-5 h-5 text-emerald-400" />,
        glow: "from-emerald-500/[0.06] to-transparent",
      };
    default:
      return {
        label: "Định Hướng Tổng Quan",
        badgeClass: "bg-indigo-500/10 border-indigo-500/25 text-indigo-300",
        icon: <Compass className="w-5 h-5 text-indigo-300" />,
        glow: "from-indigo-500/[0.06] to-transparent",
      };
  }
}

export function getSpreadLabel(spreadType?: string): string {
  switch (spreadType) {
    case "PAST_PRESENT_FUTURE":
    case "THREE_CARDS_TIMELINE":
      return "Quá Khứ • Hiện Tại • Tương Lai";
    case "SINGLE_CARD_FOCUS":
      return "1 Lá Trọng Tâm";
    case "TWO_PATHS_CHOICE":
      return "Hai Ngã Rẽ";
    case "CELTIC_CROSS":
      return "Celtic Cross";
    default:
      return "Trải Bài 3 Lá";
  }
}

export function getDeckName(deckCode?: string): string {
  switch (deckCode) {
    case "THOTH_ALEISTER":
      return "Thoth";
    case "MARSEILLE_HERMETIC":
      return "Marseille";
    default:
      return "Rider-Waite";
  }
}
