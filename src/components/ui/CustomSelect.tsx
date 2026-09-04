"use client";

import React, { useState, useRef, useEffect } from "react";
import { ChevronDown, Check } from "lucide-react";

export interface OptionItem {
  value: string;
  label: string;
  sublabel?: string;
  icon?: React.ReactNode;
}

interface CustomSelectProps {
  options: OptionItem[];
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  disabled?: boolean;
}

export const CustomSelect: React.FC<CustomSelectProps> = ({
  options,
  value,
  onChange,
  placeholder = "Chọn một mục...",
  disabled = false,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [openUpward, setOpenUpward] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const selectedOption = options.find((opt) => opt.value === value);

  useEffect(() => {
    if (isOpen && containerRef.current) {
      const rect = containerRef.current.getBoundingClientRect();
      const viewportHeight = window.innerHeight;
      const spaceBelow = viewportHeight - rect.bottom;
      const spaceAbove = rect.top;
      // Nếu không gian bên dưới ít hơn 250px và bên trên rộng hơn, tự động mở ngược lên trên
      if (spaceBelow < 250 && spaceAbove > spaceBelow) {
        setOpenUpward(true);
      } else {
        setOpenUpward(false);
      }
    }
  }, [isOpen]);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSelect = (val: string) => {
    onChange(val);
    setIsOpen(false);
  };

  return (
    <div className="relative w-full" ref={containerRef}>
      {/* Trigger Button */}
      <button
        type="button"
        disabled={disabled}
        onClick={() => setIsOpen(!isOpen)}
        className={`w-full flex items-center justify-between gap-3 px-4 py-2.5 sm:py-3 rounded-2xl border text-sm transition-all duration-200 cursor-pointer select-none ${
          isOpen
            ? "border-zinc-400 bg-[#25262c] shadow-lg shadow-black/50 ring-1 ring-zinc-400/30"
            : "border-[#31333a] bg-[#212227] hover:border-[#454854] hover:bg-[#25262c]"
        } ${disabled ? "opacity-50 cursor-not-allowed" : ""}`}
      >
        <div className="flex items-center gap-2.5 min-w-0 flex-1 text-left">
          {selectedOption?.icon && (
            <span className="shrink-0 text-base">{selectedOption.icon}</span>
          )}
          <div className="truncate">
            {selectedOption ? (
              <span className="font-medium text-zinc-100">{selectedOption.label}</span>
            ) : (
              <span className="text-zinc-500">{placeholder}</span>
            )}
          </div>
        </div>

        <ChevronDown
          className={`w-4 h-4 text-zinc-400 transition-transform duration-200 shrink-0 ${
            isOpen ? "rotate-180 text-zinc-100" : ""
          }`}
        />
      </button>

      {/* 🌟 2-LAYER FLOATING DROPDOWN: Tự động lật lên trên nếu gần đáy màn hình & chuẩn tone Dark Zinc */}
      {isOpen && (
        <div
          className={`absolute left-0 right-0 z-[100] rounded-2xl border border-[#383a44] bg-[#1a1b20] p-1.5 shadow-2xl shadow-black/90 backdrop-blur-2xl animate-in fade-in ${
            openUpward
              ? "bottom-full mb-2 slide-in-from-bottom-2 origin-bottom"
              : "top-full mt-2 slide-in-from-top-2 origin-top"
          }`}
        >
          <div className="max-h-52 overflow-y-auto pr-1 space-y-0.5">
            {options.map((opt) => {
              const isSelected = opt.value === value;
              return (
                <button
                  key={opt.value}
                  type="button"
                  onClick={() => handleSelect(opt.value)}
                  className={`w-full flex items-center justify-between gap-2.5 px-3 py-2.5 rounded-xl text-xs sm:text-sm font-medium transition-all text-left cursor-pointer ${
                    isSelected
                      ? "bg-[#2b2c34] text-white font-semibold border border-zinc-700/60 shadow-sm"
                      : "text-zinc-300 hover:bg-[#25262c] hover:text-white"
                  }`}
                >
                  <div className="flex items-center gap-2.5 min-w-0 flex-1">
                    {opt.icon && <span className="shrink-0 text-base">{opt.icon}</span>}
                    <div className="truncate">
                      <span className={isSelected ? "text-white font-semibold" : "text-zinc-200"}>{opt.label}</span>
                    </div>
                  </div>

                  {isSelected && (
                    <Check className="w-4 h-4 text-amber-300 shrink-0" />
                  )}
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};