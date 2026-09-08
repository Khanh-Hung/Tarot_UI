"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
import { createPortal } from "react-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  X,
  Download,
  Share2,
  Copy,
  Check,
  Sparkles,
  Smartphone,
  Square,
  Edit3,
  Loader2,
  Palette,
  ZoomIn,
  RotateCcw,
  ChevronDown,
} from "lucide-react";
import {
  CreateReadingResponse,
  ReadingDetailResponse,
  ZodiacSign,
  DrawnCardDto,
} from "../types/tarot.types";

interface ShareTarotStoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  reading: CreateReadingResponse | ReadingDetailResponse;
  zodiacSign?: ZodiacSign;
}

type AspectRatioMode = "STORY" | "SQUARE"; // STORY = 9:16 (1080x1920), SQUARE = 1:1 (1080x1080)
type ColorTheme = "GOLD" | "AMETHYST" | "RUBY" | "SAPPHIRE" | "EMERALD" | "SILVER";

interface ThemeConfig {
  id: ColorTheme;
  name: string;
  shortName: string;
  tag: string;
  dotClass: string;
  glowHex: string;
  bgStops: [string, string, string, string];
  nebula1: string;
  nebula2: string;
  haloCenter: string;
  haloMid: string;
  primaryBorder: string;
  innerBorder: string;
  accent: string;
  accentSoft: string;
  accentHairline: string;
  starColor: (opacity: number) => string;
  crossColor: (opacity: number) => string;
  titleGradLight: string;
  nameGradLight: string;
}

const THEME_CONFIGS: Record<ColorTheme, ThemeConfig> = {
  GOLD: {
    id: "GOLD",
    name: "Vũ Trụ Vàng",
    shortName: "Vàng",
    tag: "Hoàng Kim",
    dotClass: "bg-amber-400",
    glowHex: "rgba(251,191,36,0.8)",
    bgStops: ["#08090d", "#0f1018", "#151722", "#0a0b10"],
    nebula1: "rgba(180, 130, 60, 0.12)",
    nebula2: "rgba(140, 90, 200, 0.1)",
    haloCenter: "rgba(245, 185, 65, 0.35)",
    haloMid: "rgba(180, 110, 240, 0.15)",
    primaryBorder: "#e5c06e",
    innerBorder: "rgba(255, 235, 175, 0.5)",
    accent: "#e5c06e",
    accentSoft: "rgba(229, 192, 110, 0.35)",
    accentHairline: "rgba(229, 192, 110, 0.15)",
    starColor: (op) => `rgba(255, 238, 180, ${op})`,
    crossColor: (op) => `rgba(245, 215, 127, ${op})`,
    titleGradLight: "#fae8b4",
    nameGradLight: "#fce7b0",
  },
  AMETHYST: {
    id: "AMETHYST",
    name: "Thạch Anh Tím",
    shortName: "Tím",
    tag: "Tâm Linh",
    dotClass: "bg-purple-400",
    glowHex: "rgba(192,132,252,0.8)",
    bgStops: ["#090812", "#130f22", "#1b142e", "#0a0814"],
    nebula1: "rgba(150, 80, 230, 0.14)",
    nebula2: "rgba(190, 110, 240, 0.11)",
    haloCenter: "rgba(192, 132, 252, 0.38)",
    haloMid: "rgba(120, 80, 240, 0.18)",
    primaryBorder: "#d8b4fe",
    innerBorder: "rgba(233, 213, 255, 0.5)",
    accent: "#d8b4fe",
    accentSoft: "rgba(216, 180, 254, 0.35)",
    accentHairline: "rgba(216, 180, 254, 0.15)",
    starColor: (op) => `rgba(240, 215, 255, ${op})`,
    crossColor: (op) => `rgba(216, 180, 254, ${op})`,
    titleGradLight: "#f3e8ff",
    nameGradLight: "#edd8fe",
  },
  RUBY: {
    id: "RUBY",
    name: "Hồng Ngọc Ruby",
    shortName: "Hồng Đỏ",
    tag: "Tình Duyên",
    dotClass: "bg-rose-400",
    glowHex: "rgba(251,113,133,0.8)",
    bgStops: ["#110508", "#1c0b11", "#240e16", "#0e0407"],
    nebula1: "rgba(244, 63, 94, 0.14)",
    nebula2: "rgba(251, 113, 133, 0.1)",
    haloCenter: "rgba(251, 113, 133, 0.38)",
    haloMid: "rgba(244, 63, 94, 0.18)",
    primaryBorder: "#fda4af",
    innerBorder: "rgba(254, 205, 211, 0.5)",
    accent: "#fda4af",
    accentSoft: "rgba(253, 164, 175, 0.35)",
    accentHairline: "rgba(253, 164, 175, 0.15)",
    starColor: (op) => `rgba(255, 225, 235, ${op})`,
    crossColor: (op) => `rgba(253, 164, 175, ${op})`,
    titleGradLight: "#ffe4e6",
    nameGradLight: "#fecdd3",
  },
  SAPPHIRE: {
    id: "SAPPHIRE",
    name: "Dạ Lam Sapphire",
    shortName: "Dạ Lam",
    tag: "Chữa Lành",
    dotClass: "bg-sky-400",
    glowHex: "rgba(56,189,248,0.8)",
    bgStops: ["#040812", "#0a1324", "#0f1c34", "#050a16"],
    nebula1: "rgba(56, 189, 248, 0.13)",
    nebula2: "rgba(99, 102, 241, 0.11)",
    haloCenter: "rgba(56, 189, 248, 0.38)",
    haloMid: "rgba(99, 102, 241, 0.18)",
    primaryBorder: "#7dd3fc",
    innerBorder: "rgba(186, 230, 253, 0.5)",
    accent: "#7dd3fc",
    accentSoft: "rgba(125, 211, 252, 0.35)",
    accentHairline: "rgba(125, 211, 252, 0.15)",
    starColor: (op) => `rgba(224, 242, 254, ${op})`,
    crossColor: (op) => `rgba(125, 211, 252, ${op})`,
    titleGradLight: "#e0f2fe",
    nameGradLight: "#bae6fd",
  },
  EMERALD: {
    id: "EMERALD",
    name: "Lục Bảo Emerald",
    shortName: "Lục Bảo",
    tag: "Tài Lộc",
    dotClass: "bg-emerald-400",
    glowHex: "rgba(52,211,153,0.8)",
    bgStops: ["#040c08", "#0a1b12", "#0f261a", "#050f0a"],
    nebula1: "rgba(52, 211, 153, 0.13)",
    nebula2: "rgba(16, 185, 129, 0.1)",
    haloCenter: "rgba(52, 211, 153, 0.38)",
    haloMid: "rgba(16, 185, 129, 0.18)",
    primaryBorder: "#6ee7b7",
    innerBorder: "rgba(167, 243, 208, 0.5)",
    accent: "#6ee7b7",
    accentSoft: "rgba(110, 231, 183, 0.35)",
    accentHairline: "rgba(110, 231, 183, 0.15)",
    starColor: (op) => `rgba(209, 250, 229, ${op})`,
    crossColor: (op) => `rgba(110, 231, 183, ${op})`,
    titleGradLight: "#d1fae5",
    nameGradLight: "#a7f3d0",
  },
  SILVER: {
    id: "SILVER",
    name: "Trăng Bạc Khuyết",
    shortName: "Trăng Bạc",
    tag: "Minh Triết",
    dotClass: "bg-slate-300",
    glowHex: "rgba(203,213,225,0.8)",
    bgStops: ["#08090d", "#12141c", "#1a1d26", "#0a0b0f"],
    nebula1: "rgba(226, 232, 240, 0.1)",
    nebula2: "rgba(148, 163, 184, 0.08)",
    haloCenter: "rgba(226, 232, 240, 0.35)",
    haloMid: "rgba(148, 163, 184, 0.15)",
    primaryBorder: "#cbd5e1",
    innerBorder: "rgba(241, 245, 249, 0.5)",
    accent: "#e2e8f0",
    accentSoft: "rgba(203, 213, 225, 0.35)",
    accentHairline: "rgba(203, 213, 225, 0.15)",
    starColor: (op) => `rgba(248, 250, 252, ${op})`,
    crossColor: (op) => `rgba(226, 232, 240, ${op})`,
    titleGradLight: "#ffffff",
    nameGradLight: "#f1f5f9",
  },
};

