"use client";

import React, { useState, useRef, useEffect, useMemo } from "react";
import { Calendar as CalendarIcon, ChevronLeft, ChevronRight, X } from "lucide-react";

export interface DatePickerProps {
  value?: string; // Format: YYYY-MM-DD
  onChange: (value: string) => void;
  placeholder?: string;
  minDate?: string; // YYYY-MM-DD
  maxDate?: string; // YYYY-MM-DD
  disabled?: boolean;
  className?: string;
}

const MONTH_NAMES = [
  "Tháng 1", "Tháng 2", "Tháng 3", "Tháng 4", "Tháng 5", "Tháng 6",
  "Tháng 7", "Tháng 8", "Tháng 9", "Tháng 10", "Tháng 11", "Tháng 12"
];

const MONTH_SHORT = [
  "1", "2", "3", "4", "5", "6",
  "7", "8", "9", "10", "11", "12"
];

const WEEKDAY_NAMES = ["T2", "T3", "T4", "T5", "T6", "T7", "CN"];

function parseDate(str?: string): { year: number; month: number; day: number } | null {
  if (!str) return null;
  const clean = str.trim().split("T")[0].split(" ")[0];
  if (clean.includes("-")) {
    const parts = clean.split("-").map(Number);
    if (parts.length === 3 && !parts.some(isNaN)) {
      return { year: parts[0], month: parts[1] - 1, day: parts[2] };
    }
  }
  if (clean.includes("/")) {
    const parts = clean.split("/").map(Number);
    if (parts.length === 3 && !parts.some(isNaN)) {
      return { year: parts[2], month: parts[1] - 1, day: parts[0] };
    }
  }
  return null;
}

function toIsoString(year: number, month: number, day: number): string {
  const m = String(month + 1).padStart(2, "0");
  const d = String(day).padStart(2, "0");
  return `${year}-${m}-${d}`;
}

/**
 * Smart Date Sanitizer & Auto-Clamping:
 * - Automatically places '/' after valid day (2 digits or 1 digit > 3)
 * - Automatically places '/' after valid month (2 digits or 1 digit > 1)
 * - Clamps day to 1..31 (or max days in that specific month, e.g. 30 in April, 28/29 in Feb)
 * - Clamps month to 1..12
 * - Clamps year to minYear..maxYear (e.g. 1900..currentYear)
 * - Prevents future dates beyond maxDate
 * - Never produces invalid dates like 32/33/3223 or 31/04/2026
 */
