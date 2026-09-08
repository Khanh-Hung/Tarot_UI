import React from "react";
import {
  GiMedal,
  GiStarMedal,
  GiThirdEye,
  GiImperialCrown,
  GiWingedEmblem,
  GiWingedShield,
  GiGalaxy,
} from "react-icons/gi";

export type TierLevel = 1 | 2 | 3 | 4 | 5 | 6 | 7;

interface TierMedalProps {
  tier: TierLevel;
  isUnlocked: boolean;
  size?: "xs" | "sm" | "md" | "lg" | "xl";
  className?: string;
}

// Cấu hình phong cách và biểu tượng chuẩn từ Game Icons (react-icons/gi)
const TIER_CONFIG: Record<
  TierLevel,
  {
    icon: React.ElementType;
    unlockedContainer: string;
    innerRing: string;
    iconColor: string;
    glow: string;
    label: string;
  }
> = {
  1: {
    // 3 Ngày: Ấn Đồng Khởi Nguyên
    icon: GiMedal,
    unlockedContainer:
      "bg-gradient-to-b from-[#3d2112] via-[#2a160b] to-[#1a0e07] border-amber-600/60",
    innerRing: "border-amber-500/30",
    iconColor: "text-amber-400 drop-shadow-[0_2px_8px_rgba(245,158,11,0.5)]",
    glow: "shadow-[0_0_20px_rgba(217,119,6,0.3)]",
    label: "Hạng Đồng",
  },
  2: {
    // 7 Ngày: Tinh Tú Bạc
    icon: GiStarMedal,
    unlockedContainer:
      "bg-gradient-to-b from-[#2d3440] via-[#1e232b] to-[#12161b] border-slate-300/60",
    innerRing: "border-slate-300/30",
    iconColor: "text-slate-100 drop-shadow-[0_2px_8px_rgba(241,245,249,0.5)]",
    glow: "shadow-[0_0_20px_rgba(203,213,225,0.3)]",
    label: "Hạng Bạc",
  },
  3: {
    // 14 Ngày: Huyền Thị Tam Nhãn
    icon: GiThirdEye,
    unlockedContainer:
      "bg-gradient-to-b from-[#382b0d] via-[#241c08] to-[#140f04] border-yellow-500/70",
    innerRing: "border-yellow-400/40",
    iconColor: "text-yellow-300 drop-shadow-[0_2px_10px_rgba(234,179,8,0.6)]",
    glow: "shadow-[0_0_25px_rgba(234,179,8,0.35)]",
    label: "Hạng Vàng",
  },
  4: {
    // 30 Ngày: Đại Vương Miện Trực Giác
    icon: GiImperialCrown,
    unlockedContainer:
      "bg-gradient-to-b from-[#113136] via-[#0b2024] to-[#061214] border-cyan-400/70",
    innerRing: "border-cyan-300/40",
    iconColor: "text-cyan-200 drop-shadow-[0_2px_10px_rgba(34,211,238,0.6)]",
    glow: "shadow-[0_0_30px_rgba(6,182,212,0.4)]",
    label: "Hạng Bạch Kim",
  },
  5: {
    // 60 Ngày: Cánh Tinh Vân Vô Cực
    icon: GiWingedEmblem,
    unlockedContainer:
      "bg-gradient-to-b from-[#311742] via-[#200e2c] to-[#12071a] border-purple-400/70",
    innerRing: "border-purple-300/40",
    iconColor: "text-purple-200 drop-shadow-[0_2px_12px_rgba(192,132,252,0.6)]",
    glow: "shadow-[0_0_35px_rgba(168,85,247,0.4)]",
    label: "Hạng Kim Cương",
  },
  6: {
    // 100 Ngày: Thánh Khiên Hộ Vệ
    icon: GiWingedShield,
    unlockedContainer:
      "bg-gradient-to-b from-[#112d4d] via-[#0b1d33] to-[#06101d] border-sky-400/80",
    innerRing: "border-sky-300/40",
    iconColor: "text-sky-200 drop-shadow-[0_2px_14px_rgba(56,189,248,0.7)]",
    glow: "shadow-[0_0_40px_rgba(56,189,248,0.45)]",
    label: "Hạng Tinh Hoa",
  },
  7: {
    // 365 Ngày: Đại Thiên Hà Tối Thượng
    icon: GiGalaxy,
    unlockedContainer:
      "bg-gradient-to-b from-[#3d1a18] via-[#2c1236] to-[#120a21] border-amber-400/90",
    innerRing: "border-amber-300/50",
    iconColor: "text-amber-200 drop-shadow-[0_2px_16px_rgba(251,191,36,0.8)]",
    glow: "shadow-[0_0_45px_rgba(251,191,36,0.5)]",
    label: "Hạng Thần Thoại",
  },
};

export const TierMedal: React.FC<TierMedalProps> = ({
  tier,
  isUnlocked,
  size = "md",
  className = "",
}) => {
  const config = TIER_CONFIG[tier] || TIER_CONFIG[1];
  const IconComponent = config.icon;

  const sizeMap = {
    xs: {
      wrapper: "w-6 h-6",
      icon: "w-3.5 h-3.5",
      ring: "inset-[1px]",
    },
    sm: {
      wrapper: "w-10 h-10",
      icon: "w-5 h-5",
      ring: "inset-[2px]",
    },
    md: {
      wrapper: "w-16 h-16",
      icon: "w-8 h-8",
      ring: "inset-[3px]",
    },
    lg: {
      wrapper: "w-20 h-20",
      icon: "w-10 h-10",
      ring: "inset-1",
    },
    xl: {
      wrapper: "w-24 h-24 sm:w-28 sm:h-28",
      icon: "w-13 h-13 sm:w-15 sm:h-15",
      ring: "inset-1.5",
    },
  };

  const currentSize = sizeMap[size] || sizeMap.md;

  return (
    <div
      className={`group relative flex items-center justify-center rounded-full border transition-all duration-300 select-none ${
        currentSize.wrapper
      } ${
        isUnlocked
          ? `${config.unlockedContainer} ${config.glow} hover:scale-105`
          : "bg-[#16171b] border-zinc-800/80 opacity-60 hover:opacity-75"
      } ${className}`}
    >
      {/* 🌟 Vòng chỉ khắc kim loại bên trong (Etched Inner Ring) */}
      <div
        className={`absolute rounded-full pointer-events-none transition-colors duration-300 border ${
          currentSize.ring
        } ${isUnlocked ? config.innerRing : "border-zinc-800/40"}`}
      />

      {/* 🌟 Biểu tượng vector chuẩn Game Icons */}
      <IconComponent
        className={`relative z-10 transition-transform duration-300 group-hover:scale-110 ${
          currentSize.icon
        } ${isUnlocked ? config.iconColor : "text-zinc-600"}`}
      />
    </div>
  );
};
