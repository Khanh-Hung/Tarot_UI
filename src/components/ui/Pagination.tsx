"use client";

import React from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

export interface PaginationProps {
  currentPage: number; // 0-indexed
  totalPages: number;
  onPageChange: (page: number) => void;
  totalItems?: number;
  currentCount?: number;
  itemLabel?: string;
  className?: string;
}

export const Pagination: React.FC<PaginationProps> = ({
  currentPage,
  totalPages,
  onPageChange,
  totalItems,
  currentCount,
  itemLabel = "mục",
  className = "",
}) => {
  if (totalPages <= 1) return null;

  // Tính toán dải trang cần hiển thị
  const getPageNumbers = () => {
    const pages: (number | "...")[] = [];
    if (totalPages <= 7) {
      for (let i = 0; i < totalPages; i++) pages.push(i);
    } else {
      pages.push(0);
      if (currentPage > 2) pages.push("...");

      const start = Math.max(1, currentPage - 1);
      const end = Math.min(totalPages - 2, currentPage + 1);

      for (let i = start; i <= end; i++) {
        pages.push(i);
      }

      if (currentPage < totalPages - 3) pages.push("...");
      pages.push(totalPages - 1);
    }
    return pages;
  };

  return (
    <div
      className={`flex flex-col sm:flex-row items-center justify-between gap-4 pt-6 border-t border-white/[0.06] ${className}`}
    >
      {/* Thông tin số lượng */}
      {totalItems !== undefined && (
        <span className="text-xs text-zinc-400 font-medium">
          Hiển thị{" "}
          <span className="text-zinc-200 font-bold">
            {currentCount ?? totalItems}
          </span>{" "}
          / <span className="text-white font-bold">{totalItems}</span> {itemLabel}
        </span>
      )}

      {/* Cụm nút chuyển trang */}
      <div className="flex items-center gap-1.5 ml-auto">
        {/* Nút Trước */}
        <button
          type="button"
          disabled={currentPage === 0}
          onClick={() => onPageChange(Math.max(0, currentPage - 1))}
          className="w-9 h-9 rounded-xl bg-white/[0.04] hover:bg-white/[0.08] hover:text-white disabled:opacity-20 disabled:cursor-not-allowed text-zinc-400 flex items-center justify-center transition active:scale-95 cursor-pointer"
          title="Trang trước"
        >
          <ChevronLeft className="w-4 h-4" />
        </button>

        {/* Các nút số trang */}
        {getPageNumbers().map((pageItem, idx) => {
          if (pageItem === "...") {
            return (
              <span
                key={`ellipsis-${idx}`}
                className="w-8 text-center text-xs text-zinc-500 select-none"
              >
                ...
              </span>
            );
          }

          const isCurrent = pageItem === currentPage;
          return (
            <button
              key={pageItem}
              type="button"
              onClick={() => onPageChange(pageItem)}
              className={`w-9 h-9 rounded-xl text-xs font-bold transition active:scale-95 cursor-pointer ${
                isCurrent
                  ? "bg-white text-zinc-950 shadow-md font-extrabold"
                  : "bg-white/[0.04] hover:bg-white/[0.08] text-zinc-400 hover:text-white"
              }`}
            >
              {pageItem + 1}
            </button>
          );
        })}

        {/* Nút Sau */}
        <button
          type="button"
          disabled={currentPage >= totalPages - 1}
          onClick={() => onPageChange(currentPage + 1)}
          className="w-9 h-9 rounded-xl bg-white/[0.04] hover:bg-white/[0.08] hover:text-white disabled:opacity-20 disabled:cursor-not-allowed text-zinc-400 flex items-center justify-center transition active:scale-95 cursor-pointer"
          title="Trang sau"
        >
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
