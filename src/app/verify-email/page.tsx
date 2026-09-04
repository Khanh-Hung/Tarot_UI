"use client";

import React, { useEffect, useState, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";
import { Sparkles, CheckCircle2, AlertCircle, ArrowRight, ShieldCheck, Loader2 } from "lucide-react";
import { authService } from "@/features/auth/services/authService";
import { useAuth } from "@/features/auth/hooks/useAuth";

function VerifyEmailContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { markEmailAsVerified } = useAuth();

  const token = searchParams.get("token");

  const [status, setStatus] = useState<"loading" | "success" | "error">("loading");
  const [errorMessage, setErrorMessage] = useState<string>("");
  const [countdown, setCountdown] = useState<number>(4);

  useEffect(() => {
    if (!token) {
      setStatus("error");
      setErrorMessage("Không tìm thấy liên kết hoặc mã kích hoạt hợp lệ trong đường dẫn.");
      return;
    }

    let isMounted = true;

    async function executeVerification() {
      try {
        await authService.verifyEmail(token as string);
        if (isMounted) {
          markEmailAsVerified();
          setStatus("success");
        }
      } catch (err: any) {
        if (isMounted) {
          setStatus("error");
          const msg =
            err?.response?.data?.message ||
            "Liên kết xác thực không hợp lệ hoặc đã hết hạn (24 giờ). Vui lòng yêu cầu một liên kết mới.";
          setErrorMessage(msg);
        }
      }
    }

    executeVerification();

    return () => {
      isMounted = false;
    };
  }, [token]);

  // Auto redirect countdown on success
  useEffect(() => {
    if (status !== "success") return;
    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          router.push("/reading");
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [status, router]);

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 py-12">
      <div className="relative w-full max-w-md bg-[#18191e] border border-[#2e323e] rounded-3xl p-8 sm:p-10 shadow-2xl text-center overflow-hidden">
        {/* Mystic Ambient Glows */}
        <div className="absolute -top-28 -left-28 w-56 h-56 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-28 -right-28 w-56 h-56 bg-purple-600/15 rounded-full blur-3xl pointer-events-none" />

        {/* LOADING STATE */}
        {status === "loading" && (
          <div className="flex flex-col items-center py-6 animate-in fade-in duration-300">
            <div className="relative w-20 h-20 mb-6 flex items-center justify-center">
              <div className="absolute inset-0 rounded-full border-2 border-amber-500/20 border-t-amber-400 animate-spin" />
              <div className="w-12 h-12 rounded-full bg-amber-400/10 border border-amber-400/30 flex items-center justify-center text-amber-300">
                <Sparkles className="w-6 h-6 animate-pulse" />
              </div>
            </div>
            <h2 className="text-xl font-bold text-white tracking-wide">
              Đang Xác Thực Tài Khoản
            </h2>
            <p className="text-xs text-zinc-400 mt-2 max-w-xs leading-relaxed">
              Vũ trụ đang kết nối và xác nhận liên kết kích hoạt của bạn...
            </p>
          </div>
        )}

        {/* SUCCESS STATE */}
        {status === "success" && (
          <div className="flex flex-col items-center py-4 animate-in zoom-in-95 duration-300">
            <div className="w-20 h-20 rounded-full bg-emerald-500/15 border border-emerald-500/40 flex items-center justify-center text-emerald-400 mb-6 shadow-[0_0_30px_rgba(16,185,129,0.25)]">
              <CheckCircle2 className="w-10 h-10" />
            </div>

            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-semibold bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 mb-3">
              <ShieldCheck className="w-3.5 h-3.5" />
              Tài Khoản Đã Kích Hoạt
            </span>

            <h2 className="text-2xl font-bold text-white tracking-wide">
              Xác Thực Thành Công!
            </h2>

            <p className="text-xs sm:text-sm text-zinc-300 mt-2.5 max-w-sm leading-relaxed">
              Chúc mừng bạn! Email đã được xác nhận. Giờ đây bạn có thể trò chuyện trực tiếp không giới hạn cùng <span className="text-amber-300 font-medium">Nyxoris AI Reader</span>.
            </p>

            <div className="w-full mt-8 flex flex-col gap-3">
              <Link
                href="/reading"
                className="w-full py-3.5 px-5 rounded-xl font-bold text-sm bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-black shadow-lg flex items-center justify-center gap-2 transition-all hover:scale-[1.02] active:scale-[0.98]"
              >
                <span>Bắt Đầu Bốc Bài Ngay</span>
                <ArrowRight className="w-4 h-4" />
              </Link>

              <p className="text-[11px] text-zinc-500">
                Tự động chuyển tiếp sau {countdown} giây...
              </p>
            </div>
          </div>
        )}

        {/* ERROR STATE */}
        {status === "error" && (
          <div className="flex flex-col items-center py-4 animate-in zoom-in-95 duration-300">
            <div className="w-20 h-20 rounded-full bg-rose-500/15 border border-rose-500/40 flex items-center justify-center text-rose-400 mb-6 shadow-[0_0_30px_rgba(244,63,94,0.2)]">
              <AlertCircle className="w-10 h-10" />
            </div>

            <h2 className="text-xl sm:text-2xl font-bold text-white tracking-wide">
              Xác Thực Không Thành Công
            </h2>

            <p className="text-xs sm:text-sm text-zinc-300 mt-2.5 max-w-sm leading-relaxed">
              {errorMessage}
            </p>

            <div className="w-full mt-8 flex flex-col gap-3">
              <Link
                href="/profile"
                className="w-full py-3.5 px-5 rounded-xl font-bold text-sm bg-[#22242b] hover:bg-[#2b2d36] border border-[#353742] text-zinc-200 shadow-md flex items-center justify-center gap-2 transition-all"
              >
                <span>Về Trang Cá Nhân Để Gửi Lại Link</span>
                <ArrowRight className="w-4 h-4" />
              </Link>

              <Link
                href="/"
                className="text-xs text-zinc-400 hover:text-white transition-colors"
              >
                Về Trang Chủ
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default function VerifyEmailPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-[80vh] flex items-center justify-center">
          <Loader2 className="w-8 h-8 text-amber-400 animate-spin" />
        </div>
      }
    >
      <VerifyEmailContent />
    </Suspense>
  );
}
