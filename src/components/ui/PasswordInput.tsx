"use client";

import React, { useState } from "react";
import { Lock, Eye, EyeOff } from "lucide-react";

export interface PasswordInputProps
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, "type" | "onChange"> {
  value: string;
  onChange: (value: string) => void;
  className?: string;
  inputClassName?: string;
}

export const PasswordInput: React.FC<PasswordInputProps> = ({
  value,
  onChange,
  placeholder = "••••••••",
  className = "",
  inputClassName = "",
  disabled = false,
  ...rest
}) => {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <div className={`relative ${className}`}>
      <Lock className="w-4 h-4 text-zinc-500 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none shrink-0" />
      <input
        type={showPassword ? "text" : "password"}
        value={value}
        disabled={disabled}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className={`w-full bg-[#121316] border border-[#262830] focus:border-white/30 rounded-xl pl-10 pr-10 py-2.5 text-sm text-zinc-100 placeholder-zinc-500 outline-none transition-colors duration-200 ${
          disabled ? "opacity-50 cursor-not-allowed" : ""
        } ${inputClassName}`}
        {...rest}
      />
      <button
        type="button"
        tabIndex={-1}
        disabled={disabled}
        onClick={() => setShowPassword(!showPassword)}
        className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-zinc-100 transition p-1 cursor-pointer disabled:opacity-40"
        title={showPassword ? "Ẩn mật khẩu" : "Hiện mật khẩu"}
      >
        {showPassword ? (
          <EyeOff className="w-4 h-4" />
        ) : (
          <Eye className="w-4 h-4" />
        )}
      </button>
    </div>
  );
};
