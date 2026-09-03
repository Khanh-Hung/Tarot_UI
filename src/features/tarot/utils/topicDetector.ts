import { Topic } from "../types/tarot.types";

export interface DetectedTopicResult {
  topic: Topic;
  label: string;
  icon: string;
  confidence: "HIGH" | "MEDIUM" | "LOW";
}

export function detectTopicFromQuestion(question: string): DetectedTopicResult {
  if (!question || question.trim().length < 3) {
    return {
      topic: "GENERAL_GUIDANCE",
      label: "Định Hướng Tổng Quan",
      icon: "✨",
      confidence: "LOW",
    };
  }

  const q = question.toLowerCase();

  // 1. TÌNH YÊU & MỐI QUAN HỆ
  const loveKeywords = [
    "yêu", "crush", "người ấy", "người cũ", "người yêu", "chia tay", "kết hôn",
    "hẹn hò", "bạn trai", "bạn gái", "vợ", "chồng", "tình cảm", "tình duyên",
    "thầm thích", "quay lại", "tỏ tình", "nhớ", "rạn nứt", "độc thân", "người thứ ba"
  ];
  if (loveKeywords.some((kw) => q.includes(kw))) {
    return {
      topic: "LOVE_AND_RELATIONSHIP",
      label: "Tình Duyên & Mối Quan Hệ",
      icon: "💖",
      confidence: "HIGH",
    };
  }

  // 2. SỰ NGHIỆP & TÀI CHÍNH
  const careerKeywords = [
    "việc", "công việc", "sự nghiệp", "tiền", "tài chính", "lương", "thăng tiến",
    "nhảy việc", "kinh doanh", "đầu tư", "phỏng vấn", "dự án", "đối tác", "hợp đồng",
    "công ty", "sếp", "đồng nghiệp", "buôn bán", "chứng khoán", "thi cử", "học tập", "tốt nghiệp"
  ];
  if (careerKeywords.some((kw) => q.includes(kw))) {
    return {
      topic: "CAREER_AND_FINANCE",
      label: "Sự Nghiệp & Tài Chính",
      icon: "💼",
      confidence: "HIGH",
    };
  }

  // 3. CHỮA LÀNH & NỘI TÂM
  const healingKeywords = [
    "chữa lành", "mệt mỏi", "áp lực", "stress", "bế tắc", "trầm cảm", "lo âu",
    "bất an", "tĩnh tâm", "tâm thức", "nội tâm", "mất phương hướng", "cô đơn",
    "buông bỏ", "tổn thương", "năng lượng", "chông chênh", "khủng hoảng", "tha thứ"
  ];
  if (healingKeywords.some((kw) => q.includes(kw))) {
    return {
      topic: "SELF_GROWTH_AND_HEALING",
      label: "Chữa Lành & Nội Tâm",
      icon: "🌿",
      confidence: "HIGH",
    };
  }

  return {
    topic: "GENERAL_GUIDANCE",
    label: "Định Hướng Tổng Quan",
    icon: "🧭",
    confidence: "LOW",
  };
}