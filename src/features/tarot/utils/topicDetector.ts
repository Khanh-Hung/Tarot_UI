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
      topic: "GENERAL_QUESTION",
      label: "Tự động nhận diện",
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
      topic: "LOVE_RELATIONSHIP",
      label: "Tình Yêu & Mối Quan Hệ",
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
      topic: "CAREER_MONEY",
      label: "Sự Nghiệp & Tài Chính",
      icon: "💼",
      confidence: "HIGH",
    };
  }

  // 3. CHỮA LÀNH & TÂM THỨC
  const healingKeywords = [
    "chữa lành", "mệt mỏi", "áp lực", "stress", "bế tắc", "trầm cảm", "lo âu",
    "bất an", "tĩnh tâm", "tâm thức", "nội tâm", "mất phương hướng", "cô đơn",
    "buông bỏ", "tổn thương", "năng lượng", "chông chênh", "khủng hoảng", "tha thứ"
  ];
  if (healingKeywords.some((kw) => q.includes(kw))) {
    return {
      topic: "SPIRITUAL_HEALING",
      label: "Chữa Lành & Tâm Thức",
      icon: "🌿",
      confidence: "HIGH",
    };
  }

  // 4. THÔNG ĐIỆP NGÀY MỚI
  const dailyKeywords = [
    "hôm nay", "ngày mai", "ngày mới", "tuần này", "tháng này", "thông điệp",
    "vận may", "tổng quan", "dự báo", "tuần mới", "ngày hôm nay"
  ];
  if (dailyKeywords.some((kw) => q.includes(kw))) {
    return {
      topic: "DAILY_GUIDANCE",
      label: "Thông Điệp Ngày Mới",
      icon: "☀️",
      confidence: "MEDIUM",
    };
  }

  return {
    topic: "GENERAL_QUESTION",
    label: "Câu Hỏi Đa Chiều",
    icon: "🔮",
    confidence: "LOW",
  };
}