"use client";

import React, { useState, useRef, useEffect } from "react";
import { ChevronDown } from "lucide-react";

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
  className?: string;
  buttonClassName?: string;
  menuClassName?: string;
}

export const CustomSelect: React.FC<CustomSelectProps> = ({
  options,
  value,
  onChange,
  placeholder = "Chọn một mục...",
  disabled = false,
  className = "w-full",
  buttonClassName = "",
  menuClassName = "",
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [openUpward, setOpenUpward] = useState(false);
  const [menuMaxHeight, setMenuMaxHeight] = useState(256);
  const containerRef = useRef<HTMLDivElement>(null);
  const selectedItemRef = useRef<HTMLButtonElement>(null);

  const selectedOption = options.find((opt) => opt.value === value);

  useEffect(() => {
    if (!isOpen) return;

    const updatePositionAndHeight = () => {
      if (!containerRef.current) return;
      const rect = containerRef.current.getBoundingClientRect();
      const viewportHeight = window.innerHeight;
      const spaceBelow = viewportHeight - rect.bottom - 12;
      const spaceAbove = rect.top - 12;

      // Hướng thông minh: nếu bên dưới không đủ 240px VÀ bên trên rộng hơn bên dưới -> mở ngược lên
      const shouldOpenUpward = spaceBelow < 240 && spaceAbove > spaceBelow;
      setOpenUpward(shouldOpenUpward);

      const availableSpace = shouldOpenUpward ? spaceAbove : spaceBelow;
      // Tự động kẹp chiều cao menu tối đa theo đúng khoảng trống thực tế của màn hình (tối thiểu 120px, tối đa 260px)
      const maxH = Math.max(120, Math.min(260, Math.floor(availableSpace)));
      setMenuMaxHeight(maxH);
    };

    updatePositionAndHeight();

    window.addEventListener("resize", updatePositionAndHeight);
    window.addEventListener("scroll", updatePositionAndHeight, true);
    return () => {
      window.removeEventListener("resize", updatePositionAndHeight);
      window.removeEventListener("scroll", updatePositionAndHeight, true);
    };
  }, [isOpen]);

  // Tự động cuộn đến phần tử đang được chọn khi mở dropdown
  useEffect(() => {
    if (isOpen && selectedItemRef.current) {
      selectedItemRef.current.scrollIntoView({ block: "nearest" });
    }
  }, [isOpen]);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isOpen) return;
      if (e.key === "Escape") {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen]);

  const handleSelect = (val: string) => {
    onChange(val);
    setIsOpen(false);
  };

  return (
    <div className={`relative ${className} ${isOpen ? "z-50" : ""}`} ref={containerRef}>
      {/* Trigger Button - h-10 đồng bộ chuẩn với ô input */}
      <button
        type="button"
        disabled={disabled}
        onClick={() => setIsOpen(!isOpen)}
        aria-haspopup="listbox"
        aria-expanded={isOpen}
        className={`w-full h-10 flex items-center justify-between gap-2.5 px-3.5 rounded-xl border text-xs sm:text-sm transition-all duration-150 cursor-pointer select-none ${
          isOpen
            ? "border-zinc-400 bg-[#25262c] shadow-lg shadow-black/40 ring-1 ring-zinc-400/40"
            : "border-[#31333a] bg-[#212227] hover:border-[#454854] hover:bg-[#25262c]"
        } ${disabled ? "opacity-50 cursor-not-allowed" : ""} ${buttonClassName}`}
      >
        <div className="flex items-center gap-2 min-w-0 flex-1 text-left">
          {selectedOption?.icon && (
            <span className="shrink-0 text-sm flex items-center">{selectedOption.icon}</span>
          )}
          <span className={`truncate ${selectedOption ? "text-zinc-100 font-normal" : "text-zinc-500"}`}>
            {selectedOption ? selectedOption.label : placeholder}
          </span>
          {selectedOption?.sublabel && (
            <span className="text-[10px] px-1.5 py-0.5 rounded border text-zinc-400 bg-white/[0.04] border-white/5 shrink-0 ml-auto">
              {selectedOption.sublabel}
            </span>
          )}
        </div>

        <ChevronDown
          className={`w-4 h-4 text-zinc-400 transition-transform duration-200 shrink-0 ${
            isOpen ? "rotate-180 text-zinc-100" : ""
          }`}
        />
      </button>

      {/* Floating Dropdown Menu */}
      {isOpen && (
        <div
          role="listbox"
          className={`absolute left-0 right-0 z-[100] rounded-xl border border-[#353740] bg-[#1a1b20]/95 backdrop-blur-xl p-1 shadow-2xl shadow-black/90 transition-all ${
            openUpward
              ? "bottom-full mb-1.5 origin-bottom"
              : "top-full mt-1.5 origin-top"
          } ${menuClassName}`}
        >
          <div
            style={{ maxHeight: `${menuMaxHeight}px` }}
            className="overflow-y-auto space-y-0.5 [scrollbar-width:thin] [&::-webkit-scrollbar]:w-1 [&::-webkit-scrollbar-thumb]:bg-zinc-700 [&::-webkit-scrollbar-thumb]:rounded-full"
          >
            {options.map((opt) => {
              const isSelected = opt.value === value;
              return (
                <button
                  key={opt.value}
                  ref={isSelected ? selectedItemRef : undefined}
                  type="button"
                  role="option"
                  aria-selected={isSelected}
                  onClick={() => handleSelect(opt.value)}
                  className={`w-full flex items-center justify-between gap-2 px-3 py-2 rounded-lg text-xs sm:text-sm font-normal transition-colors text-left cursor-pointer ${
                    isSelected
                      ? "bg-[#2c2d36] text-white font-medium border border-zinc-700/60 shadow-sm"
                      : "text-zinc-300 hover:bg-[#25262c] hover:text-white"
                  }`}
                >
                  <div className="flex items-center gap-2 min-w-0 flex-1">
                    {opt.icon && <span className="shrink-0 text-sm flex items-center">{opt.icon}</span>}
                    <span className="truncate">{opt.label}</span>
                    {opt.sublabel && (
                      <span
                        className={`text-[10px] px-1.5 py-0.5 rounded border shrink-0 transition-colors ml-auto ${
                          isSelected
                            ? "text-amber-300 bg-amber-400/20 border-amber-400/30 font-medium"
                            : "text-zinc-400 bg-white/[0.04] border-white/5"
                        }`}
                      >
                        {opt.sublabel}
                      </span>
                    )}
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};