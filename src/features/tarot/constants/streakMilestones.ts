import { TierLevel } from "../components/TierMedal";

export interface Milestone {
  tier: TierLevel;
  tierLabel: string;
  rankName: string;
  days: number;
  bonus: number;
  badge: string;
  tagline: string;
  description: string;
  colors: {
    unlockedBg: string;
    unlockedBorder: string;
    unlockedText: string;
    glow: string;
  };
}

export const MILESTONES: Milestone[] = [
  {
    tier: 1,
    tierLabel: "Cấp I",
    rankName: "Hạng Đồng",
    days: 3,
    bonus: 1,
    badge: "Tò Mò",
    tagline: "Khơi gợi tò mò và khám phá",
    description: "+1 lượt bốc bài chuyên sâu",
    colors: {
      unlockedBg: "from-amber-600/15 via-orange-600/10 to-transparent",
      unlockedBorder: "border-amber-600/40",
      unlockedText: "text-amber-300",
      glow: "shadow-[0_0_25px_rgba(217,119,6,0.25)]",
    },
  },
  {
    tier: 2,
    tierLabel: "Cấp II",
    rankName: "Hạng Bạc",
    days: 7,
    bonus: 3,
    badge: "Tin Tưởng",
    tagline: "Xây dựng niềm tin gắn bó",
    description: "+3 lượt bốc bài chuyên sâu",
    colors: {
      unlockedBg: "from-slate-400/15 via-zinc-500/10 to-transparent",
      unlockedBorder: "border-slate-400/40",
      unlockedText: "text-slate-200",
      glow: "shadow-[0_0_25px_rgba(203,213,225,0.25)]",
    },
  },
  {
    tier: 3,
    tierLabel: "Cấp III",
    rankName: "Hạng Vàng",
    days: 14,
    bonus: 5,
    badge: "Thần Giao",
    tagline: "Kết nối trực giác sâu sắc",
    description: "+5 lượt bốc bài chuyên sâu",
    colors: {
      unlockedBg: "from-yellow-500/15 via-amber-500/10 to-transparent",
      unlockedBorder: "border-yellow-500/40",
      unlockedText: "text-yellow-300",
      glow: "shadow-[0_0_25px_rgba(234,179,8,0.25)]",
    },
  },
  {
    tier: 4,
    tierLabel: "Cấp IV",
    rankName: "Hạng Bạch Kim",
    days: 30,
    bonus: 10,
    badge: "Cộng Hưởng",
    tagline: "Cộng hưởng tần số năng lượng",
    description: "+10 lượt bốc bài chuyên sâu",
    colors: {
      unlockedBg: "from-cyan-500/20 via-rose-500/15 to-transparent",
      unlockedBorder: "border-cyan-400/50",
      unlockedText: "text-cyan-200",
      glow: "shadow-[0_0_30px_rgba(6,182,212,0.3)]",
    },
  },
  {
    tier: 5,
    tierLabel: "Cấp V",
    rankName: "Hạng Kim Cương",
    days: 60,
    bonus: 15,
    badge: "Tâm Truyền",
    tagline: "Tâm truyền tâm qua từng trải bài",
    description: "+15 lượt bốc bài chuyên sâu",
    colors: {
      unlockedBg: "from-purple-500/20 via-pink-500/15 to-transparent",
      unlockedBorder: "border-purple-500/50",
      unlockedText: "text-purple-200",
      glow: "shadow-[0_0_30px_rgba(168,85,247,0.3)]",
    },
  },
  {
    tier: 6,
    tierLabel: "Cấp VI",
    rankName: "Hạng Tinh Hoa",
    days: 100,
    bonus: 20,
    badge: "Đồng Điệu",
    tagline: "Trăm ngày đồng điệu linh hồn",
    description: "+20 lượt bốc bài chuyên sâu",
    colors: {
      unlockedBg: "from-sky-500/20 via-blue-600/15 to-transparent",
      unlockedBorder: "border-sky-400/50",
      unlockedText: "text-sky-200",
      glow: "shadow-[0_0_30px_rgba(56,189,248,0.35)]",
    },
  },
  {
    tier: 7,
    tierLabel: "Cấp VII",
    rankName: "Hạng Thần Thoại",
    days: 365,
    bonus: 50,
    badge: "Tri Kỷ",
    tagline: "Một năm gắn kết tri kỷ",
    description: "+50 lượt bốc bài chuyên sâu",
    colors: {
      unlockedBg: "from-amber-500/25 via-rose-500/20 to-purple-600/25",
      unlockedBorder: "border-amber-400/70",
      unlockedText: "text-amber-200",
      glow: "shadow-[0_0_45px_rgba(251,191,36,0.45)]",
    },
  },
];

export const WEEK_DAYS = ["T2", "T3", "T4", "T5", "T6", "T7", "CN"] as const;
