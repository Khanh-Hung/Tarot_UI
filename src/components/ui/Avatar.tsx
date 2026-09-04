"use client";

import React, { useState } from "react";

interface AvatarProps {
  src?: string | null;
  alt?: string;
  size?: "xs" | "sm" | "md" | "lg" | "xl";
  className?: string;
}

export function FacebookUserSilhouette({ className = "" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 100 100"
      className={`h-full w-full select-none ${className}`}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* Nền tròn xám sáng chuẩn Facebook */}
      <circle cx="50" cy="50" r="50" fill="#e4e6eb" />
      {/* Đầu người */}
      <circle cx="50" cy="38" r="16" fill="#65676b" />
      {/* Vai và thân người */}
      <path
        d="M50 58c-18.8 0-34 11.2-35.8 25.5A49.7 49.7 0 0 0 50 100a49.7 49.7 0 0 0 35.8-16.5C84 69.2 68.8 58 50 58z"
        fill="#65676b"
      />
    </svg>
  );
}

export function Avatar({
  src,
  alt = "Avatar",
  size = "md",
  className = "",
}: AvatarProps) {
  const [imgError, setImgError] = useState(false);

  const sizeClasses = {
    xs: "h-7 w-7",
    sm: "h-8 w-8",
    md: "h-10 w-10",
    lg: "h-14 w-14",
    xl: "h-20 w-20 sm:h-24 sm:w-24",
  };

  const showImage = Boolean(src && src.trim().length > 0 && !imgError);

  return (
    <div
      className={`relative shrink-0 overflow-hidden rounded-full flex items-center justify-center select-none ${sizeClasses[size]} ${className}`}
    >
      {showImage ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={src!}
          alt={alt}
          onError={() => setImgError(true)}
          className="h-full w-full object-cover rounded-full"
        />
      ) : (
        <FacebookUserSilhouette />
      )}
    </div>
  );
}
