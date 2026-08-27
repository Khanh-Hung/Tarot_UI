"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Sparkles, Mail, Lock, Loader2, ArrowRight } from "lucide-react";
import { useAuth } from "@/features/auth/hooks/useAuth";

export default function LoginPage() {
  const router = useRouter();
  const { login } = useAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg("");
    setIsLoading(true);

    try {
      await login({ email, password });
      router.push("/reading");
    } catch (err: any) {
      console.error("Login failed:", err);
      const serverMessage = err.response?.data?.message || "Email hoặc mật khẩu không chính xác.";
      setErrorMsg(serverMessage);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md p-8 rounded-3xl bg-slate-900/90 border border-purple-500/30 shadow-2xl shadow-purple-950/60 flex flex-col items-center">
        {/* Header Icon */}
        <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-amber-500 to-purple-600 flex items-center justify-center text-white shadow-lg shadow-purple-500/30 mb-4">
          <Sparkles className="w-6 h-6 text-amber-200" />
        </div>

        <h2 className="text-2xl  font-bold text-white text-center">
          Chào Mừng Trở Lại
        </h2>
        <p className="mt-1 text-xs text-purple-300/70 text-center">
          Đăng nhập để tiếp tục hành trình soi sáng tâm thức cùng Oracle Tarot
        </p>

        {errorMsg && (
          <div className="w-full mt-4 p-3 rounded-xl bg-rose-950/80 border border-rose-500/40 text-xs text-rose-200 text-center">
            {errorMsg}
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="w-full mt-6 space-y-4">
          <div>
            <label className="block text-xs font-medium text-purple-200 mb-1.5">
              Email đăng nhập
            </label>
            <div className="relative">
              <Mail className="w-4 h-4 text-purple-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="name@example.com"
                className="w-full bg-slate-950/80 border border-purple-500/30 rounded-xl pl-10 pr-4 py-2.5 text-sm text-white placeholder-purple-300/40 focus:outline-none focus:border-amber-400 transition"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium text-purple-200 mb-1.5">
              Mật khẩu
            </label>
            <div className="relative">
              <Lock className="w-4 h-4 text-purple-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full bg-slate-950/80 border border-purple-500/30 rounded-xl pl-10 pr-4 py-2.5 text-sm text-white placeholder-purple-300/40 focus:outline-none focus:border-amber-400 transition"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full mt-2 py-3 rounded-xl bg-gradient-to-r from-amber-500 to-purple-600 hover:from-amber-400 hover:to-purple-500 text-slate-950 font-bold text-sm flex items-center justify-center gap-2 shadow-lg shadow-purple-950/60 disabled:opacity-50 disabled:cursor-not-allowed transition"
          >
            {isLoading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin text-slate-950" />
                <span>Đang xác thực...</span>
              </>
            ) : (
              <>
                <span>Đăng Nhập</span>
                <ArrowRight className="w-4 h-4 text-slate-950" />
              </>
            )}
          </button>
        </form>

        <p className="mt-6 text-xs text-purple-300/60 text-center">
          Chưa có tài khoản?{" "}
          <Link href="/register" className="text-amber-300 hover:underline font-semibold">
            Đăng ký ngay (3 giây)
          </Link>
        </p>
      </div>
    </div>
  );
}