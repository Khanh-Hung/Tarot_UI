"use client";

import React, { useEffect, useRef, useState } from "react";
import { ArrowDown } from "lucide-react";

interface ChatMessageListProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  smoothScroll?: boolean;
}

export const ChatMessageList = React.forwardRef<HTMLDivElement, ChatMessageListProps>(
  ({ children, className, smoothScroll = true, ...props }, ref) => {
    const internalRef = useRef<HTMLDivElement>(null);
    const scrollContainerRef = (ref as React.RefObject<HTMLDivElement>) || internalRef;
    const [showScrollBottom, setShowScrollBottom] = useState(false);

    const handleScroll = () => {
      const container = scrollContainerRef.current;
      if (!container) return;
      const isAtBottom = container.scrollHeight - container.scrollTop - container.clientHeight < 60;
      setShowScrollBottom(!isAtBottom);
    };

    const scrollToBottom = () => {
      const container = scrollContainerRef.current;
      if (!container) return;
      container.scrollTo({
        top: container.scrollHeight,
        behavior: smoothScroll ? "smooth" : "auto",
      });
    };

    return (
      <div className="relative flex-1 overflow-hidden flex flex-col">
        <div
          ref={scrollContainerRef}
          onScroll={handleScroll}
          className={`flex-1 p-5 overflow-y-auto space-y-4 bg-[#191a1e] ${className || ""}`}
          {...props}
        >
          {children}
        </div>

        {showScrollBottom && (
          <button
            onClick={scrollToBottom}
            type="button"
            title="Cuộn xuống tin nhắn mới nhất"
            className="absolute bottom-3 right-5 p-2 rounded-full bg-[#282a32] border border-[#3e414c] text-zinc-300 hover:text-white shadow-lg hover:bg-[#32343c] transition-all animate-bounce cursor-pointer z-10"
          >
            <ArrowDown className="w-4 h-4 text-amber-300" />
          </button>
        )}
      </div>
    );
  }
);

ChatMessageList.displayName = "ChatMessageList";
