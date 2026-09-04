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
      <div className="relative w-full max-w-md bg-[#1a1b1f] border border-white/[0.08] rounded-3xl p-8 sm:p-10 shadow-2xl shadow-black/80 backdrop-blur-xl text-center overflow-hidden">
        {/* LOADING STATE */}
        {status === "loading" && (
          <div className="flex flex-col items-center py-6 animate-in fade-in duration-300">
            <div className="w-16 h-16 mb-5 flex items-center justify-center">
              <Loader2 className="w-8 h-8 text-zinc-300 animate-spin" />
            </div>
            <h2 className="text-xl font-bold text-white tracking-tight">
              Đang Xác Thực Tài Khoản
            </h2>
            <p className="text-xs text-zinc-400 mt-2 max-w-xs leading-relaxed">
              Vui lòng chờ trong giây lát...
            </p>
          </div>
        )}

        {/* SUCCESS STATE */}
        {status === "success" && (
          <div className="flex flex-col items-center py-2 animate-in zoom-in-95 duration-300">
            <div className="w-16 h-16 rounded-full bg-emerald-500/10 border border-emerald-500/25 flex items-center justify-center text-emerald-400 mb-5 shadow-lg shadow-emerald-500/10">
              <CheckCircle2 className="w-8 h-8" />
            </div>

            <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
              Xác Thực Thành Công
            </h2>

            <p className="text-sm text-zinc-400 mt-2 max-w-xs leading-relaxed">
              Email của bạn đã được xác thực thành công. Cảm ơn bạn!
            </p>

            <div className="w-full mt-7 flex flex-col gap-3">
              <Link
                href="/reading"
                className="w-full py-3 px-5 rounded-xl font-bold text-sm silver-gradient-btn text-zinc-950 flex items-center justify-center gap-2 shadow-lg shadow-black/30 hover:opacity-95 active:scale-[0.99] transition"
              >
                <span>Tiếp Tục</span>
                <ArrowRight className="w-4 h-4 text-zinc-950" />
              </Link>

              <p className="text-xs text-zinc-500 mt-1">
                Tự động chuyển tiếp sau {countdown} giây...
              </p>
            </div>
          </div>
        )}

        {/* ERROR STATE */}
        {status === "error" && (
          <div className="flex flex-col items-center py-2 animate-in zoom-in-95 duration-300">
            <div className="w-16 h-16 rounded-full bg-rose-500/10 border border-rose-500/25 flex items-center justify-center text-rose-400 mb-5">
              <AlertCircle className="w-8 h-8" />
            </div>

            <h2 className="text-xl font-bold text-white tracking-tight">
              Xác Thực Thất Bại
            </h2>

            <p className="text-xs sm:text-sm text-zinc-400 mt-2 max-w-xs leading-relaxed">
              {errorMessage}
            </p>

            <div className="w-full mt-7 flex flex-col gap-3">
              <Link
                href="/profile"
                className="w-full py-3 px-5 rounded-xl font-bold text-sm bg-white/[0.08] hover:bg-white/[0.12] border border-white/[0.1] text-white flex items-center justify-center gap-2 transition"
              >
                <span>Về Trang Cá Nhân</span>
                <ArrowRight className="w-4 h-4" />
              </Link>

              <Link
                href="/"
                className="text-xs text-zinc-500 hover:text-zinc-300 transition-colors"
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
