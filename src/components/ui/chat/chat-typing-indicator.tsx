"use client";

import React from "react";

export const ChatTypingIndicator: React.FC<{ message?: string }> = ({
  message = "Đang kết nối năng lượng lá bài...",
}) => {
  return (
    <div className="flex items-center gap-2.5 px-4 py-3 rounded-2xl rounded-bl-xs bg-[#202228] border border-[#31333a] shadow-sm">
      <div className="flex items-center gap-1 py-1">
        <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-bounce [animation-delay:-0.3s]" />
        <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-bounce [animation-delay:-0.15s]" />
        <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-bounce" />
      </div>
      <span className="text-xs text-zinc-400 font-medium pl-1">{message}</span>
    </div>
  );
};