export function sanitizeDateInput(
  raw: string,
  maxDateStr?: string,
  minDateStr?: string
): { text: string; iso: string | null } {
  const today = new Date();
  const fallbackMax = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, "0")}-${String(today.getDate()).padStart(2, "0")}`;
  const effectiveMax = maxDateStr || fallbackMax;
  const effectiveMin = minDateStr || "1900-01-01";

  const maxParts = effectiveMax.split("-").map(Number);
  const maxYear = maxParts[0];
  const maxMonth = maxParts[1];
  const maxDay = maxParts[2];

  const minParts = effectiveMin.split("-").map(Number);
  const minYear = minParts[0];

  if (!raw) return { text: "", iso: null };

  // Strip anything that isn't digit or slash, collapse multiple slashes
  const cleaned = raw.replace(/[^\d/]/g, "").replace(/\/+/g, "/");
  if (!cleaned) return { text: "", iso: null };

  let parts = cleaned.split("/");

  // If user pasted or typed continuous digits like 15051995 or 32333223
  if (parts.length === 1 && parts[0].length > 2) {
    const d = parts[0];
    parts = [d.slice(0, 2), d.slice(2, 4), d.slice(4, 8)].filter(Boolean);
  }

  let dayStr = parts[0] ? parts[0].slice(0, 2) : "";
  let monthStr = parts[1] !== undefined ? parts[1].slice(0, 2) : "";
  let yearStr = parts[2] !== undefined ? parts[2].slice(0, 4) : "";

  // 1. Sanitize Day
  let dayNum: number | null = null;
  let dayFinished = parts.length > 1;

  if (dayStr.length === 1) {
    const d1 = parseInt(dayStr, 10);
    if (d1 > 3 || dayFinished) {
      dayStr = "0" + (d1 === 0 ? 1 : d1);
      dayFinished = true;
    }
  } else if (dayStr.length === 2) {
    let d = parseInt(dayStr, 10);
    if (d === 0) d = 1;
    if (d > 31) d = 31;
    dayStr = String(d).padStart(2, "0");
    dayFinished = true;
  }

  if (dayStr.length === 2) {
    dayNum = parseInt(dayStr, 10);
  }

  // 2. Sanitize Month
  let monthNum: number | null = null;
  let monthFinished = parts.length > 2;

  if (monthStr.length === 1) {
    const m1 = parseInt(monthStr, 10);
    if (m1 > 1 || monthFinished) {
      monthStr = "0" + (m1 === 0 ? 1 : m1);
      monthFinished = true;
    }
  } else if (monthStr.length === 2) {
    let m = parseInt(monthStr, 10);
    if (m === 0) m = 1;
    if (m > 12) m = 12;
    monthStr = String(m).padStart(2, "0");
    monthFinished = true;
  }

  if (monthStr.length === 2) {
    monthNum = parseInt(monthStr, 10);
  }

  // 3. Cross-validate Day against Month (if month is known)
  if (dayNum !== null && monthNum !== null) {
    const testYear = yearStr.length === 4 ? parseInt(yearStr, 10) : 2024;
    const maxDays = new Date(testYear, monthNum, 0).getDate();
    if (dayNum > maxDays) {
      dayNum = maxDays;
      dayStr = String(maxDays).padStart(2, "0");
    }
  }

  // 4. Sanitize Year
  let yearNum: number | null = null;
  if (yearStr.length === 4) {
    let y = parseInt(yearStr, 10);
    if (y > maxYear) y = maxYear;
    if (y < minYear) y = minYear;
    yearStr = String(y);
    yearNum = y;

    // Cross-validate with maxDate (prevent future dates within same year)
    if (yearNum === maxYear && monthNum !== null) {
      if (monthNum > maxMonth) {
        monthNum = maxMonth;
        monthStr = String(maxMonth).padStart(2, "0");
      }
      if (monthNum === maxMonth && dayNum !== null) {
        if (dayNum > maxDay) {
          dayNum = maxDay;
          dayStr = String(maxDay).padStart(2, "0");
        }
      }
    }

    // Re-verify Feb for leap year
    if (dayNum !== null && monthNum === 2) {
      const maxDaysFeb = new Date(yearNum, 2, 0).getDate();
      if (dayNum > maxDaysFeb) {
        dayNum = maxDaysFeb;
        dayStr = String(maxDaysFeb).padStart(2, "0");
      }
    }
  }

  // Assemble formatted string
  let text = dayStr;
  if (dayFinished || parts.length > 1) {
    text += "/";
    if (monthStr) {
      text += monthStr;
      if (monthFinished || parts.length > 2) {
        text += "/";
        if (yearStr) {
          text += yearStr;
        }
      }
    }
  }

  let iso: string | null = null;
  if (dayNum && monthNum && yearNum && yearStr.length === 4) {
    iso = `${yearNum}-${String(monthNum).padStart(2, "0")}-${String(dayNum).padStart(2, "0")}`;
  }

  return { text, iso };
}

export const DatePicker: React.FC<DatePickerProps> = ({
  value,
  onChange,
  placeholder = "Chọn ngày sinh (dd/mm/yyyy)...",
  minDate,
  maxDate,
  disabled = false,
  className = "",
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [viewMode, setViewMode] = useState<"DAYS" | "MONTHS" | "YEARS">("DAYS");
  const containerRef = useRef<HTMLDivElement>(null);

  // Parse current selected date
  const parsedValue = useMemo(() => parseDate(value), [value]);

  // View state (the month & year currently displayed in calendar)
  const today = useMemo(() => new Date(), []);
  const [viewYear, setViewYear] = useState(() => parsedValue?.year ?? today.getFullYear());
  const [viewMonth, setViewMonth] = useState(() => parsedValue?.month ?? today.getMonth());
  const [decadeStart, setDecadeStart] = useState(() => Math.floor((parsedValue?.year ?? today.getFullYear()) / 12) * 12);

  // Keep view in sync when value changes externally
  useEffect(() => {
    if (parsedValue) {
      setViewYear(parsedValue.year);
      setViewMonth(parsedValue.month);
      setDecadeStart(Math.floor(parsedValue.year / 12) * 12);
    }
  }, [value]); // eslint-disable-line react-hooks/exhaustive-deps

  // Reset viewMode when closing/opening
  useEffect(() => {
    if (isOpen) {
      setViewMode("DAYS");
      if (parsedValue) {
        setViewYear(parsedValue.year);
        setViewMonth(parsedValue.month);
        setDecadeStart(Math.floor(parsedValue.year / 12) * 12);
      }
    }
  }, [isOpen]); // eslint-disable-line react-hooks/exhaustive-deps

  // Close on outside click or Escape
  useEffect(() => {
    if (!isOpen) return;

    const handleOutsideClick = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleOutsideClick);
    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("mousedown", handleOutsideClick);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen]);

  // Days grid calculation
  const daysInGrid = useMemo(() => {
    const firstDayOfMonth = new Date(viewYear, viewMonth, 1);
    const lastDayOfMonth = new Date(viewYear, viewMonth + 1, 0);

    const totalDays = lastDayOfMonth.getDate();
    // Monday is first day of week (0 = Monday, 6 = Sunday)
    const startingDayOfWeek = (firstDayOfMonth.getDay() + 6) % 7;
    const prevMonthLastDay = new Date(viewYear, viewMonth, 0).getDate();

    const days: {
      day: number;
      month: number;
      year: number;
      isCurrentMonth: boolean;
      iso: string;
      disabled: boolean;
    }[] = [];

    // Previous month padding
    for (let i = startingDayOfWeek - 1; i >= 0; i--) {
      const d = prevMonthLastDay - i;
      const m = viewMonth === 0 ? 11 : viewMonth - 1;
      const y = viewMonth === 0 ? viewYear - 1 : viewYear;
      const iso = toIsoString(y, m, d);
      days.push({
        day: d,
        month: m,
        year: y,
        isCurrentMonth: false,
        iso,
        disabled: Boolean((minDate && iso < minDate) || (maxDate && iso > maxDate)),
      });
    }

    // Current month days
    for (let d = 1; d <= totalDays; d++) {
      const iso = toIsoString(viewYear, viewMonth, d);
      days.push({
        day: d,
        month: viewMonth,
        year: viewYear,
        isCurrentMonth: true,
        iso,
        disabled: Boolean((minDate && iso < minDate) || (maxDate && iso > maxDate)),
      });
    }

    // Next month padding to complete row
    const remaining = (7 - (days.length % 7)) % 7;
    for (let d = 1; d <= remaining; d++) {
      const m = viewMonth === 11 ? 0 : viewMonth + 1;
      const y = viewMonth === 11 ? viewYear + 1 : viewYear;
      const iso = toIsoString(y, m, d);
      days.push({
        day: d,
        month: m,
        year: y,
        isCurrentMonth: false,
        iso,
        disabled: Boolean((minDate && iso < minDate) || (maxDate && iso > maxDate)),
      });
    }

    return days;
  }, [viewYear, viewMonth, minDate, maxDate]);

  // 12 years for decade view
  const decadeYears = useMemo(() => {
    const list: number[] = [];
    for (let i = 0; i < 12; i++) {
      list.push(decadeStart + i);
    }
    return list;
  }, [decadeStart]);

  // Handlers for Navigation
  const handlePrev = () => {
    if (viewMode === "DAYS") {
      if (viewMonth === 0) {
        setViewMonth(11);
        setViewYear((y) => y - 1);
      } else {
        setViewMonth((m) => m - 1);
      }
    } else if (viewMode === "MONTHS") {
      setViewYear((y) => y - 1);
    } else if (viewMode === "YEARS") {
      setDecadeStart((ds) => ds - 12);
    }
  };

  const handleNext = () => {
    if (viewMode === "DAYS") {
      if (viewMonth === 11) {
        setViewMonth(0);
        setViewYear((y) => y + 1);
      } else {
        setViewMonth((m) => m + 1);
      }
    } else if (viewMode === "MONTHS") {
      setViewYear((y) => y + 1);
    } else if (viewMode === "YEARS") {
      setDecadeStart((ds) => ds + 12);
    }
  };

  const handleSelectDay = (iso: string) => {
    onChange(iso);
    setIsOpen(false);
  };

  const handleSelectMonth = (mIdx: number) => {
    setViewMonth(mIdx);
    setViewMode("DAYS");
  };

  const handleSelectYear = (year: number) => {
    setViewYear(year);
    setViewMode("MONTHS");
  };

  // Input string (DD/MM/YYYY)
  const [inputValue, setInputValue] = useState("");

  // Keep inputValue in sync when external value changes
  useEffect(() => {
    if (parsedValue) {
      const d = String(parsedValue.day).padStart(2, "0");
      const m = String(parsedValue.month + 1).padStart(2, "0");
      setInputValue(`${d}/${m}/${parsedValue.year}`);
    } else {
      setInputValue("");
    }
  }, [value, parsedValue]);

  const isDeletingRef = useRef(false);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
      e.currentTarget.blur();
      setIsOpen(false);
      return;
    }

    if (e.key === "Backspace" || e.key === "Delete") {
      isDeletingRef.current = true;

      // Smart Backspace over '/'
      if (e.key === "Backspace") {
        const input = e.currentTarget;
        const { selectionStart, selectionEnd } = input;
        if (selectionStart !== null && selectionStart === selectionEnd) {
          // If cursor is right after '/', e.g. "15/|"
          if (selectionStart > 0 && inputValue[selectionStart - 1] === "/") {
            e.preventDefault();
            // Delete both the slash and the preceding digit
            const next = inputValue.slice(0, selectionStart - 2) + inputValue.slice(selectionStart);
            setInputValue(next);
            isDeletingRef.current = false;
            if (!next.trim()) onChange("");
            return;
          }
        }
      }
    } else {
      isDeletingRef.current = false;
    }
  };

  // Handle typing or pasting in the input box with smart sanitization
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const raw = e.target.value;
    const isDeleting = isDeletingRef.current || raw.length < inputValue.length;

    if (!raw.trim()) {
      setInputValue("");
      onChange("");
      return;
    }

    if (isDeleting) {
      // When deleting, let user delete without auto-adding slashes or clamping
      const cleaned = raw.replace(/[^\d/]/g, "").slice(0, 10);
      setInputValue(cleaned);
      return;
    }

    // Forward typing or pasting: run smart sanitizer
    const { text, iso } = sanitizeDateInput(raw, maxDate, minDate);
    setInputValue(text);

    if (iso) {
      onChange(iso);
      const p = parseDate(iso);
      if (p) {
        setViewYear(p.year);
        setViewMonth(p.month);
        setDecadeStart(Math.floor(p.year / 12) * 12);
      }
    }
  };

  const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    // If focus is still inside the DatePicker container (e.g. popover buttons), don't revert
    if (containerRef.current && containerRef.current.contains(e.relatedTarget as Node)) {
      return;
    }

    if (!inputValue.trim()) {
      onChange("");
      return;
    }

    // Support 2-digit year typing (e.g. 15/05/95 -> 15/05/1995)
    const parts = inputValue.split("/");
    if (parts.length === 3 && parts[2].length === 2 && parts[0] && parts[1]) {
      const yr2 = parseInt(parts[2], 10);
      const current2 = today.getFullYear() % 100;
      const fullYear = yr2 <= current2 ? 2000 + yr2 : 1900 + yr2;
      const expanded = `${parts[0]}/${parts[1]}/${fullYear}`;
      const res = sanitizeDateInput(expanded, maxDate, minDate);
      if (res.iso) {
        setInputValue(res.text);
        onChange(res.iso);
        const p = parseDate(res.iso);
        if (p) {
          setViewYear(p.year);
          setViewMonth(p.month);
          setDecadeStart(Math.floor(p.year / 12) * 12);
        }
        return;
      }
    }

    // If full 10-char date (DD/MM/YYYY), sanitize and commit
    if (inputValue.length === 10) {
      const res = sanitizeDateInput(inputValue, maxDate, minDate);
      if (res.iso) {
        setInputValue(res.text);
        onChange(res.iso);
        const p = parseDate(res.iso);
        if (p) {
          setViewYear(p.year);
          setViewMonth(p.month);
          setDecadeStart(Math.floor(p.year / 12) * 12);
        }
        return;
      }
    }

    // If incomplete or invalid, restore previous valid date or clear
    if (parsedValue) {
      const d = String(parsedValue.day).padStart(2, "0");
      const m = String(parsedValue.month + 1).padStart(2, "0");
      setInputValue(`${d}/${m}/${parsedValue.year}`);
    } else {
      setInputValue("");
      onChange("");
    }
  };

  const handleClear = (e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    setInputValue("");
    onChange("");
  };

  const handleSelectToday = () => {
    const todayIso = toIsoString(today.getFullYear(), today.getMonth(), today.getDate());
    if (maxDate && todayIso > maxDate) return;
    if (minDate && todayIso < minDate) return;
    onChange(todayIso);
    setIsOpen(false);
  };

  return (
    <div ref={containerRef} className={`relative w-full ${className}`}>
      {/* Input Field with Calendar Icon & Clear Button */}
      <div
        className={`w-full h-10 rounded-xl bg-[#212227] border px-3 flex items-center justify-between text-xs sm:text-sm transition ${
          disabled
            ? "opacity-50 cursor-not-allowed border-[#31333a]"
            : isOpen
            ? "border-amber-400/70 ring-1 ring-amber-400/20 shadow-md"
            : "border-[#31333a] hover:border-zinc-500"
        }`}
      >
        <button
          type="button"
          tabIndex={-1}
          onClick={() => !disabled && setIsOpen(!isOpen)}
          className="p-1 -ml-1 text-amber-400/90 hover:text-amber-300 transition cursor-pointer shrink-0"
          title="Mở/Đóng bảng chọn ngày"
        >
          <CalendarIcon className="w-4 h-4" />
        </button>

        <input
          type="text"
          disabled={disabled}
          value={inputValue}
          onChange={handleInputChange}
          onKeyDown={handleKeyDown}
          onBlur={handleBlur}
          onFocus={() => !disabled && setIsOpen(true)}
          placeholder={placeholder}
          maxLength={10}
          className="w-full bg-transparent border-none outline-none text-xs sm:text-sm text-zinc-100 placeholder:text-zinc-500 px-2 py-1 font-medium tracking-wide"
        />

        <div className="flex items-center gap-1 shrink-0">
          {inputValue && !disabled && (
            <button
              type="button"
              onClick={handleClear}
              className="p-1 rounded-md text-zinc-400 hover:text-white hover:bg-zinc-700/50 transition cursor-pointer"
              title="Xóa ngày đã chọn"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </div>

      {/* Calendar Dropdown Popover (Compact & 100% In-Card) */}
      {isOpen && (
        <div className="absolute top-full left-0 mt-1.5 z-50 w-[245px] rounded-xl border border-white/10 bg-[#16171a] p-2.5 shadow-2xl backdrop-blur-xl animate-in fade-in zoom-in-95 duration-150">
          {/* Header Navigation */}
          <div className="flex items-center justify-between gap-1 mb-2 pb-1.5 border-b border-white/[0.08]">
            <button
              type="button"
              onClick={handlePrev}
              className="p-1 rounded-md text-zinc-400 hover:text-white hover:bg-white/[0.08] transition cursor-pointer"
              title="Trước"
            >
              <ChevronLeft className="w-3.5 h-3.5" />
            </button>

            {/* Mode Switcher Buttons */}
            <div className="flex items-center gap-1 text-xs">
              {viewMode === "DAYS" && (
                <>
                  <button
                    type="button"
                    onClick={() => setViewMode("MONTHS")}
                    className="px-2 py-0.5 rounded-md font-semibold text-zinc-200 hover:text-amber-300 hover:bg-white/[0.06] transition cursor-pointer flex items-center gap-0.5"
                  >
                    <span>{MONTH_NAMES[viewMonth]}</span>
                    <span className="text-[9px] text-zinc-500">▾</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setDecadeStart(Math.floor(viewYear / 12) * 12);
                      setViewMode("YEARS");
                    }}
                    className="px-2 py-0.5 rounded-md font-semibold text-zinc-200 hover:text-amber-300 hover:bg-white/[0.06] transition cursor-pointer flex items-center gap-0.5"
                  >
                    <span>{viewYear}</span>
                    <span className="text-[9px] text-zinc-500">▾</span>
                  </button>
                </>
              )}

              {viewMode === "MONTHS" && (
                <button
                  type="button"
                  onClick={() => {
                    setDecadeStart(Math.floor(viewYear / 12) * 12);
                    setViewMode("YEARS");
                  }}
                  className="px-2 py-0.5 rounded-md font-semibold text-zinc-200 hover:text-amber-300 hover:bg-white/[0.06] transition cursor-pointer flex items-center gap-1"
                >
                  <span>Năm {viewYear}</span>
                  <span className="text-[9px] text-zinc-500">▾</span>
                </button>
              )}

              {viewMode === "YEARS" && (
                <span className="px-2 py-0.5 font-semibold text-zinc-200 text-[11px]">
                  {decadeStart} - {decadeStart + 11}
                </span>
              )}
            </div>

            <button
              type="button"
              onClick={handleNext}
              className="p-1 rounded-md text-zinc-400 hover:text-white hover:bg-white/[0.08] transition cursor-pointer"
              title="Sau"
            >
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* VIEW 1: DAYS VIEW */}
          {viewMode === "DAYS" && (
            <>
              {/* Weekday Row */}
              <div className="grid grid-cols-7 gap-0.5 text-center mb-1">
                {WEEKDAY_NAMES.map((w, idx) => (
                  <span
                    key={w}
                    className={`text-[10px] font-semibold ${
                      idx >= 5 ? "text-amber-400/80" : "text-zinc-500"
                    }`}
                  >
                    {w}
                  </span>
                ))}
              </div>

              {/* Days Grid */}
              <div className="grid grid-cols-7 gap-0.5">
                {daysInGrid.map((item, idx) => {
                  const isSelected = value === item.iso;
                  const isToday =
                    item.iso === toIsoString(today.getFullYear(), today.getMonth(), today.getDate());

                  let btnClass = "h-7 w-7 mx-auto rounded-md text-[11px] font-medium flex items-center justify-center transition-all ";

                  if (item.disabled) {
                    btnClass += "text-zinc-600 cursor-not-allowed opacity-30";
                  } else if (isSelected) {
                    btnClass += "bg-amber-400 text-zinc-950 font-bold shadow-sm";
                  } else if (isToday) {
                    btnClass += "border border-amber-400/60 text-amber-300 font-semibold hover:bg-white/[0.08]";
                  } else if (!item.isCurrentMonth) {
                    btnClass += "text-zinc-600 hover:bg-white/[0.04] hover:text-zinc-400 cursor-pointer";
                  } else {
                    btnClass += "text-zinc-200 hover:bg-white/[0.08] hover:text-white cursor-pointer";
                  }

                  return (
                    <button
                      key={idx}
                      type="button"
                      disabled={item.disabled}
                      onClick={() => !item.disabled && handleSelectDay(item.iso)}
                      className={btnClass}
                    >
                      {item.day}
                    </button>
                  );
                })}
              </div>
            </>
          )}

          {/* VIEW 2: MONTHS SELECTOR (4x3 Grid) */}
          {viewMode === "MONTHS" && (
            <div className="grid grid-cols-3 gap-1.5 py-1">
              {MONTH_SHORT.map((name, idx) => {
                const isCurrentMonth = viewMonth === idx;
                const isSelectedMonth = parsedValue?.year === viewYear && parsedValue?.month === idx;
                const maxParts = maxDate ? maxDate.split("-").map(Number) : null;
                const isFutureMonth = maxParts
                  ? viewYear > maxParts[0] || (viewYear === maxParts[0] && idx + 1 > maxParts[1])
                  : false;

                return (
                  <button
                    key={idx}
                    type="button"
                    disabled={isFutureMonth}
                    onClick={() => !isFutureMonth && handleSelectMonth(idx)}
                    className={`py-2 px-1 rounded-lg text-xs font-semibold transition ${
                      isFutureMonth
                        ? "opacity-30 cursor-not-allowed text-zinc-600"
                        : isSelectedMonth
                        ? "bg-amber-400 text-zinc-950 shadow-sm cursor-pointer"
                        : isCurrentMonth
                        ? "border border-amber-400/50 text-amber-300 hover:bg-white/[0.08] cursor-pointer"
                        : "bg-white/[0.03] text-zinc-300 hover:bg-white/[0.08] hover:text-white cursor-pointer"
                    }`}
                  >
                    {name}
                  </button>
                );
              })}
            </div>
          )}

          {/* VIEW 3: YEARS SELECTOR (4x3 Grid for Decade) */}
          {viewMode === "YEARS" && (
            <div className="grid grid-cols-3 gap-1.5 py-1">
              {decadeYears.map((yr) => {
                const isCurrentYear = yr === today.getFullYear();
                const isSelectedYear = parsedValue?.year === yr;
                const isFutureYear = maxDate ? yr > Number(maxDate.split("-")[0]) : false;

                return (
                  <button
                    key={yr}
                    type="button"
                    disabled={isFutureYear}
                    onClick={() => !isFutureYear && handleSelectYear(yr)}
                    className={`py-2 px-1 rounded-lg text-xs font-semibold transition ${
                      isFutureYear
                        ? "opacity-30 cursor-not-allowed text-zinc-600"
                        : isSelectedYear
                        ? "bg-amber-400 text-zinc-950 shadow-sm cursor-pointer"
                        : isCurrentYear
                        ? "border border-amber-400/50 text-amber-300 hover:bg-white/[0.08] cursor-pointer"
                        : "bg-white/[0.03] text-zinc-300 hover:bg-white/[0.08] hover:text-white cursor-pointer"
                    }`}
                  >
                    {yr}
                  </button>
                );
              })}
            </div>
          )}

          {/* Quick Footer Action Row */}
          <div className="flex items-center justify-between pt-2 mt-2 border-t border-white/[0.08] text-[10px]">
            <button
              type="button"
              onClick={handleClear}
              className="text-zinc-400 hover:text-zinc-200 transition cursor-pointer"
            >
              Xóa
            </button>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={handleSelectToday}
                className="text-amber-300 hover:text-amber-200 font-medium transition cursor-pointer"
              >
                Hôm nay
              </button>
              <button
                type="button"
                onClick={() => setIsOpen(false)}
                className="px-1.5 py-0.5 rounded bg-white/[0.06] hover:bg-white/[0.1] text-zinc-300 transition cursor-pointer"
              >
                Đóng
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
