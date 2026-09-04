"use client";

import React, { useRef, useEffect } from "react";
import { Send } from "lucide-react";

interface ChatInputProps {
  value: string;
  onChange: (value: string) => void;
  onSubmit: () => void;
  placeholder?: string;
  disabled?: boolean;
}

export const ChatInput: React.FC<ChatInputProps> = ({
  value,
  onChange,
  onSubmit,
  placeholder = "Nhập câu hỏi của bạn tại đây...",
  disabled = false,
}) => {
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Tự động co giãn chiều cao và chỉ bật thanh cuộn khi nội dung thực sự vượt quá 105px
  useEffect(() => {
    const el = textareaRef.current;
    if (!el) return;
    el.style.height = "auto";
    const isExceeded = el.scrollHeight > 105;
    el.style.height = `${Math.min(el.scrollHeight, 105)}px`;
    el.style.overflowY = isExceeded ? "auto" : "hidden";
  }, [value]);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      if (!disabled && value.trim()) {
        onSubmit();
      }
    }
  };

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        if (!disabled && value.trim()) onSubmit();
      }}
      className="p-3 bg-[#202228] border-t border-[#31333a] flex items-end gap-2.5"
    >
      {/* Khung bọc ngoài giữ bo góc và viền, thanh cuộn chỉ dịch nhẹ vừa đủ không bị cắt góc */}
      <div className="flex-1 max-h-[120px] min-h-[42px] bg-[#15161a] border border-[#353740] focus-within:border-amber-400/50 rounded-xl pl-3.5 pr-1 py-2 transition shadow-inner flex items-center">
        <textarea
          ref={textareaRef}
          rows={1}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          disabled={disabled}
          className="w-full max-h-[105px] min-h-[26px] resize-none overflow-hidden bg-transparent border-0 focus:outline-none focus:ring-0 text-sm text-white placeholder-zinc-500 leading-relaxed pr-0.5"
        />
      </div>
      <button
        type="submit"
        disabled={disabled || !value.trim()}
        className="h-10 px-4 rounded-xl bg-amber-400 hover:bg-amber-300 text-zinc-950 font-bold text-sm flex items-center justify-center gap-1.5 disabled:opacity-40 disabled:cursor-not-allowed transition shadow-sm hover:shadow-amber-400/20 active:scale-95 shrink-0 cursor-pointer"
        title="Gửi tin nhắn (Enter)"
      >
        <Send className="w-4 h-4 text-zinc-950 fill-zinc-950" />
        <span className="hidden sm:inline">Gửi</span>
      </button>
    </form>
  );
};
