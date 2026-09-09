"use client";

import React from "react";
import { AlertCircle, CheckCircle2, AlertTriangle, Info, X } from "lucide-react";

export type AlertVariant = "error" | "success" | "warning" | "info";

export interface AlertBannerProps {
  variant?: AlertVariant;
  message?: string;
  children?: React.ReactNode;
  onClose?: () => void;
  className?: string;
}

export const AlertBanner: React.FC<AlertBannerProps> = ({
  variant = "error",
  message,
  children,
  onClose,
  className = "",
}) => {
  if (!message && !children) return null;

  const variantStyles: Record<AlertVariant, { container: string; icon: React.ReactNode }> = {
    error: {
      container: "border-rose-500/30 bg-rose-500/10 text-rose-300",
      icon: <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />,
    },
    success: {
      container: "border-emerald-500/30 bg-emerald-500/10 text-emerald-300",
      icon: <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />,
    },
    warning: {
      container: "border-amber-500/30 bg-amber-500/10 text-amber-300",
      icon: <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0" />,
    },
    info: {
      container: "border-sky-500/30 bg-sky-500/10 text-sky-300",
      icon: <Info className="w-4 h-4 text-sky-400 shrink-0" />,
    },
  };

  const current = variantStyles[variant];

  return (
    <div
      role="alert"
      className={`p-3 sm:p-3.5 rounded-xl border text-xs flex items-center justify-between gap-3 animate-in fade-in duration-200 ${current.container} ${className}`}
    >
      <div className="flex items-center gap-2.5 min-w-0 flex-1">
        {current.icon}
        <div className="leading-relaxed break-words">{children || message}</div>
      </div>

      {onClose && (
        <button
          type="button"
          onClick={onClose}
          className="shrink-0 p-0.5 rounded text-current opacity-70 hover:opacity-100 transition cursor-pointer"
          title="Đóng thông báo"
        >
          <X className="w-3.5 h-3.5" />
        </button>
      )}
    </div>
  );
};
