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
  const containerRef = useRef<HTMLDivElement>(null);

  const selectedOption = options.find((opt) => opt.value === value);

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
        className={`w-full flex items-center justify-between gap-3 px-4 py-3 rounded-2xl border text-sm transition-all duration-200 cursor-pointer select-none ${
          isOpen
            ? "border-white/40 bg-[#12172A] shadow-lg shadow-black/50"
            : "border-white/10 bg-white/[0.03] hover:border-white/25 hover:bg-white/[0.05]"
        } ${disabled ? "opacity-50 cursor-not-allowed" : ""}`}
      >
        <div className="flex items-center gap-2.5 min-w-0 flex-1 text-left">
          {selectedOption?.icon && (
            <span className="shrink-0 text-base">{selectedOption.icon}</span>
          )}
          <div className="truncate">
            {selectedOption ? (
              <span className="font-medium text-slate-100">{selectedOption.label}</span>
            ) : (
              <span className="text-slate-500">{placeholder}</span>
            )}
            {selectedOption?.sublabel && (
              <span className="ml-2 text-xs text-slate-400 font-normal truncate hidden sm:inline">
                ({selectedOption.sublabel})
              </span>
            )}
          </div>
        </div>

        <ChevronDown
          className={`w-4 h-4 text-slate-400 transition-transform duration-200 shrink-0 ${
            isOpen ? "rotate-180 text-white" : ""
          }`}
        />
      </button>

      {/* 🌟 2-LAYER FLOATING DROPDOWN: Khung bo ngoài riêng biệt, thanh cuộn nằm lọt lòng bên trong */}
      {isOpen && (
        <div className="absolute left-0 right-0 mt-2 z-50 rounded-2xl border border-white/[0.12] bg-[#0E1322]/95 p-1.5 shadow-2xl backdrop-blur-2xl animate-in fade-in slide-in-from-top-2">
          <div className="max-h-56 overflow-y-auto pr-1 space-y-0.5">
            {options.map((opt) => {
              const isSelected = opt.value === value;
              return (
                <button
                  key={opt.value}
                  type="button"
                  onClick={() => handleSelect(opt.value)}
                  className={`w-full flex items-center justify-between gap-2.5 px-3 py-2.5 rounded-xl text-xs sm:text-sm font-medium transition-all text-left cursor-pointer ${
                    isSelected
                      ? "bg-white/[0.12] text-white font-semibold"
                      : "text-slate-300 hover:bg-white/[0.06] hover:text-white"
                  }`}
                >
                  <div className="flex items-center gap-2.5 min-w-0 flex-1">
                    {opt.icon && <span className="shrink-0 text-base">{opt.icon}</span>}
                    <div className="truncate">
                      <span className="text-slate-100">{opt.label}</span>
                      {opt.sublabel && (
                        <span className="ml-2 text-[11px] text-slate-400 font-normal">
                          ({opt.sublabel})
                        </span>
                      )}
                    </div>
                  </div>

                  {isSelected && (
                    <Check className="w-4 h-4 text-white shrink-0" />
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