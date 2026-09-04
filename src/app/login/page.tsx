"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Mail, Lock, Loader2, ArrowRight, Eye, EyeOff } from "lucide-react";
import { useAuth } from "@/features/auth/hooks/useAuth";
import { getFriendlyErrorMessage } from "@/lib/errorMapping";
import { AuthFormSkeleton } from "@/components/ui/Skeleton";

export default function LoginPage() {
  const router = useRouter();
  const { login, isLoading: isAuthLoading } = useAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg("");
    setIsLoading(true);

    try {
      await login({ email, password });
      router.push("/reading");
    } catch (err: unknown) {
      setErrorMsg(getFriendlyErrorMessage(err, "Email hoặc mật khẩu không chính xác. Vui lòng kiểm tra lại."));
    } finally {
      setIsLoading(false);
    }
  };

  if (isAuthLoading) {
    return <AuthFormSkeleton />;
  }

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md p-7 sm:p-8 rounded-3xl bg-[#1a1b1f] border border-white/[0.08] shadow-2xl shadow-black/80 backdrop-blur-xl flex flex-col items-center">
        <h2 className="text-xl sm:text-2xl font-bold text-zinc-100 text-center tracking-tight">
          Đăng Nhập
        </h2>
        <p className="mt-1 text-xs text-zinc-400 text-center">
          Nhập thông tin tài khoản của bạn để tiếp tục
        </p>

        {errorMsg && (
          <div className="w-full mt-4 p-3 rounded-xl bg-rose-950/40 border border-rose-500/30 text-xs text-rose-300 text-center">
            {errorMsg}
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="w-full mt-6 space-y-4">
          <div>
            <label className="block text-xs font-medium text-zinc-300 mb-1.5">
              Email
            </label>
            <div className="relative">
              <Mail className="w-4 h-4 text-zinc-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="name@example.com"
                className="w-full bg-[#121316] border border-transparent rounded-xl pl-10 pr-4 py-2.5 text-sm text-zinc-100 placeholder-zinc-500 outline-none focus:outline-none focus:border-white/40 transition-colors duration-200"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium text-zinc-300 mb-1.5">
              Mật khẩu
            </label>
            <div className="relative">
              <Lock className="w-4 h-4 text-zinc-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type={showPassword ? "text" : "password"}
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full bg-[#121316] border border-transparent rounded-xl pl-10 pr-10 py-2.5 text-sm text-zinc-100 placeholder-zinc-500 outline-none focus:outline-none focus:border-white/40 transition-colors duration-200"
              />
              <button
                type="button"
                tabIndex={-1}
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-zinc-100 transition p-1 cursor-pointer"
                title={showPassword ? "Ẩn mật khẩu" : "Hiện mật khẩu"}
              >
                {showPassword ? (
                  <EyeOff className="w-4 h-4" />
                ) : (
                  <Eye className="w-4 h-4" />
                )}
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full mt-2 py-3 rounded-xl silver-gradient-btn text-zinc-950 font-bold text-sm flex items-center justify-center gap-2 shadow-lg shadow-black/30 hover:opacity-95 active:scale-[0.99] disabled:opacity-50 disabled:cursor-not-allowed transition"
          >
            {isLoading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin text-zinc-950" />
                <span>Đang xác thực...</span>
              </>
            ) : (
              <>
                <span>Đăng Nhập</span>
                <ArrowRight className="w-4 h-4 text-zinc-950" />
              </>
            )}
          </button>
        </form>

        <p className="mt-6 text-xs text-zinc-400 text-center">
          Chưa có tài khoản?{" "}
          <Link href="/register" className="text-zinc-200 hover:text-white font-semibold underline underline-offset-4 decoration-zinc-600 hover:decoration-white transition">
            Đăng ký ngay
          </Link>
        </p>
      </div>
    </div>
  );
}