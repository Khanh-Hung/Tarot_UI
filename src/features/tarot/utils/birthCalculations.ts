import { ZodiacSign } from "../types/tarot.types";

export interface BirthCardResult {
  cardNumber: number;
  cardNameVi: string;
  cardNameEn: string;
  keywords: string;
}

const MAJOR_ARCANA: { vi: string; en: string; keywords: string }[] = [
  { vi: "Kẻ Khờ", en: "The Fool", keywords: "Tự do, khởi đầu, thuần khiết" },
  { vi: "Bậc Thầy Biến Hóa", en: "The Magician", keywords: "Ý chí, kiến tạo, tháo vát" },
  { vi: "Nữ Tư Tế", en: "The High Priestess", keywords: "Trực giác, bí ẩn, tĩnh lặng" },
  { vi: "Hoàng Hậu", en: "The Empress", keywords: "Trù phú, nuôi dưỡng, sáng tạo" },
  { vi: "Hoàng Đế", en: "The Emperor", keywords: "Kỷ luật, quyền lực, cấu trúc" },
  { vi: "Đại Tư Tế", en: "The Hierophant", keywords: "Truyền thống, học thức, niềm tin" },
  { vi: "Người Tình", en: "The Lovers", keywords: "Lựa chọn, đam mê, hòa hợp" },
  { vi: "Cỗ Xe Chiến Thắng", en: "The Chariot", keywords: "Ý chí, vượt khó, bứt phá" },
  { vi: "Sức Mạnh", en: "Strength", keywords: "Nội lực, kiên nhẫn, lòng trắc ẩn" },
  { vi: "Ẩn Sĩ", en: "The Hermit", keywords: "Chiêm nghiệm, thông thái, soi sáng" },
  { vi: "Bánh Xe Số Phận", en: "Wheel of Fortune", keywords: "Thời vận, chuyển dịch, cơ duyên" },
  { vi: "Công Lý", en: "Justice", keywords: "Chân lý, công bằng, sáng suốt" },
  { vi: "Người Treo Ngược", en: "The Hanged Man", keywords: "Buông bỏ, góc nhìn mới, giác ngộ" },
  { vi: "Cái Chết & Tái Sinh", en: "Death", keywords: "Chuyển hóa, lột xác, tái sinh" },
  { vi: "Tiết Độ & Cân Bằng", en: "Temperance", keywords: "Hòa giải, kiên nhẫn, cân bằng" },
  { vi: "Ác Quỷ & Ảo Tưởng", en: "The Devil", keywords: "Vật chất, rào cản, giải thoát" },
  { vi: "Tòa Tháp Bứt Phá", en: "The Tower", keywords: "Thức tỉnh, đột phá, tái thiết" },
  { vi: "Ngôi Sao Hy Vọng", en: "The Star", keywords: "Hy vọng, chữa lành, an yên" },
  { vi: "Mặt Trăng Trực Giác", en: "The Moon", keywords: "Tiềm thức, trực giác, mơ mộng" },
  { vi: "Mặt Trời Rực Rỡ", en: "The Sun", keywords: "Hân hoan, rực rỡ, thành công" },
  { vi: "Phán Xét & Thức Tỉnh", en: "Judgement", keywords: "Hiệu triệu, thức tỉnh, tái sinh" },
  { vi: "Thế Giới Toàn Vẹn", en: "The World", keywords: "Viên mãn, hoàn tất, hòa hợp" },
];

/**
 * Phân tách chuỗi ngày sinh thành [year, month, day]
 * Hỗ trợ định dạng ISO (YYYY-MM-DD) và định dạng hiển thị (DD/MM/YYYY)
 */
function parseDateParts(dob: string): { year: number; month: number; day: number } | null {
  if (!dob || typeof dob !== "string") return null;
  const clean = dob.trim().split("T")[0].split(" ")[0];

  // Định dạng ISO: YYYY-MM-DD
  if (/^\d{4}-\d{1,2}-\d{1,2}$/.test(clean)) {
    const [y, m, d] = clean.split("-").map(Number);
    if (m >= 1 && m <= 12 && d >= 1 && d <= 31) return { year: y, month: m, day: d };
  }

  // Định dạng hiển thị: DD/MM/YYYY
  if (/^\d{1,2}\/\d{1,2}\/\d{4}$/.test(clean)) {
    const [d, m, y] = clean.split("/").map(Number);
    if (m >= 1 && m <= 12 && d >= 1 && d <= 31) return { year: y, month: m, day: d };
  }

  return null;
}