const ZODIAC_NAMES: Record<string, string> = {
  ARIES: "Bạch Dương ♈",
  TAURUS: "Kim Ngưu ♉",
  GEMINI: "Song Tử ♊",
  CANCER: "Cự Giải ♋",
  LEO: "Sư Tử ♌",
  VIRGO: "Xử Nữ ♍",
  LIBRA: "Thiên Bình ♎",
  SCORPIO: "Bọ Cạp ♏",
  SAGITTARIUS: "Nhân Mã ♐",
  CAPRICORN: "Ma Kết ♑",
  AQUARIUS: "Bảo Bình ♒",
  PISCES: "Song Ngư ♓",
};

// Hàm trích xuất đúng 1 câu đúc kết từ bài luận giải AI của quẻ bài
function extractAiConclusionQuote(
  reading: CreateReadingResponse | ReadingDetailResponse
): string {
  const content = reading.initialReading || "";

  if (content.trim()) {
    // 1. Ưu tiên Mục 5: Câu Kết Luận & Lời Đúc Kết Quẻ Bài (do AI reader đúc kết cho quẻ)
    const conclusionMatch = content.match(
      /#{1,3}\s*.*?(?:câu kết luận|lời đúc kết|đúc kết quẻ bài|kết luận quẻ bài|đúc kết|kết luận).*?\n+([\s\S]*?)(?=\n+#{1,3}|$)/i
    );
    if (conclusionMatch && conclusionMatch[1]) {
      const rawLines = conclusionMatch[1]
        .split("\n")
        .map((l) => l.replace(/[*#_`>]/g, "").trim())
        .filter(
          (l) =>
            l.length >= 15 &&
            !l.toLowerCase().startsWith("quy tắc") &&
            !l.toLowerCase().startsWith("lưu ý") &&
            !l.toLowerCase().includes("khoảng 20 đến 35 từ")
        );

      for (const line of rawLines) {
        const quoteMatch = line.match(/["“](.+?)["”]/);
        const candidate = quoteMatch ? quoteMatch[1] : line;
        const cleaned = candidate.replace(/^["“]|["”]$/g, "").trim();
        if (cleaned.length >= 15 && cleaned.length <= 250) {
          return cleaned;
        }
      }
    }

    // 2. Mục 4: Câu Khẳng Định Chữa Lành
    const affirmationMatch = content.match(
      /#{1,3}\s*.*?(?:câu khẳng định|khẳng định chữa lành|khẳng định|affirmation).*?\n+([\s\S]*?)(?=\n+#{1,3}|$)/i
    );
    if (affirmationMatch && affirmationMatch[1]) {
      const rawLines = affirmationMatch[1]
        .split("\n")
        .map((l) => l.replace(/[*#_`>]/g, "").trim())
        .filter(
          (l) =>
            l.length >= 15 &&
            !l.toLowerCase().startsWith("quy tắc") &&
            !l.toLowerCase().startsWith("lưu ý")
        );

      for (const line of rawLines) {
        const quoteMatch = line.match(/["“](.+?)["”]/);
        const candidate = quoteMatch ? quoteMatch[1] : line;
        const cleaned = candidate.replace(/^["“]|["”]$/g, "").trim();
        if (cleaned.length >= 15 && cleaned.length <= 220) {
          return cleaned;
        }
      }
    }

    // 3. Thông Điệp Cốt Lõi / Chuyển Hóa Tâm Thức
    const coreMatches = Array.from(
      content.matchAll(/\*{1,2}(?:Thông Điệp Cốt Lõi|Chuyển Hóa Tâm Thức)\*{1,2}[:\- ]*(.+?)(?=\n|$)/gi)
    );
    for (const m of coreMatches) {
      if (m && m[1]) {
        const cleaned = m[1].replace(/[*#_`>]/g, "").replace(/^["“]|["”]$/g, "").trim();
        if (cleaned.length >= 15 && cleaned.length <= 220) {
          return cleaned;
        }
      }
    }

    // 4. Quét câu văn truyền cảm hứng đắt giá trong bài
    const cleanLines = content
      .split("\n")
      .map((l) => l.replace(/[*#_`>]/g, "").trim())
      .filter(
        (l) =>
          l.length >= 25 &&
          l.length <= 160 &&
          !l.startsWith("http") &&
          !l.startsWith("#")
      );

    for (const line of cleanLines) {
      const lower = line.toLowerCase();
      if (
        (lower.includes("hãy") ||
          lower.includes("tin vào") ||
          lower.includes("trực giác") ||
          lower.includes("vũ trụ") ||
          lower.includes("mở lòng") ||
          lower.includes("bước đi") ||
          lower.includes("chữa lành")) &&
        !lower.includes("chủ đề:") &&
        !lower.includes("cung hoàng đạo:") &&
        !lower.includes("câu hỏi:")
      ) {
        return line.replace(/^["“]|["”]$/g, "").trim();
      }
    }
  }

  // 5. Dự phòng triết lý sâu sắc
  return "Hãy lắng nghe trực giác và tin vào sự dẫn lối của vũ trụ trên hành trình của chính mình.";
}

export const ShareTarotStoryModal: React.FC<ShareTarotStoryModalProps> = ({
  isOpen,
  onClose,
  reading,
  zodiacSign,
}) => {
  const [aspectRatio, setAspectRatio] = useState<AspectRatioMode>("STORY");
  const [theme, setTheme] = useState<ColorTheme>("GOLD");
  const [quote, setQuote] = useState("");
  const [defaultQuote, setDefaultQuote] = useState("");
  const [isEditingQuote, setIsEditingQuote] = useState(false);
  const [isRendering, setIsRendering] = useState(true);
  const [copied, setCopied] = useState(false);
  const [shareSuccess, setShareSuccess] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [isZoomed, setIsZoomed] = useState(false);
  const [zoomImageUrl, setZoomImageUrl] = useState<string | null>(null);

  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const themeDropdownRef = useRef<HTMLDivElement | null>(null);
  const [isThemeDropdownOpen, setIsThemeDropdownOpen] = useState(false);
  const [openUpward, setOpenUpward] = useState(false);

  // Tự động nhận biết không gian màn hình để mở dropdown lên trên hay xuống dưới
  useEffect(() => {
    if (isThemeDropdownOpen && themeDropdownRef.current) {
      const rect = themeDropdownRef.current.getBoundingClientRect();
      const viewportHeight = window.innerHeight;
      const spaceBelow = viewportHeight - rect.bottom;
      const spaceAbove = rect.top;

      // Nếu không gian bên dưới ít hơn 220px và bên trên nhiều hơn, tự động mở ngược lên trên
      if (spaceBelow < 220 && spaceAbove > spaceBelow) {
        setOpenUpward(true);
      } else {
        setOpenUpward(false);
      }
    }
  }, [isThemeDropdownOpen]);

  // Đóng dropdown tông màu khi click ra ngoài
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        themeDropdownRef.current &&
        !themeDropdownRef.current.contains(e.target as Node)
      ) {
        setIsThemeDropdownOpen(false);
      }
    };
    if (isThemeDropdownOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isThemeDropdownOpen]);

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleOpenZoom = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    setZoomImageUrl(canvas.toDataURL("image/png"));
    setIsZoomed(true);
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isZoomed) {
        setIsZoomed(false);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isZoomed]);

  // Khởi tạo câu đúc kết AI khi mở modal
  useEffect(() => {
    if (isOpen && reading) {
      const initial = extractAiConclusionQuote(reading);
      setQuote(initial);
      setDefaultQuote(initial);
      setIsEditingQuote(false);
    }
  }, [isOpen, reading]);

  // Tiện ích vẽ hình chữ nhật bo góc
  const roundRect = (
    ctx: CanvasRenderingContext2D,
    x: number,
    y: number,
    w: number,
    h: number,
    r: number
  ) => {
    ctx.beginPath();
    ctx.moveTo(x + r, y);
    ctx.lineTo(x + w - r, y);
    ctx.quadraticCurveTo(x + w, y, x + w, y + r);
    ctx.lineTo(x + w, y + h - r);
    ctx.quadraticCurveTo(x + w, y + h, x + w - r, y + h);
    ctx.lineTo(x + r, y + h);
    ctx.quadraticCurveTo(x, y + h, x, y + h - r);
    ctx.lineTo(x, y + r);
    ctx.quadraticCurveTo(x, y, x + r, y);
    ctx.closePath();
  };

  // Tiện ích bẻ dòng chữ tiếng Việt mượt mà trên Canvas
  const wrapText = (
    ctx: CanvasRenderingContext2D,
    text: string,
    x: number,
    y: number,
    maxWidth: number,
    lineHeight: number,
    maxLines: number = 3
  ) => {
    const words = text.split(" ");
    let line = "";
    const lines: string[] = [];

    for (let n = 0; n < words.length; n++) {
      const testLine = line + words[n] + " ";
      const metrics = ctx.measureText(testLine);
      const testWidth = metrics.width;
      if (testWidth > maxWidth && n > 0) {
        lines.push(line);
        line = words[n] + " ";
      } else {
        line = testLine;
      }
    }
    lines.push(line);

    const displayLines = lines.slice(0, maxLines);
    if (lines.length > maxLines && displayLines.length > 0) {
      displayLines[displayLines.length - 1] =
        displayLines[displayLines.length - 1].trim() + "...";
    }

    const startY = y - ((displayLines.length - 1) * lineHeight) / 2;
    displayLines.forEach((l, i) => {
      ctx.fillText(l.trim(), x, startY + i * lineHeight);
    });
  };

  const getShortPositionName = (name?: string, idx?: number): string => {
    if (!name) return `Lá ${idx !== undefined ? idx + 1 : ""}`;
    const l = name.toLowerCase();
    if (l.includes("quá khứ") || l.includes("past")) return "Quá Khứ";
    if (l.includes("hiện tại") || l.includes("present")) return "Hiện Tại";
    if (l.includes("tương lai") || l.includes("future")) return "Tương Lai";
    return name;
  };

  // Vẽ khung viền nghệ thuật quanh toàn bộ canvas (Ornate Celestial Border)
  const drawCelestialBorder = (
    ctx: CanvasRenderingContext2D,
    w: number,
    h: number,
    goldColor: string,
    innerGoldColor: string
  ) => {
    const pad = 36;
    const innerPad = 46;

    ctx.save();
    // Viền chính ngoài
    ctx.strokeStyle = goldColor;
    ctx.lineWidth = 1.5;
    ctx.strokeRect(pad, pad, w - pad * 2, h - pad * 2);

    // Viền mảnh bên trong
    ctx.strokeStyle = innerGoldColor;
    ctx.lineWidth = 1;
    ctx.strokeRect(innerPad, innerPad, w - innerPad * 2, h - innerPad * 2);

    // Họa tiết góc 4 đỉnh: Ngôi sao 4 cánh ✦
    const corners = [
      { x: pad, y: pad },
      { x: w - pad, y: pad },
      { x: pad, y: h - pad },
      { x: w - pad, y: h - pad },
    ];

    ctx.fillStyle = goldColor;
    ctx.font = "16px sans-serif";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    corners.forEach((c) => {
      ctx.fillText("✦", c.x, c.y);
    });

    ctx.restore();
  };

  // Vẽ lá bài với hào quang phát sáng và viền đôi kim loại quý phái
  const drawCardWithGlow = (
    ctx: CanvasRenderingContext2D,
    img: HTMLImageElement | null,
    card: DrawnCardDto,
    x: number,
    y: number,
    w: number,
    h: number,
    themeCfg: ThemeConfig
  ) => {
    const radius = 14;
    const cx = x + w / 2;
    const cy = y + h / 2;

    ctx.save();

    // 1. Quầng sáng hào quang huyền ảo tỏa ra phía sau lá bài (Ethereal Halo)
    const haloRadius = Math.max(w, h) * 0.75;
    const halo = ctx.createRadialGradient(cx, cy, w * 0.2, cx, cy, haloRadius);
    halo.addColorStop(0, themeCfg.haloCenter);
    halo.addColorStop(0.45, themeCfg.haloMid);
    halo.addColorStop(1, "rgba(0, 0, 0, 0)");

    ctx.fillStyle = halo;
    ctx.fillRect(cx - haloRadius, cy - haloRadius, haloRadius * 2, haloRadius * 2);

    // 2. Bóng đổ sâu 3D phía sau lá bài
    ctx.shadowColor = "rgba(0, 0, 0, 0.9)";
    ctx.shadowBlur = 38;
    ctx.shadowOffsetX = 0;
    ctx.shadowOffsetY = 20;

    // Nền đáy thẻ bài
    roundRect(ctx, x, y, w, h, radius);
    ctx.fillStyle = "#121318";
    ctx.fill();

    // Tắt bóng trước khi vẽ ảnh
    ctx.shadowColor = "transparent";

    // 3. Clip và vẽ ảnh thẻ bài
    ctx.save();
    roundRect(ctx, x, y, w, h, radius);
    ctx.clip();

    if (img) {
      if (card.isReversed) {
        ctx.translate(cx, cy);
        ctx.rotate(Math.PI);
        ctx.drawImage(img, -w / 2, -h / 2, w, h);
      } else {
        ctx.drawImage(img, x, y, w, h);
      }
    } else {
      ctx.fillStyle = "#1a1b22";
      ctx.fillRect(x, y, w, h);
    }
    ctx.restore();

    // 4. Viền mạ kim loại kép tinh tế (Double Inset Metallic Border)
    roundRect(ctx, x, y, w, h, radius);
    ctx.strokeStyle = themeCfg.primaryBorder;
    ctx.lineWidth = 2.5;
    ctx.stroke();

    roundRect(ctx, x + 4, y + 4, w - 8, h - 8, radius - 2);
    ctx.strokeStyle = themeCfg.innerBorder;
    ctx.lineWidth = 1;
    ctx.stroke();

    ctx.restore();
  };

  // Vẽ toàn bộ Canvas
  const renderCanvas = useCallback(async () => {
    const canvas = canvasRef.current;
    if (!canvas || !reading) return;

    setIsRendering(true);
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Đảm bảo font chữ đã sẵn sàng
    if (typeof document !== "undefined" && document.fonts) {
      await document.fonts.ready;
    }

    const isStory = aspectRatio === "STORY";
    const width = 1080;
    const height = isStory ? 1920 : 1080;

    canvas.width = width;
    canvas.height = height;

    const serifFont = '"Playfair Display", Georgia, "Times New Roman", serif';
    const sansFont = 'system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';

    // Theme palette
    const cfg = THEME_CONFIGS[theme] || THEME_CONFIGS.GOLD;
    const goldAccent = cfg.accent;
    const goldSoft = cfg.accentSoft;
    const goldHairline = cfg.accentHairline;

    // 1. Nền chuyển sắc huyền bí sâu thẳm
    const bgGrad = ctx.createLinearGradient(0, 0, width * 0.7, height);
    bgGrad.addColorStop(0, cfg.bgStops[0]);
    bgGrad.addColorStop(0.3, cfg.bgStops[1]);
    bgGrad.addColorStop(0.7, cfg.bgStops[2]);
    bgGrad.addColorStop(1, cfg.bgStops[3]);
    ctx.fillStyle = bgGrad;
    ctx.fillRect(0, 0, width, height);

    // 2. Mây bụi tinh vân (Nebula Aura)
    ctx.save();
    const nebula1 = ctx.createRadialGradient(width * 0.2, height * 0.3, 50, width * 0.2, height * 0.3, 450);
    nebula1.addColorStop(0, cfg.nebula1);
    nebula1.addColorStop(1, "rgba(0, 0, 0, 0)");
    ctx.fillStyle = nebula1;
    ctx.fillRect(0, 0, width, height);

    const nebula2 = ctx.createRadialGradient(width * 0.8, height * 0.7, 50, width * 0.8, height * 0.7, 500);
    nebula2.addColorStop(0, cfg.nebula2);
    nebula2.addColorStop(1, "rgba(0, 0, 0, 0)");
    ctx.fillStyle = nebula2;
    ctx.fillRect(0, 0, width, height);
    ctx.restore();

    // 3. Vì sao lấp lánh (Stardust Particles)
    const starCount = isStory ? 85 : 55;
    for (let i = 0; i < starCount; i++) {
      const x = (i * 149.3) % (width - 100) + 50;
      const y = (i * 283.7) % (height - 100) + 50;
      const radius = (i % 4 === 0 ? 2.2 : 1.2) * (0.8 + (i % 3) / 8);
      const opacity = 0.3 + ((i % 5) / 10) * 0.6;

      ctx.beginPath();
      ctx.arc(x, y, radius, 0, Math.PI * 2);
      ctx.fillStyle = cfg.starColor(opacity);
      ctx.fill();

      // Một vài ngôi sao có tia sáng ✦
      if (i % 12 === 0) {
        ctx.font = "14px sans-serif";
        ctx.fillStyle = cfg.crossColor(opacity * 0.8);
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        ctx.fillText("✦", x, y);
      }
    }

    // 4. Khung viền toàn cảnh nghệ thuật (Celestial Frame)
    drawCelestialBorder(ctx, width, height, goldSoft, goldHairline);

    // 5. Header: Logo & Ngày tháng & Cung hoàng đạo
    ctx.textAlign = "center";
    ctx.textBaseline = "alphabetic";

    if (isStory) {
      // === LAYOUT 9:16 (STORY ĐẲNG CẤP) ===
      const topY = 120;

      // Biểu tượng thiên thể
      ctx.font = "24px sans-serif";
      ctx.fillStyle = goldAccent;
      ctx.fillText("✦   ☾   ✦", width / 2, topY);

      // Thương hiệu NYXORIS TAROT với hiệu ứng mạ vàng lấp lánh
      const titleGrad = ctx.createLinearGradient(0, topY + 15, 0, topY + 55);
      titleGrad.addColorStop(0, "#ffffff");
      titleGrad.addColorStop(0.5, cfg.titleGradLight);
      titleGrad.addColorStop(1, goldAccent);

      ctx.font = `bold 36px ${serifFont}`;
      ctx.fillStyle = titleGrad;
      ctx.letterSpacing = "8px";
      ctx.fillText("NYXORIS  TAROT", width / 2, topY + 52);

      // Ngày tháng & Cung Hoàng Đạo
      const dateStr = new Date(reading.createdAt || Date.now()).toLocaleDateString("vi-VN", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
      });
      const zodiacStr = zodiacSign ? ZODIAC_NAMES[zodiacSign] || "" : "";
      const metaStr = [dateStr, zodiacStr].filter(Boolean).join("   •   ");

      ctx.font = `500 18px ${sansFont}`;
      ctx.fillStyle = "rgba(220, 225, 240, 0.75)";
      ctx.letterSpacing = "2px";
      ctx.fillText(metaStr, width / 2, topY + 90);

      // Câu hỏi người dùng (nếu có)
      if (reading.userQuestion && reading.userQuestion.trim()) {
        const qText = `“${reading.userQuestion.trim()}”`;
        ctx.font = `italic 22px ${serifFont}`;
        ctx.fillStyle = "#f5ebd0";
        ctx.letterSpacing = "0.5px";
        wrapText(ctx, qText, width / 2, topY + 145, width - 240, 32, 2);
      }

      // Tải và vẽ các lá bài
      const drawnCards = reading.drawnCards || [];
      const isSingle = drawnCards.length === 1;

      const loadedImages = await Promise.all(
        drawnCards.map((c) => {
          const src = c.imageUrl || c.card?.imageUrl || "/cards/card-back.jpg";
          return new Promise<{ img: HTMLImageElement | null; card: DrawnCardDto }>((resolve) => {
            const img = new Image();
            img.crossOrigin = "anonymous";
            img.src = src;
            img.onload = () => resolve({ img, card: c });
            img.onerror = () => resolve({ img: null, card: c });
          });
        })
      );

      if (isSingle) {
        // --- 1 LÁ BÀI DUY NHẤT Ở TRUNG TÂM (DAILY ORACLE) ---
        const { img, card } = loadedImages[0];
        const cardW = 460;
        const cardH = Math.round(cardW * 1.68);
        const cardX = (width - cardW) / 2;
        const cardY = reading.userQuestion ? 350 : 320;

        drawCardWithGlow(ctx, img, card, cardX, cardY, cardW, cardH, cfg);

        // Thông tin lá bài
        const infoY = cardY + cardH + 50;

        // Trạng thái Thuận / Ngược
        const statusText = card.isReversed ? "✦  NGƯỢC • REVERSED  ✦" : "✦  THUẬN • UPRIGHT  ✦";
        ctx.font = `bold 16px ${sansFont}`;
        ctx.fillStyle = card.isReversed ? "#fb7185" : goldAccent;
        ctx.letterSpacing = "3px";
        ctx.fillText(statusText, width / 2, infoY);

        // Tên tiếng Việt lớn
        const nameVi = (card.nameVi || card.card?.nameVi || "Lá Bài").toUpperCase();
        const nameGrad = ctx.createLinearGradient(0, infoY + 15, 0, infoY + 55);
        nameGrad.addColorStop(0, "#ffffff");
        nameGrad.addColorStop(1, cfg.nameGradLight);

        ctx.font = `bold 42px ${serifFont}`;
        ctx.fillStyle = nameGrad;
        ctx.letterSpacing = "2px";
        ctx.fillText(nameVi, width / 2, infoY + 52);

        // Tên tiếng Anh thanh mảnh
        const nameEn = card.nameEn || card.card?.nameEn || "";
        if (nameEn) {
          ctx.font = `italic 22px ${serifFont}`;
          ctx.fillStyle = "rgba(225, 230, 245, 0.75)";
          ctx.letterSpacing = "1px";
          ctx.fillText(nameEn, width / 2, infoY + 86);
        }

        // Hộp trích dẫn thông điệp (Affirmation Box)
        if (quote && quote.trim()) {
          const quoteW = 900;
          const quoteH = 210;
          const quoteX = (width - quoteW) / 2;
          const quoteY = 1420;

          // Nền kính đen mờ sang trọng
          ctx.save();
          roundRect(ctx, quoteX, quoteY, quoteW, quoteH, 20);
          ctx.fillStyle = "rgba(16, 18, 28, 0.75)";
          ctx.fill();
          ctx.strokeStyle = goldSoft;
          ctx.lineWidth = 1.2;
          ctx.stroke();

          // Dấu ngoặc kép mạ vàng
          ctx.font = `italic bold 44px ${serifFont}`;
          ctx.fillStyle = goldAccent;
          ctx.fillText("“", quoteX + 45, quoteY + 52);

          // Nội dung câu trích dẫn
          ctx.font = `italic 23px ${serifFont}`;
          ctx.fillStyle = "#f8f6ee";
          ctx.letterSpacing = "0.3px";
          wrapText(ctx, quote.trim(), width / 2, quoteY + 85, quoteW - 100, 36, 3);
          ctx.restore();
        }
      } else {
        // --- 3 LÁ BÀI ĐỐI XỨNG TUYỆT ĐẸP ---
        const count = Math.min(drawnCards.length, 3);
        const cardW = 280;
        const cardH = Math.round(cardW * 1.68);
        const gap = 35;
        const totalW = count * cardW + (count - 1) * gap;
        const startX = (width - totalW) / 2;
        const cardY = reading.userQuestion ? 390 : 350;

        loadedImages.slice(0, count).forEach(({ img, card }, idx) => {
          const currentX = startX + idx * (cardW + gap);

          // Nhãn vị trí trên đầu
          const posName = getShortPositionName(card.positionName, idx);
          ctx.textAlign = "center";
          ctx.font = `bold 16px ${sansFont}`;
          ctx.fillStyle = goldAccent;
          ctx.letterSpacing = "2px";
          ctx.fillText(posName.toUpperCase(), currentX + cardW / 2, cardY - 20);

          drawCardWithGlow(ctx, img, card, currentX, cardY, cardW, cardH, cfg);

          // Tên lá bài dưới
          const nameVi = card.nameVi || card.card?.nameVi || `Lá ${idx + 1}`;
          ctx.font = `bold 20px ${serifFont}`;
          ctx.fillStyle = "#ffffff";
          ctx.letterSpacing = "0.5px";
          ctx.fillText(nameVi, currentX + cardW / 2, cardY + cardH + 34);

          const revText = card.isReversed ? "✦ Ngược" : "✦ Thuận";
          ctx.font = `14px ${sansFont}`;
          ctx.fillStyle = card.isReversed ? "#fb7185" : goldAccent;
          ctx.fillText(revText, currentX + cardW / 2, cardY + cardH + 58);
        });

        // Hộp trích dẫn bên dưới 3 lá
        if (quote && quote.trim()) {
          const quoteW = 900;
          const quoteH = 200;
          const quoteX = (width - quoteW) / 2;
          const quoteY = 1420;

          ctx.save();
          roundRect(ctx, quoteX, quoteY, quoteW, quoteH, 20);
          ctx.fillStyle = "rgba(16, 18, 28, 0.75)";
          ctx.fill();
          ctx.strokeStyle = goldSoft;
          ctx.lineWidth = 1.2;
          ctx.stroke();

          ctx.font = `italic bold 44px ${serifFont}`;
          ctx.fillStyle = goldAccent;
          ctx.fillText("“", quoteX + 45, quoteY + 52);

          ctx.font = `italic 23px ${serifFont}`;
          ctx.fillStyle = "#f8f6ee";
          ctx.letterSpacing = "0.3px";
          wrapText(ctx, quote.trim(), width / 2, quoteY + 85, quoteW - 100, 36, 3);
          ctx.restore();
        }
      }

      // Footer
      const footerY = 1770;
      ctx.font = "14px sans-serif";
      ctx.fillStyle = goldSoft;
      ctx.fillText("✦ • ────────── ✤ ────────── • ✦", width / 2, footerY);

      ctx.font = `bold 20px ${sansFont}`;
      ctx.fillStyle = goldAccent;
      ctx.letterSpacing = "3px";
      ctx.fillText("tarot.nyxoris.com", width / 2, footerY + 36);

      ctx.font = `14px ${sansFont}`;
      ctx.fillStyle = "rgba(190, 200, 220, 0.65)";
      ctx.letterSpacing = "1.5px";
      ctx.fillText("Lắng Nghe Thông Điệp Từ Những Vì Sao", width / 2, footerY + 62);
    } else {
      // === LAYOUT 1:1 (VUÔNG - BỐ CỤC CHUẨN TỪNG MILIMÉT, KHÔNG BAO GIỜ BỊ ĐÈ CHỮ) ===
      const topY = 75;

      // Biểu tượng & Thương hiệu
      ctx.font = `bold 28px ${serifFont}`;
      ctx.fillStyle = goldAccent;
      ctx.letterSpacing = "6px";
      ctx.fillText("✦  NYXORIS TAROT  ✦", width / 2, topY);

      const dateStr = new Date(reading.createdAt || Date.now()).toLocaleDateString("vi-VN", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
      });
      const zodiacStr = zodiacSign ? ZODIAC_NAMES[zodiacSign] || "" : "";
      const metaStr = [dateStr, zodiacStr].filter(Boolean).join("   •   ");

      ctx.font = `500 15px ${sansFont}`;
      ctx.fillStyle = "rgba(220, 225, 240, 0.7)";
      ctx.letterSpacing = "1.5px";
      ctx.fillText(metaStr, width / 2, topY + 32);

      const drawnCards = reading.drawnCards || [];
      const isSingle = drawnCards.length === 1;

      const loadedImages = await Promise.all(
        drawnCards.map((c) => {
          const src = c.imageUrl || c.card?.imageUrl || "/cards/card-back.jpg";
          return new Promise<{ img: HTMLImageElement | null; card: DrawnCardDto }>((resolve) => {
            const img = new Image();
            img.crossOrigin = "anonymous";
            img.src = src;
            img.onload = () => resolve({ img, card: c });
            img.onerror = () => resolve({ img: null, card: c });
          });
        })
      );

      if (isSingle) {
        // --- 1 LÁ BÀI TRONG KHUNG VUÔNG ---
        // Chiều cao thẻ bài: 420px (bắt đầu từ Y = 150 -> kết thúc ở Y = 570)
        const { img, card } = loadedImages[0];
        const cardW = 250;
        const cardH = Math.round(cardW * 1.68); // ~420px
        const cardX = (width - cardW) / 2;
        const cardY = 150;

        drawCardWithGlow(ctx, img, card, cardX, cardY, cardW, cardH, cfg);

        // Thông tin lá bài ngay dưới thẻ bài: Y = 615 -> 685 (hoàn toàn tách biệt)
        const infoY = cardY + cardH + 36; // 150 + 420 + 36 = 606

        const statusText = card.isReversed ? "✦  NGƯỢC • REVERSED  ✦" : "✦  THUẬN • UPRIGHT  ✦";
        ctx.font = `bold 14px ${sansFont}`;
        ctx.fillStyle = card.isReversed ? "#fb7185" : goldAccent;
        ctx.letterSpacing = "2px";
        ctx.fillText(statusText, width / 2, infoY);

        const nameVi = (card.nameVi || card.card?.nameVi || "Lá Bài").toUpperCase();
        ctx.font = `bold 32px ${serifFont}`;
        ctx.fillStyle = "#ffffff";
        ctx.letterSpacing = "1.5px";
        ctx.fillText(nameVi, width / 2, infoY + 38);

        const nameEn = card.nameEn || card.card?.nameEn || "";
        if (nameEn) {
          ctx.font = `italic 17px ${serifFont}`;
          ctx.fillStyle = "rgba(225, 230, 245, 0.7)";
          ctx.letterSpacing = "0.5px";
          ctx.fillText(nameEn, width / 2, infoY + 64);
        }

        // Hộp trích dẫn thông điệp: Y = 740 -> 900 (rộng 920px, cao 160px)
        if (quote && quote.trim()) {
          const quoteW = 900;
          const quoteH = 155;
          const quoteX = (width - quoteW) / 2;
          const quoteY = 730;

          ctx.save();
          roundRect(ctx, quoteX, quoteY, quoteW, quoteH, 18);
          ctx.fillStyle = "rgba(16, 18, 28, 0.75)";
          ctx.fill();
          ctx.strokeStyle = goldSoft;
          ctx.lineWidth = 1.2;
          ctx.stroke();

          ctx.font = `italic bold 36px ${serifFont}`;
          ctx.fillStyle = goldAccent;
          ctx.fillText("“", quoteX + 40, quoteY + 44);

          ctx.font = `italic 19px ${serifFont}`;
          ctx.fillStyle = "#f8f6ee";
          ctx.letterSpacing = "0.2px";
          wrapText(ctx, quote.trim(), width / 2, quoteY + 68, quoteW - 80, 30, 3);
          ctx.restore();
        }
      } else {
        // --- 3 LÁ BÀI TRONG KHUNG VUÔNG ---
        const count = Math.min(drawnCards.length, 3);
        const cardW = 220;
        const cardH = Math.round(cardW * 1.68); // ~370px
        const gap = 25;
        const totalW = count * cardW + (count - 1) * gap;
        const startX = (width - totalW) / 2;
        const cardY = 175;

        loadedImages.slice(0, count).forEach(({ img, card }, idx) => {
          const currentX = startX + idx * (cardW + gap);

          const posName = getShortPositionName(card.positionName, idx);
          ctx.textAlign = "center";
          ctx.font = `bold 14px ${sansFont}`;
          ctx.fillStyle = goldAccent;
          ctx.letterSpacing = "1.5px";
          ctx.fillText(posName.toUpperCase(), currentX + cardW / 2, cardY - 14);

          drawCardWithGlow(ctx, img, card, currentX, cardY, cardW, cardH, cfg);

          const nameVi = card.nameVi || card.card?.nameVi || `Lá ${idx + 1}`;
          ctx.font = `bold 17px ${serifFont}`;
          ctx.fillStyle = "#ffffff";
          ctx.fillText(nameVi, currentX + cardW / 2, cardY + cardH + 28);

          const revText = card.isReversed ? "✦ Ngược" : "✦ Thuận";
          ctx.font = `13px ${sansFont}`;
          ctx.fillStyle = card.isReversed ? "#fb7185" : goldAccent;
          ctx.fillText(revText, currentX + cardW / 2, cardY + cardH + 48);
        });

        // Hộp trích dẫn bên dưới
        if (quote && quote.trim()) {
          const quoteW = 900;
          const quoteH = 150;
          const quoteX = (width - quoteW) / 2;
          const quoteY = 730;

          ctx.save();
          roundRect(ctx, quoteX, quoteY, quoteW, quoteH, 18);
          ctx.fillStyle = "rgba(16, 18, 28, 0.75)";
          ctx.fill();
          ctx.strokeStyle = goldSoft;
          ctx.lineWidth = 1.2;
          ctx.stroke();

          ctx.font = `italic bold 36px ${serifFont}`;
          ctx.fillStyle = goldAccent;
          ctx.fillText("“", quoteX + 40, quoteY + 44);

          ctx.font = `italic 19px ${serifFont}`;
          ctx.fillStyle = "#f8f6ee";
          wrapText(ctx, quote.trim(), width / 2, quoteY + 68, quoteW - 80, 30, 3);
          ctx.restore();
        }
      }

      // Footer
      const footerY = 965;
      ctx.font = "13px sans-serif";
      ctx.fillStyle = goldSoft;
      ctx.fillText("✦ • ────────── ✤ ────────── • ✦", width / 2, footerY);

      ctx.font = `bold 18px ${sansFont}`;
      ctx.fillStyle = goldAccent;
      ctx.letterSpacing = "2px";
      ctx.fillText("tarot.nyxoris.com", width / 2, footerY + 30);

      ctx.font = `13px ${sansFont}`;
      ctx.fillStyle = "rgba(190, 200, 220, 0.65)";
      ctx.fillText("Lắng Nghe Thông Điệp Từ Những Vì Sao", width / 2, footerY + 52);
    }

    setIsRendering(false);
  }, [aspectRatio, theme, quote, reading, zodiacSign]);

  // Tự động render lại khi state thay đổi
  useEffect(() => {
    if (isOpen) {
      renderCanvas();
    }
  }, [isOpen, renderCanvas]);

  // Tải ảnh về máy
  const handleDownload = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    canvas.toBlob((blob) => {
      if (!blob) return;
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `nyxoris-tarot-${aspectRatio.toLowerCase()}-${theme.toLowerCase()}-${Date.now()}.png`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    }, "image/png");
  };

  // Sao chép ảnh vào Clipboard
  const handleCopyImage = async () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    try {
      canvas.toBlob(async (blob) => {
        if (!blob) return;
        if (typeof ClipboardItem !== "undefined") {
          await navigator.clipboard.write([
            new ClipboardItem({ "image/png": blob }),
          ]);
          setCopied(true);
          setTimeout(() => setCopied(false), 3000);
        } else {
          handleDownload();
        }
      }, "image/png");
    } catch (err) {
      console.error("Không thể copy ảnh vào bộ nhớ tạm:", err);
      handleDownload();
    }
  };

  // Chia sẻ di động (Web Share API)
  const handleShare = async () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    try {
      canvas.toBlob(async (blob) => {
        if (!blob) return;
        const file = new File(
          [blob],
          `nyxoris-tarot-${aspectRatio.toLowerCase()}.png`,
          { type: "image/png" }
        );

        if (
          typeof navigator !== "undefined" &&
          navigator.canShare &&
          navigator.canShare({ files: [file] })
        ) {
          await navigator.share({
            title: "Quẻ Bài Tarot Của Tôi - Nyxoris",
            text: "Xem thông điệp bài Tarot tại tarot.nyxoris.com",
            files: [file],
          });
          setShareSuccess(true);
          setTimeout(() => setShareSuccess(false), 3000);
        } else {
          handleDownload();
        }
      }, "image/png");
    } catch (err) {
      console.error("Share error:", err);
    }
  };

  if (!isOpen || !mounted) return null;

  const modalContent = (
    <AnimatePresence>
      <div className="fixed inset-0 z-[999999] flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/85 backdrop-blur-md"
          onClick={onClose}
        />

        {/* Modal Card */}
        <motion.div
          initial={{ scale: 0.94, opacity: 0, y: 15 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.94, opacity: 0, y: 15 }}
          className="relative w-full max-w-4xl my-auto max-h-[94vh] overflow-y-auto rounded-3xl border border-[#2e303a] bg-[#14151a] p-4 sm:p-6 shadow-[0_25px_70px_rgba(0,0,0,0.95)] z-[1000000] flex flex-col md:flex-row gap-6"
        >
          {/* Close button */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 rounded-full text-zinc-400 hover:text-zinc-100 hover:bg-white/5 transition cursor-pointer z-20"
            title="Đóng"
          >
            <X className="w-5 h-5" />
          </button>

          {/* CỘT TRÁI: LIVE CANVAS PREVIEW */}
          <div className="flex-1 flex flex-col items-center justify-center min-h-[380px] sm:min-h-[500px] bg-[#090a0e] rounded-2xl p-4 border border-white/5 relative">
            {isRendering && (
              <div className="absolute inset-0 bg-black/60 backdrop-blur-xs flex flex-col items-center justify-center gap-2 z-10 rounded-2xl">
                <Loader2 className="w-7 h-7 text-amber-400 animate-spin" />
                <span className="text-xs text-zinc-300 font-medium">
                  Đang khởi tạo hình ảnh vũ trụ...
                </span>
              </div>
            )}

            {/* Canvas Preview có tính năng click để phóng to */}
            <div
              onClick={handleOpenZoom}
              className="relative group cursor-zoom-in flex items-center justify-center"
              title="Bấm vào ảnh để phóng to toàn màn hình"
            >
              <canvas
                ref={canvasRef}
                className={`max-h-[58vh] sm:max-h-[66vh] w-auto rounded-xl shadow-[0_15px_45px_rgba(0,0,0,0.85)] border border-amber-400/40 object-contain transition-all duration-300 group-hover:scale-[1.015] group-hover:border-amber-300 ${
                  aspectRatio === "STORY" ? "aspect-[9/16]" : "aspect-square"
                }`}
              />

              {/* Hover Overlay Badge */}
              <div className="absolute inset-0 rounded-xl bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center pointer-events-none">
                <span className="px-3.5 py-1.5 rounded-full bg-black/85 border border-amber-400/60 text-amber-200 text-xs font-semibold flex items-center gap-2 shadow-2xl backdrop-blur-sm transform group-hover:scale-105 transition-transform">
                  <ZoomIn className="w-4 h-4 text-amber-400" />
                  <span>Bấm để phóng to</span>
                </span>
              </div>
            </div>

            <button
              type="button"
              onClick={handleOpenZoom}
              className="text-[11px] text-zinc-400 hover:text-amber-300 transition-colors mt-2.5 flex items-center gap-1.5 font-medium cursor-pointer"
            >
              <ZoomIn className="w-3.5 h-3.5 text-amber-400" />
              <span>Bấm vào ảnh để phóng to toàn màn hình</span>
            </button>
          </div>

          {/* CỘT PHẢI: BỘ ĐIỀU KHIỂN & TÙY CHỌN */}
          <div className="w-full md:w-80 flex flex-col justify-between space-y-4">
            <div>
              <div className="flex items-center gap-2 mb-1 text-amber-300 font-bold text-base">
                <Sparkles className="w-5 h-5" />
                <span>Xuất Ảnh Quẻ Bài</span>
              </div>
              <p className="text-xs text-zinc-400 mb-4 whitespace-nowrap overflow-hidden text-ellipsis">
                Tạo ảnh quẻ bài Tarot để lưu giữ hoặc chia sẻ.
              </p>

              {/* 1. Chọn định dạng ảnh */}
              <div className="space-y-1.5 mb-3.5">
                <label className="text-xs font-semibold text-zinc-200">
                  Định dạng ảnh:
                </label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setAspectRatio("STORY")}
                    className={`py-2 px-3 rounded-xl border text-xs font-medium flex items-center justify-center gap-2 transition cursor-pointer ${
                      aspectRatio === "STORY"
                        ? "border-amber-400 bg-amber-400/15 text-amber-200 font-bold shadow-sm"
                        : "border-[#2e303a] bg-[#1d1e24] text-zinc-400 hover:text-zinc-200"
                    }`}
                  >
                    <Smartphone className="w-4 h-4" />
                    <span>Story (9:16)</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setAspectRatio("SQUARE")}
                    className={`py-2 px-3 rounded-xl border text-xs font-medium flex items-center justify-center gap-2 transition cursor-pointer ${
                      aspectRatio === "SQUARE"
                        ? "border-amber-400 bg-amber-400/15 text-amber-200 font-bold shadow-sm"
                        : "border-[#2e303a] bg-[#1d1e24] text-zinc-400 hover:text-zinc-200"
                    }`}
                  >
                    <Square className="w-4 h-4" />
                    <span>Vuông (1:1)</span>
                  </button>
                </div>
              </div>

              {/* 2. Chọn tông màu nghệ thuật (Color Theme Dropdown) */}
              <div className="space-y-1.5 mb-3.5 relative" ref={themeDropdownRef}>
                <label className="text-xs font-semibold text-zinc-200 flex items-center gap-1.5">
                  <Palette className="w-3.5 h-3.5 text-amber-400" />
                  <span>Tông màu vũ trụ:</span>
                </label>

                {/* Dropdown Trigger */}
                <button
                  type="button"
                  onClick={() => setIsThemeDropdownOpen(!isThemeDropdownOpen)}
                  className={`w-full flex items-center justify-between gap-2.5 px-3 py-2.5 rounded-xl border text-xs font-medium transition-all cursor-pointer select-none ${
                    isThemeDropdownOpen
                      ? "border-amber-400/90 bg-[#22242c] shadow-md shadow-black/60 ring-1 ring-amber-400/40 text-white"
                      : "border-[#2e303a] bg-[#1d1e24] text-zinc-200 hover:border-zinc-500 hover:bg-[#23252d]"
                  }`}
                >
                  <div className="flex items-center gap-2.5 min-w-0">
                    <span
                      className={`w-3 h-3 rounded-full shrink-0 ${THEME_CONFIGS[theme]?.dotClass}`}
                      style={{ boxShadow: `0 0 10px ${THEME_CONFIGS[theme]?.glowHex}` }}
                    />
                    <span className="font-semibold text-zinc-100 truncate">
                      {THEME_CONFIGS[theme]?.name}
                    </span>
                  </div>

                  <ChevronDown
                    className={`w-4 h-4 text-zinc-400 transition-transform duration-200 shrink-0 ${
                      isThemeDropdownOpen ? "rotate-180 text-amber-400" : ""
                    }`}
                  />
                </button>

                {/* Dropdown Menu Popup (Tự động mở lên trên nếu gần đáy màn hình, mở xuống dưới nếu đủ chỗ) */}
                {isThemeDropdownOpen && (
                  <div
                    className={`absolute left-0 right-0 z-40 rounded-2xl border border-[#383a46] bg-[#181920] p-1.5 shadow-2xl backdrop-blur-xl animate-in fade-in space-y-0.5 ${
                      openUpward
                        ? "bottom-full mb-1.5 shadow-[0_-15px_35px_rgba(0,0,0,0.85)]"
                        : "top-full mt-1.5 shadow-[0_15px_35px_rgba(0,0,0,0.85)]"
                    }`}
                  >
                    {Object.values(THEME_CONFIGS).map((t) => {
                      const isSelected = theme === t.id;
                      return (
                        <button
                          key={t.id}
                          type="button"
                          onClick={() => {
                            setTheme(t.id);
                            setIsThemeDropdownOpen(false);
                          }}
                          className={`w-full flex items-center justify-between gap-2.5 px-3 py-1.5 rounded-xl text-xs font-medium transition cursor-pointer ${
                            isSelected
                              ? "bg-amber-400/15 text-amber-200 font-semibold border border-amber-400/40 shadow-sm"
                              : "text-zinc-300 hover:bg-white/5 hover:text-white border border-transparent"
                          }`}
                        >
                          <div className="flex items-center gap-2.5 min-w-0">
                            <span
                              className={`w-2.5 h-2.5 rounded-full shrink-0 ${t.dotClass}`}
                              style={{ boxShadow: `0 0 8px ${t.glowHex}` }}
                            />
                            <span className="truncate">{t.name}</span>
                          </div>

                          {isSelected && (
                            <Check className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                          )}
                        </button>
                      );
                    })}
                  </div>
                )}
              </div>

              {/* 3. Lời đúc kết từ AI */}
              <div className="space-y-1.5 mb-4">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-semibold text-zinc-200 flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                    <span>Lời đúc kết từ AI:</span>
                  </label>
                  <div className="flex items-center gap-1.5">
                    {quote !== defaultQuote && (
                      <button
                        type="button"
                        onClick={() => setQuote(defaultQuote)}
                        className="p-1 rounded-md text-zinc-400 hover:text-amber-300 hover:bg-amber-400/10 flex items-center justify-center cursor-pointer transition-colors"
                        title="Khôi phục lại câu đúc kết ban đầu của AI"
                      >
                        <RotateCcw className="w-3.5 h-3.5" />
                      </button>
                    )}
                    {isEditingQuote ? (
                      <button
                        type="button"
                        onClick={() => setIsEditingQuote(false)}
                        className="text-[11px] text-amber-300 hover:underline cursor-pointer font-medium"
                      >
                        Xong
                      </button>
                    ) : (
                      <button
                        type="button"
                        onClick={() => setIsEditingQuote(true)}
                        className="text-zinc-500 hover:text-amber-300 p-1 rounded transition cursor-pointer"
                        title="Chỉnh sửa câu chữ"
                      >
                        <Edit3 className="w-3 h-3" />
                      </button>
                    )}
                  </div>
                </div>

                {isEditingQuote ? (
                  <textarea
                    rows={3}
                    value={quote}
                    onChange={(e) => setQuote(e.target.value)}
                    placeholder="Viết cảm nghĩ hoặc lời khuyên của bạn..."
                    className="w-full bg-[#1c1e26] border border-[#383a48] focus:border-amber-400 rounded-xl p-2.5 text-xs text-zinc-200 placeholder-zinc-500 focus:outline-none transition leading-relaxed resize-none"
                  />
                ) : (
                  <div
                    onClick={() => setIsEditingQuote(true)}
                    className="p-2.5 rounded-xl bg-[#1c1e26] border border-[#2e303a] text-xs text-zinc-300 italic line-clamp-3 cursor-pointer hover:border-zinc-500 transition"
                    title="Bấm để chỉnh sửa"
                  >
                    &ldquo;{quote}&rdquo;
                  </div>
                )}
              </div>
            </div>

            {/* CÁC NÚT HÀNH ĐỘNG */}
            <div className="space-y-2 pt-2 border-t border-white/10">
              {/* Nút 1: Tải về HD */}
              <button
                type="button"
                onClick={handleDownload}
                disabled={isRendering}
                className="w-full py-3 px-4 rounded-2xl silver-gradient-btn font-bold text-xs sm:text-sm text-zinc-950 flex items-center justify-center gap-2 shadow-lg hover:scale-[1.01] active:scale-95 transition cursor-pointer disabled:opacity-50"
              >
                <Download className="w-4 h-4 text-zinc-950" />
                <span>Tải Ảnh Về Máy</span>
              </button>

              <div className="grid grid-cols-2 gap-2">
                {/* Nút 2: Copy ảnh */}
                <button
                  type="button"
                  onClick={handleCopyImage}
                  disabled={isRendering}
                  className="py-2.5 px-3 rounded-xl border border-[#383a46] bg-[#1f2027] hover:bg-[#282a32] text-zinc-200 font-semibold text-xs flex items-center justify-center gap-1.5 transition cursor-pointer disabled:opacity-50"
                >
                  {copied ? (
                    <>
                      <Check className="w-4 h-4 text-emerald-400" />
                      <span className="text-emerald-400">Đã chép!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-4 h-4 text-zinc-300" />
                      <span>Chép ảnh</span>
                    </>
                  )}
                </button>

                {/* Nút 3: Chia sẻ di động (Web Share) */}
                <button
                  type="button"
                  onClick={handleShare}
                  disabled={isRendering}
                  className="py-2.5 px-3 rounded-xl border border-[#383a46] bg-[#1f2027] hover:bg-[#282a32] text-zinc-200 font-semibold text-xs flex items-center justify-center gap-1.5 transition cursor-pointer disabled:opacity-50"
                >
                  {shareSuccess ? (
                    <>
                      <Check className="w-4 h-4 text-emerald-400" />
                      <span className="text-emerald-400">Đã chia sẻ!</span>
                    </>
                  ) : (
                    <>
                      <Share2 className="w-4 h-4 text-amber-400" />
                      <span>Chia sẻ</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Lightbox Phóng To Toàn Màn Hình Khi Click Vào Ảnh */}
        {isZoomed && zoomImageUrl && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[1000005] bg-black/94 backdrop-blur-md flex flex-col items-center justify-center p-3 sm:p-6 select-none cursor-zoom-out"
            onClick={() => setIsZoomed(false)}
          >
            {/* Thanh công cụ góc trên */}
            <div
              className="absolute top-4 right-4 sm:top-6 sm:right-6 flex items-center gap-2.5 z-30"
              onClick={(e) => e.stopPropagation()}
            >
              <button
                type="button"
                onClick={handleDownload}
                className="px-4 py-2 rounded-full bg-amber-400/20 hover:bg-amber-400/30 border border-amber-400/50 text-amber-200 text-xs sm:text-sm font-semibold flex items-center gap-1.5 transition cursor-pointer shadow-xl backdrop-blur-md hover:scale-105 active:scale-95"
              >
                <Download className="w-4 h-4" />
                <span>Tải ảnh về máy</span>
              </button>

              <button
                type="button"
                onClick={() => setIsZoomed(false)}
                className="p-2 sm:p-2.5 rounded-full bg-zinc-800/90 hover:bg-zinc-700 text-zinc-300 hover:text-white transition cursor-pointer shadow-xl backdrop-blur-md hover:scale-105 active:scale-95"
                title="Đóng xem lớn (Esc)"
              >
                <X className="w-5 h-5 sm:w-6 sm:h-6" />
              </button>
            </div>

            {/* Container Ảnh Phóng To */}
            <motion.div
              initial={{ scale: 0.88, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.88, opacity: 0 }}
              transition={{ type: "spring", damping: 26, stiffness: 320 }}
              className="relative max-h-[88vh] max-w-[94vw] flex items-center justify-center"
              onClick={(e) => e.stopPropagation()}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={zoomImageUrl}
                alt="Quẻ bài Tarot phóng to"
                className={`max-h-[86vh] max-w-[92vw] w-auto object-contain rounded-2xl shadow-[0_25px_90px_rgba(0,0,0,0.95)] border border-amber-400/40 ${
                  aspectRatio === "STORY" ? "aspect-[9/16]" : "aspect-square"
                }`}
              />
            </motion.div>

            <span className="text-xs text-zinc-400/80 mt-3 hidden sm:flex items-center gap-1.5">
              <span>Bấm ra ngoài hoặc bấm phím Esc để thu nhỏ</span>
            </span>
          </motion.div>
        )}
      </div>
    </AnimatePresence>
  );

  return createPortal(modalContent, document.body);
};
