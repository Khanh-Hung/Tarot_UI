"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Mail, Lock, Loader2, ArrowRight, Eye, EyeOff } from "lucide-react";
import { useAuth } from "@/features/auth/hooks/useAuth";

export default function RegisterPage() {
  const router = useRouter();
  const { register } = useAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password.length < 6) {
      setErrorMsg("Mật khẩu phải có tối thiểu 6 ký tự.");
      return;
    }

    if (password !== confirmPassword) {
      setErrorMsg("Mật khẩu nhập lại không trùng khớp.");
      return;
    }

    setErrorMsg("");
    setIsLoading(true);

    try {
      await register({ email, password });
      router.push("/reading");
    } catch (err: any) {
      console.error("Registration failed:", err);
      const serverMessage = err.response?.data?.message || "Đăng ký thất bại. Email có thể đã được sử dụng.";
      setErrorMsg(serverMessage);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md p-7 sm:p-8 rounded-3xl bg-[#1a1b1f] border border-white/[0.08] shadow-2xl shadow-black/80 backdrop-blur-xl flex flex-col items-center">
        <h2 className="text-xl sm:text-2xl font-bold text-zinc-100 text-center tracking-tight">
          Tạo Tài Khoản
        </h2>
        <p className="mt-1 text-xs text-zinc-400 text-center">
          Nhập thông tin để tạo tài khoản mới
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
                minLength={6}
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

          <div>
            <label className="block text-xs font-medium text-zinc-300 mb-1.5">
              Nhập lại mật khẩu
            </label>
            <div className="relative">
              <Lock className="w-4 h-4 text-zinc-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type={showConfirmPassword ? "text" : "password"}
                required
                minLength={6}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full bg-[#121316] border border-transparent rounded-xl pl-10 pr-10 py-2.5 text-sm text-zinc-100 placeholder-zinc-500 outline-none focus:outline-none focus:border-white/40 transition-colors duration-200"
              />
              <button
                type="button"
                tabIndex={-1}
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-zinc-100 transition p-1 cursor-pointer"
                title={showConfirmPassword ? "Ẩn mật khẩu" : "Hiện mật khẩu"}
              >
                {showConfirmPassword ? (
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
                <span>Đang tạo tài khoản...</span>
              </>
            ) : (
              <>
                <span>Đăng Ký Tài Khoản</span>
                <ArrowRight className="w-4 h-4 text-zinc-950" />
              </>
            )}
          </button>
        </form>

        <p className="mt-6 text-xs text-zinc-400 text-center">
          Đã có tài khoản?{" "}
          <Link href="/login" className="text-zinc-200 hover:text-white font-semibold underline underline-offset-4 decoration-zinc-600 hover:decoration-white transition">
            Đăng nhập
          </Link>
        </p>
      </div>
    </div>
  );
}