/**
 * Chuẩn hóa chuỗi ngày sinh bất kỳ sang chuẩn ISO YYYY-MM-DD
 */
export function toIsoDateString(dob: string): string | null {
  const parts = parseDateParts(dob);
  if (!parts) return null;
  const m = String(parts.month).padStart(2, "0");
  const d = String(parts.day).padStart(2, "0");
  return `${parts.year}-${m}-${d}`;
}

/**
 * Tính Cung Hoàng Đạo từ ngày sinh dương lịch
 */
export function calculateZodiacFromDate(dob: string): ZodiacSign {
  const parts = parseDateParts(dob);
  if (!parts) return "UNKNOWN";

  const { month: m, day: d } = parts;

  switch (m) {
    case 1:
      return d <= 19 ? "CAPRICORN" : "AQUARIUS";
    case 2:
      return d <= 18 ? "AQUARIUS" : "PISCES";
    case 3:
      return d <= 20 ? "PISCES" : "ARIES";
    case 4:
      return d <= 19 ? "ARIES" : "TAURUS";
    case 5:
      return d <= 20 ? "TAURUS" : "GEMINI";
    case 6:
      return d <= 20 ? "GEMINI" : "CANCER";
    case 7:
      return d <= 22 ? "CANCER" : "LEO";
    case 8:
      return d <= 22 ? "LEO" : "VIRGO";
    case 9:
      return d <= 22 ? "VIRGO" : "LIBRA";
    case 10:
      return d <= 22 ? "LIBRA" : "SCORPIO";
    case 11:
      return d <= 21 ? "SCORPIO" : "SAGITTARIUS";
    case 12:
      return d <= 21 ? "SAGITTARIUS" : "CAPRICORN";
    default:
      return "UNKNOWN";
  }
}

/**
 * Tính Lá Bài Bản Mệnh Tarot (Tarot Birth Card) chuẩn Mary K. Greer
 */
export function calculateBirthCardFromDate(dob: string): BirthCardResult | null {
  const parts = parseDateParts(dob);
  if (!parts) return null;

  const { year, month, day } = parts;

  const century = Math.floor(year / 100);
  const decade = year % 100;
  let sum = day + month + century + decade;

  while (sum > 22) {
    let temp = 0;
    let n = sum;
    while (n > 0) {
      temp += n % 10;
      n = Math.floor(n / 10);
    }
    sum = temp;
  }

  const cardIdx = sum === 22 ? 0 : sum;
  if (cardIdx < 0 || cardIdx > 21) return null;

  const meta = MAJOR_ARCANA[cardIdx];
  return {
    cardNumber: cardIdx,
    cardNameVi: meta.vi,
    cardNameEn: meta.en,
    keywords: meta.keywords,
  };
}

/**
 * Tên hiển thị Cung Hoàng Đạo kèm biểu tượng
 */
export const ZODIAC_DISPLAY_INFO: Record<ZodiacSign, { nameVi: string; symbol: string }> = {
  ARIES: { nameVi: "Bạch Dương", symbol: "♈" },
  TAURUS: { nameVi: "Kim Ngưu", symbol: "♉" },
  GEMINI: { nameVi: "Song Tử", symbol: "♊" },
  CANCER: { nameVi: "Cự Giải", symbol: "♋" },
  LEO: { nameVi: "Sư Tử", symbol: "♌" },
  VIRGO: { nameVi: "Xử Nữ", symbol: "♍" },
  LIBRA: { nameVi: "Thiên Bình", symbol: "♎" },
  SCORPIO: { nameVi: "Bọ Cạp", symbol: "♏" },
  SAGITTARIUS: { nameVi: "Nhân Mã", symbol: "♐" },
  CAPRICORN: { nameVi: "Ma Kết", symbol: "♑" },
  AQUARIUS: { nameVi: "Bảo Bình", symbol: "♒" },
  PISCES: { nameVi: "Song Ngư", symbol: "♓" },
  UNKNOWN: { nameVi: "Chưa xác định", symbol: "✨" },
};
