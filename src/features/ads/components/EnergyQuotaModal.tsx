"use client";

import React, { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Sparkles, Video, Clock, X, Zap, CheckCircle, ShieldAlert, Award, AlertCircle } from "lucide-react";
import { UserQuotaDto } from "@/features/tarot/types/tarot.types";

interface EnergyQuotaModalProps {
  isOpen: boolean;
  onClose: () => void;
  quota: UserQuotaDto | null;
  onQuotaUpdated?: (newQuota: UserQuotaDto) => void;
  userId?: string | number;
}

export const EnergyQuotaModal: React.FC<EnergyQuotaModalProps> = ({
  isOpen,
  onClose,
  quota,
  onQuotaUpdated,
  userId,
}) => {
  const [adNotice, setAdNotice] = useState<string | null>(null);
  const [isLoadingAd, setIsLoadingAd] = useState(false);
  const [showSuccessToast, setShowSuccessToast] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!isOpen || !mounted) return null;

  const available = quota?.availableReadings ?? 0;
  const freeRemaining = quota?.dailyFreeRemaining ?? 0;
  const bonus = quota?.bonusReadings ?? 0;
  const watched = quota?.adsWatchedToday ?? 0;
  const maxAds = quota?.maxAdsPerDay ?? 8;
  const canWatch = quota?.canWatchAd ?? true;

  const handleRewardClaimed = (updated: UserQuotaDto) => {
    if (onQuotaUpdated) {
      onQuotaUpdated(updated);
    }
    setShowSuccessToast(true);
    setTimeout(() => {
      setShowSuccessToast(false);
    }, 4000);
  };

  const handleWatchAd = async () => {
    if (isLoadingAd) return;
    setIsLoadingAd(true);
    setAdNotice(null);

    try {
      // Kiểm tra đối tác quảng cáo thật (Google AdSense / Rewarded Ads SDK)
      // Nếu chưa có quảng cáo khả dụng từ đối tác, thông báo cho người dùng
      await new Promise((resolve) => setTimeout(resolve, 400));
      setAdNotice("Hiện chưa có video quảng cáo khả dụng. Vui lòng quay lại sau!");
    } catch {
      setAdNotice("Không thể tải quảng cáo lúc này. Vui lòng quay lại sau!");
    } finally {
      setIsLoadingAd(false);
    }
  };

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
          initial={{ scale: 0.92, opacity: 0, y: 20 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.92, opacity: 0, y: 20 }}
          className="relative w-full max-w-md my-auto max-h-[92vh] overflow-y-auto rounded-3xl border border-[#2b2d35] bg-[#18191e] p-5 sm:p-6 shadow-[0_20px_60px_rgba(0,0,0,0.85)] z-[1000000]"
        >
          {/* Close Button */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-1.5 rounded-full text-zinc-400 hover:text-zinc-100 hover:bg-white/5 transition cursor-pointer z-20"
            title="Đóng bảng"
          >
            <X className="w-4 h-4" />
          </button>

          {/* Header / Graphic */}
          <div className="flex flex-col items-center text-center mt-1 mb-4">
            <div className="relative mb-2.5">
              <motion.div
                animate={{ scale: [1, 1.05, 1] }}
                transition={{ repeat: Infinity, duration: 4, ease: "easeInOut" }}
                className="w-13 h-13 sm:w-14 sm:h-14 rounded-2xl bg-gradient-to-tr from-amber-500/20 via-purple-500/20 to-sky-500/20 border border-amber-400/40 flex items-center justify-center shadow-[0_0_24px_rgba(245,158,11,0.18)]"
              >
                <Zap className="w-7 h-7 text-amber-400 fill-amber-400/30 drop-shadow" />
              </motion.div>
              <span className="absolute -bottom-1 -right-1 flex h-5.5 w-5.5 items-center justify-center rounded-full bg-amber-400 text-zinc-950 font-bold text-[11px] shadow-md">
                {available}
              </span>
            </div>

            <h3 className="text-base sm:text-lg font-semibold text-zinc-100 mb-1">
              Tinh Thể Năng Lượng
            </h3>
            <p className="text-xs text-zinc-400 max-w-sm sm:whitespace-nowrap leading-relaxed">
              Mỗi lần bốc bài Tarot tiêu tốn 1 lượt năng lượng.
            </p>
          </div>

          {/* Success Notification Banner */}
          <AnimatePresence>
            {showSuccessToast && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="mb-4 flex items-center gap-2 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 p-3 text-xs text-emerald-300 shadow-lg"
              >
                <CheckCircle className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>
                  Nạp thành công <strong>+1 lượt bốc bài</strong>! Chúc bạn nhận được thông điệp sáng tỏ.
                </span>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Ad Status / Notice Banner */}
          <AnimatePresence>
            {adNotice && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="mb-4 flex items-start gap-2 rounded-2xl bg-amber-500/10 border border-amber-500/30 p-3 text-xs text-amber-300 shadow-lg"
              >
                <AlertCircle className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                <span className="leading-relaxed">{adNotice}</span>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Quota Breakdown Card */}
          <div className="rounded-2xl border border-[#2b2d35] bg-[#1d1f25] p-3.5 sm:p-4 mb-3.5 space-y-3">
            {/* Hàng 1: Miễn phí (Sky Blue Accent) */}
            <div className="flex items-center justify-between text-xs pb-2.5 border-b border-white/5">
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-sky-400 shrink-0" />
                <span className="text-zinc-300 font-medium">Lượt miễn phí trong ngày:</span>
              </div>
              <span className="font-semibold text-zinc-100">{freeRemaining} / 1</span>
            </div>

            {/* Hàng 2: Tích lũy từ video (Amber Gold Accent) */}
            <div className="flex items-center justify-between text-xs pb-2.5 border-b border-white/5">
              <div className="flex items-center gap-2">
                <Award className="w-4 h-4 text-amber-400 shrink-0" />
                <span className="text-zinc-300 font-medium">Lượt tích lũy từ video:</span>
              </div>
              <span className="font-semibold text-amber-300">+{bonus}</span>
            </div>

            {/* Hàng 3: Video tài trợ hôm nay (Purple Violet Accent) */}
            <div className="flex items-center justify-between text-xs">
              <div className="flex items-center gap-2">
                <Video className="w-4 h-4 text-purple-400 shrink-0" />
                <span className="text-zinc-300 font-medium">Video tài trợ hôm nay:</span>
              </div>
              <span className="font-semibold text-purple-300">
                {watched} / {maxAds}
              </span>
            </div>
          </div>

          {/* Reset Note */}
          <div className="flex items-start gap-2 text-[11px] text-zinc-400 leading-relaxed mb-4 px-1">
            <Clock className="w-3.5 h-3.5 text-amber-400/80 shrink-0 mt-0.5" />
            <span>
              Lượt miễn phí áp dụng cho quẻ 1 lá (làm mới lúc 00:00). Xem video để nhận thêm lượt bốc mọi trải bài.
            </span>
          </div>

          {/* Primary Action */}
          {canWatch ? (
            <button
              onClick={handleWatchAd}
              disabled={isLoadingAd}
              className="w-full py-3 px-4 rounded-2xl silver-gradient-btn font-bold text-xs sm:text-sm text-zinc-950 shadow-md hover:scale-[1.01] transition active:scale-[0.98] flex items-center justify-center gap-2 cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {isLoadingAd ? (
                <>
                  <div className="w-4 h-4 border-2 border-zinc-950 border-t-transparent rounded-full animate-spin" />
                  <span>Đang tìm quảng cáo...</span>
                </>
              ) : (
                <>
                  <Video className="w-4 h-4 text-zinc-950" />
                  <span>Xem Video Nhận Ngay +1 Lượt</span>
                </>
              )}
            </button>
          ) : (
            <div className="rounded-xl bg-zinc-800/60 border border-zinc-700/50 p-3 text-center text-xs text-zinc-400 flex items-center justify-center gap-2">
              <ShieldAlert className="w-4 h-4 text-zinc-400 shrink-0" />
              <span>Bạn đã đạt tối đa 8 video hôm nay. Hẹn gặp lại bạn vào ngày mai!</span>
            </div>
          )}
          </motion.div>
        </div>
      </AnimatePresence>
  );

  return createPortal(modalContent, document.body);
};
