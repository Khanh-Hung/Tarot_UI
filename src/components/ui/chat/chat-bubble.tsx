"use client";

import React, { useState } from "react";
import { Check, Copy } from "lucide-react";
import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: (string | undefined | null | false)[]) {
  return twMerge(clsx(inputs));
}

interface ChatBubbleProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: "sent" | "received";
  children: React.ReactNode;
}

export const ChatBubble: React.FC<ChatBubbleProps> = ({
  variant = "received",
  className,
  children,
  ...props
}) => {
  return (
    <div
      className={cn(
        "w-full flex gap-2.5 items-end group",
        variant === "sent" ? "justify-end" : "justify-start",
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
};

interface ChatBubbleMessageProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: "sent" | "received";
  isLoading?: boolean;
}

export const ChatBubbleMessage: React.FC<ChatBubbleMessageProps> = ({
  variant = "received",
  isLoading = false,
  className,
  children,
  ...props
}) => {
  return (
    <div
      className={cn(
        "relative max-w-[85%] sm:max-w-[78%] px-4 py-2.5 sm:px-5 sm:py-3 rounded-2xl text-sm leading-relaxed transition-all",
        variant === "sent"
          ? "bg-[#2b2d35] border border-[#3b3d48] text-white font-medium rounded-br-xs shadow-sm"
          : "bg-[#202228] border border-[#31333a] text-zinc-200 rounded-bl-xs shadow-sm",
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
};

interface ChatBubbleCopyButtonProps {
  content: string;
  className?: string;
}

export const ChatBubbleCopyButton: React.FC<ChatBubbleCopyButtonProps> = ({
  content,
  className,
}) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(content);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // ignore
    }
  };

  return (
    <button
      onClick={handleCopy}
      type="button"
      title={copied ? "Đã sao chép" : "Sao chép tin nhắn"}
      className={cn(
        "opacity-0 group-hover:opacity-100 focus:opacity-100 transition-opacity p-1.5 rounded-lg text-zinc-400 hover:text-zinc-200 hover:bg-white/[0.08] cursor-pointer",
        className
      )}
    >
      {copied ? (
        <Check className="w-3.5 h-3.5 text-emerald-400" />
      ) : (
        <Copy className="w-3.5 h-3.5" />
      )}
    </button>
  );
};
