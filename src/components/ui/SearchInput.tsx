"use client";

import React from "react";
import { Search, X } from "lucide-react";

export interface SearchInputProps
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, "onChange"> {
  value: string;
  onChange: (value: string) => void;
  onClear?: () => void;
  placeholder?: string;
  className?: string;
  inputClassName?: string;
}

export const SearchInput: React.FC<SearchInputProps> = ({
  value,
  onChange,
  onClear,
  placeholder = "Tìm kiếm...",
  className = "",
  inputClassName = "",
  disabled = false,
  ...rest
}) => {
  const handleClear = () => {
    onChange("");
    onClear?.();
  };

  return (
    <div className={`relative ${className}`}>
      <Search className="w-4 h-4 text-zinc-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none shrink-0" />
      <input
        type="text"
        value={value}
        disabled={disabled}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className={`w-full h-10 pl-10 pr-9 rounded-xl bg-[#191a1e] border border-[#2c2e35] text-xs sm:text-sm text-zinc-100 placeholder-zinc-500 focus:outline-none focus:border-[#525560] transition-colors duration-150 ${
          disabled ? "opacity-50 cursor-not-allowed" : ""
        } ${inputClassName}`}
        {...rest}
      />
      {value && !disabled && (
        <button
          type="button"
          onClick={handleClear}
          title="Xoá tìm kiếm"
          className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-white transition p-0.5 rounded cursor-pointer"
        >
          <X className="w-3.5 h-3.5" />
        </button>
      )}
    </div>
  );
};
