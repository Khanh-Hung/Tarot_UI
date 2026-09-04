"use client";

import React, { useState, useEffect, useRef } from "react";
import { createPortal } from "react-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Sparkles, CheckCircle2, X, AlertCircle, Volume2, VolumeX, ShieldCheck, Gift } from "lucide-react";
import { tarotService } from "@/features/tarot/services/tarotService";
import { UserQuotaDto } from "@/features/tarot/types/tarot.types";

interface RewardedAdModalProps {
  isOpen: boolean;
  onClose: () => void;
  onRewardClaimed?: (newQuota: UserQuotaDto) => void;
  userId?: string | number;
}

const TOTAL_DURATION_SEC = 5;

export const RewardedAdModal: React.FC<RewardedAdModalProps> = ({
  isOpen,
  onClose,
  onRewardClaimed,
  userId,
}) => {
  const [secondsRemaining, setSecondsRemaining] = useState(TOTAL_DURATION_SEC);
  const [isCompleted, setIsCompleted] = useState(false);
  const [isClaiming, setIsClaiming] = useState(false);
  const [isMuted, setIsMuted] = useState(true);
  const [showExitConfirm, setShowExitConfirm] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Reset timer when opened
  useEffect(() => {
    if (isOpen) {
      setSecondsRemaining(TOTAL_DURATION_SEC);
      setIsCompleted(false);
      setIsClaiming(false);
      setShowExitConfirm(false);
      setErrorMessage(null);
    }
  }, [isOpen]);

  // Countdown timer logic
  useEffect(() => {
    if (!isOpen || isCompleted || showExitConfirm) return;

    if (secondsRemaining <= 0) {
      setIsCompleted(true);
      return;
    }

    const timer = setInterval(() => {
      setSecondsRemaining((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          setIsCompleted(true);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [isOpen, secondsRemaining, isCompleted, showExitConfirm]);

  const handleAttemptClose = () => {
    if (isCompleted) {
      if (errorMessage) {
        onClose();
      } else {
        handleClaim();
      }
    } else {
      setShowExitConfirm(true);
    }
  };

  const handleClaim = async () => {
    if (isClaiming) return;
    setIsClaiming(true);
    setErrorMessage(null);

    try {
      // Gọi API nhận thưởng từ Backend
      const updatedQuota = await tarotService.claimAdReward(userId);

      // Bắn event để cập nhật năng lượng toàn app (Navbar, Reading...)
      if (typeof window !== "undefined") {
        window.dispatchEvent(
          new CustomEvent("tarot_quota_updated", { detail: updatedQuota })
        );
      }

      if (onRewardClaimed) {
        onRewardClaimed(updatedQuota);
      }
      onClose();
    } catch (err: any) {
      const msg =
        err?.response?.data?.error?.message ||
        err?.response?.data?.message ||
        "Có lỗi khi nhận thưởng. Vui lòng thử lại!";
      setErrorMessage(msg);
    } finally {
      setIsClaiming(false);
    }
  };

  if (!isOpen || !mounted) return null;

  return createPortal(
    <AnimatePresence>
      <div className="fixed inset-0 z-[999999] flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/85 backdrop-blur-md z-[999999]"
          onClick={handleAttemptClose}
        />

        {/* Ad Container */}
        <motion.div
          initial={{ scale: 0.92, opacity: 0, y: 20 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.92, opacity: 0, y: 20 }}
          className="relative w-full max-w-xl my-auto max-h-[92vh] overflow-y-auto rounded-3xl border border-[#2b2d35] bg-[#16171b] shadow-[0_20px_60px_rgba(0,0,0,0.85)] z-[1000000]"
        >
          {/* Top Bar: Header & Controls */}
          <div className="flex items-center justify-between border-b border-white/5 bg-[#1a1b20] px-5 py-3">
            <div className="flex items-center gap-2">
              <span className="flex items-center gap-1.5 rounded-full bg-amber-500/15 border border-amber-500/30 px-2.5 py-0.5 text-xs font-medium text-amber-300">
                <Gift className="w-3.5 h-3.5 text-amber-400" />
                Quảng cáo nhận thưởng
              </span>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => setIsMuted(!isMuted)}
                className="p-1.5 rounded-full text-zinc-400 hover:text-zinc-100 hover:bg-white/5 transition cursor-pointer"
                title={isMuted ? "Bật âm thanh" : "Tắt âm thanh"}
              >
                {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4 text-zinc-200" />}
              </button>

              <button
                onClick={handleAttemptClose}
                className="p-1.5 rounded-full text-zinc-400 hover:text-zinc-100 hover:bg-white/5 transition cursor-pointer"
                title="Đóng"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Ad Content / Video Simulator */}
          <div className="relative aspect-video w-full overflow-hidden bg-[#0e0f12] flex flex-col items-center justify-center select-none">
            {/* Background Animated Gradient */}
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-zinc-800/20 via-[#111216] to-[#0a0a0c]" />

            {/* Simulated Sponsor Visual */}
            <div className="relative z-10 flex flex-col items-center text-center px-6">
              <motion.div
                animate={{ rotate: [0, 4, -4, 0] }}
                transition={{ repeat: Infinity, duration: 6, ease: "easeInOut" }}
                className="w-14 h-14 rounded-2xl bg-[#1e2027] border border-[#343743] flex items-center justify-center shadow-inner mb-3"
              >
                <Sparkles className="w-7 h-7 text-amber-300/80" />
              </motion.div>

              <h4 className="text-base sm:text-lg font-semibold text-zinc-100 mb-1">
                Khai Mở Năng Lượng Tâm Thức
              </h4>
              <p className="text-xs text-zinc-400 max-w-sm leading-relaxed">
                Khám phá bộ bài Rider-Waite phục chế cổ điển và thông điệp vũ trụ dành riêng cho bản mệnh của bạn.
              </p>

              <div className="mt-4 flex items-center gap-1.5 text-[11px] text-zinc-400 bg-zinc-900/90 px-3 py-1 rounded-full border border-zinc-700/60">
                <ShieldCheck className="w-3.5 h-3.5 text-zinc-400" />
                <span>Nhà tài trợ chính thức • Hoàn tất để nhận +1 lượt</span>
              </div>
            </div>

            {/* Countdown Badge overlay on video */}
            <div className="absolute top-3 right-3 z-20">
              {isCompleted ? (
                <div className="flex items-center gap-1.5 rounded-full bg-emerald-500/15 border border-emerald-500/30 px-3 py-1 text-xs font-semibold text-emerald-300 shadow-md backdrop-blur-md">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  Đã hoàn tất
                </div>
              ) : (
                <div className="flex items-center gap-1.5 rounded-full bg-black/60 border border-zinc-700/60 px-3 py-1 text-xs font-medium text-zinc-300 shadow-md backdrop-blur-md">
                  <span>Có thể nhận thưởng sau:</span>
                  <span className="font-bold text-zinc-100 font-mono text-sm">
                    {secondsRemaining}s
                  </span>
                </div>
              )}
            </div>

            {/* Bottom Progress Bar */}
            <div className="absolute bottom-0 left-0 right-0 h-1 bg-zinc-800">
              <div
                className="h-full bg-gradient-to-r from-zinc-400 to-zinc-200 transition-all duration-1000 ease-linear"
                style={{
                  width: `${((TOTAL_DURATION_SEC - secondsRemaining) / TOTAL_DURATION_SEC) * 100}%`,
                }}
              />
            </div>
          </div>

          {/* Footer Action */}
          <div className="border-t border-white/5 bg-[#17181d] p-4 flex flex-col sm:flex-row items-center justify-between gap-3">
            <div className="text-center sm:text-left">
              <div className="text-xs font-medium text-zinc-400">
                Phần thưởng hoàn tất:
              </div>
              <div className="text-sm font-semibold text-zinc-100 flex items-center gap-1.5 justify-center sm:justify-start mt-0.5">
                <Sparkles className="w-4 h-4 text-amber-300/80" />
                +1 Lượt Bốc Bài Miễn Phí
              </div>
            </div>

            <button
              onClick={handleClaim}
              disabled={!isCompleted || isClaiming}
              className={`w-full sm:w-auto px-6 py-2.5 rounded-xl font-semibold text-xs sm:text-sm transition flex items-center justify-center gap-2 shadow-md ${
                isCompleted
                  ? "silver-gradient-btn text-zinc-950 hover:scale-[1.01] active:scale-95 cursor-pointer"
                  : "bg-zinc-800/80 text-zinc-500 cursor-not-allowed border border-zinc-700/40"
              }`}
            >
              {isClaiming ? (
                <>
                  <div className="w-4 h-4 border-2 border-zinc-950 border-t-transparent rounded-full animate-spin" />
                  Đang nạp lượt...
                </>
              ) : isCompleted ? (
                <>
                  <Sparkles className="w-4 h-4 text-zinc-950" />
                  Nhận Thưởng Ngay (+1 Lượt)
                </>
              ) : (
                `Vui lòng xem hết (${secondsRemaining}s)`
              )}
            </button>
          </div>

          {/* Error Banner if any */}
          {errorMessage && (
            <div className="bg-red-950/50 border-t border-red-500/30 p-3 text-center text-xs text-red-300 flex items-center justify-center gap-2">
              <AlertCircle className="w-4 h-4 text-red-400 shrink-0" />
              <span>{errorMessage}</span>
            </div>
          )}

          {/* Early Exit Confirmation Dialog */}
          <AnimatePresence>
            {showExitConfirm && (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="absolute inset-0 z-30 bg-black/90 backdrop-blur-md flex flex-col items-center justify-center p-6 text-center"
              >
                <div className="w-12 h-12 rounded-full bg-zinc-800 border border-zinc-700 flex items-center justify-center mb-3">
                  <AlertCircle className="w-6 h-6 text-amber-300/90" />
                </div>
                <h4 className="text-base font-semibold text-zinc-100 mb-2">
                  Bạn có chắc muốn thoát sớm?
                </h4>
                <p className="text-xs text-zinc-400 max-w-xs mb-6 leading-relaxed">
                  Nếu thoát bây giờ, bạn sẽ không nhận được <span className="text-zinc-200 font-semibold">+1 lượt bốc bài</span>. Chỉ còn lại <span className="text-zinc-100 font-bold">{secondsRemaining} giây</span> thôi!
                </p>

                <div className="flex flex-col sm:flex-row gap-2 w-full max-w-xs">
                  <button
                    onClick={() => setShowExitConfirm(false)}
                    className="w-full py-2.5 rounded-xl silver-gradient-btn text-zinc-950 font-semibold text-xs transition cursor-pointer"
                  >
                    Tiếp tục xem ({secondsRemaining}s)
                  </button>
                  <button
                    onClick={onClose}
                    className="w-full py-2.5 rounded-xl bg-zinc-800 border border-zinc-700/60 text-zinc-400 hover:text-zinc-200 hover:bg-zinc-700 transition text-xs cursor-pointer"
                  >
                    Bỏ qua phần thưởng
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </div>
    </AnimatePresence>,
    document.body
  );
};
