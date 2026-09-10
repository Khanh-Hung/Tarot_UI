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
    case "DAILY_ORACLE":
    case "SINGLE_CARD_FOCUS":
      return "Thông Điệp Ngày Mới (1 Lá)";
    case "PAST_PRESENT_FUTURE":
    case "THREE_CARDS_TIMELINE":
      return "Quá Khứ • Hiện Tại • Tương Lai (3 Lá)";
    case "TWO_PATHS_CHOICE":
      return "Thực Tại & Hai Ngả Rẽ (3 Lá)";
    case "LOVE_RELATIONSHIP":
      return "Tình Duyên & Kết Nối (3 Lá)";
    case "MIND_BODY_SPIRIT":
      return "Thân • Tâm • Trí Chữa Lành (3 Lá)";
    case "SITUATION_OBSTACLE_ADVICE":
      return "Thực Trạng & Giải Pháp Sự Nghiệp (3 Lá)";
    case "HORSESHOE":
      return "Móng Ngựa May Mắn (5 Lá)";
    case "CELTIC_CROSS":
      return "Thập Tự Celtic Kinh Điển (10 Lá)";
    default:
      return "Trải Bài Tarot";
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
