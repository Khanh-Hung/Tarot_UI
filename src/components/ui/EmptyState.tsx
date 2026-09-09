"use client";

import React from "react";
import Link from "next/link";
import { Sparkles } from "lucide-react";

export interface EmptyStateAction {
  label: string;
  onClick?: () => void;
  href?: string;
  icon?: React.ReactNode;
  variant?: "primary" | "secondary";
}

export interface EmptyStateProps {
  icon?: React.ReactNode;
  title: string;
  description?: string;
  action?: EmptyStateAction;
  className?: string;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  icon = <Sparkles className="h-9 w-9 text-zinc-500 mb-3" />,
  title,
  description,
  action,
  className = "",
}) => {
  const renderActionButton = () => {
    if (!action) return null;

    const btnClass =
      action.variant === "primary"
        ? "mt-4 px-5 py-2.5 rounded-full silver-gradient-btn text-zinc-950 font-bold text-xs sm:text-sm flex items-center gap-2 shadow-lg transition hover:scale-105 active:scale-95 cursor-pointer"
        : "mt-4 px-4 py-2 rounded-xl bg-[#2b2c34] hover:bg-[#353740] text-xs font-semibold text-zinc-200 border border-[#3b3d46] transition-colors cursor-pointer flex items-center gap-1.5";

    if (action.href) {
      return (
        <Link href={action.href} className={btnClass}>
          {action.icon}
          <span>{action.label}</span>
        </Link>
      );
    }

    return (
      <button type="button" onClick={action.onClick} className={btnClass}>
        {action.icon}
        <span>{action.label}</span>
      </button>
    );
  };

  return (
    <div
      className={`flex min-h-[300px] flex-col items-center justify-center rounded-3xl border border-dashed border-[#31333a] bg-[#212227]/40 p-8 sm:p-10 text-center ${className}`}
    >
      <div className="shrink-0">{icon}</div>
      <h3 className="text-sm sm:text-base font-bold text-zinc-200">{title}</h3>
      {description && (
        <p className="mt-1.5 text-xs sm:text-sm text-zinc-400 max-w-md leading-relaxed">
          {description}
        </p>
      )}
      {renderActionButton()}
    </div>
  );
};
