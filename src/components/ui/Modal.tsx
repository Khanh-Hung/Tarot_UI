"use client";

import React, { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { X } from "lucide-react";

export interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: React.ReactNode;
  icon?: React.ReactNode;
  children: React.ReactNode;
  footer?: React.ReactNode;
  maxWidth?: string;
  maxHeight?: string;
  showCloseButton?: boolean;
  className?: string;
  bodyClassName?: string;
  headerExtra?: React.ReactNode;
}

export const Modal: React.FC<ModalProps> = ({
  isOpen,
  onClose,
  title,
  icon,
  children,
  footer,
  maxWidth = "max-w-xl",
  maxHeight = "max-h-[78vh]",
  showCloseButton = true,
  className = "",
  bodyClassName = "",
  headerExtra,
}) => {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Đóng bằng phím Escape & Khóa cuộn trang khi mở modal
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose();
      }
    };

    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.body.style.overflow = originalOverflow;
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen, onClose]);

  if (!isOpen || !mounted) return null;

  const modalContent = (
    <div
      onClick={onClose}
      className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6 pt-16 pb-6 sm:pt-20 sm:pb-8 bg-black/85 backdrop-blur-md animate-in fade-in duration-200"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className={`relative w-full ${maxWidth} ${maxHeight} flex flex-col rounded-2xl border border-white/10 bg-[#16171a] shadow-2xl overflow-hidden my-auto animate-in zoom-in-95 duration-200 ${className}`}
      >
        {/* Header Cố Định */}
        {(title || showCloseButton) && (
          <div className="shrink-0 flex items-center justify-between px-5 pt-4 pb-3 border-b border-white/[0.08] bg-[#16171a]">
            <div className="flex items-center gap-2 text-xs sm:text-sm font-bold text-zinc-200 min-w-0 flex-1">
              {icon && <span className="shrink-0 text-zinc-400">{icon}</span>}
              {title && <span className="truncate">{title}</span>}
            </div>

            <div className="flex items-center gap-2 shrink-0 ml-3">
              {headerExtra}
              {showCloseButton && (
                <button
                  type="button"
                  onClick={onClose}
                  className="w-6 h-6 rounded-full bg-white/[0.04] hover:bg-white/[0.08] flex items-center justify-center text-zinc-400 hover:text-white transition cursor-pointer"
                  title="Đóng cửa sổ"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
          </div>
        )}

        {/* Vùng nội dung cuộn mượt */}
        <div
          className={`flex-1 min-h-0 overflow-y-auto px-5 py-4 [scrollbar-gutter:stable] [scrollbar-width:thin] [&::-webkit-scrollbar]:w-1.5 [&::-webkit-scrollbar-thumb]:bg-zinc-700 [&::-webkit-scrollbar-thumb]:rounded-full ${bodyClassName}`}
        >
          {children}
        </div>

        {/* Footer cố định nếu có */}
        {footer && (
          <div className="shrink-0 px-5 py-3 border-t border-white/[0.08] flex items-center justify-between gap-3 bg-[#16171a]">
            {footer}
          </div>
        )}
      </div>
    </div>
  );

  return createPortal(modalContent, document.body);
};
