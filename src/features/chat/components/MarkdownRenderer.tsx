"use client";

import React from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

interface MarkdownRendererProps {
  content: string;
}

export const MarkdownRenderer: React.FC<MarkdownRendererProps> = ({ content }) => {
  if (!content) return null;

  // Chuẩn hóa icon Mục 2 thành cuộn thư 📜 để không bị trùng lặp với icon thẻ bài 🎴 ở mục con
  const sanitizedContent = content.replace(/(^|\n)##\s*🎴\s*(2\.)/g, "$1## 📜 $2");

  return (
    <div className="prose prose-invert max-w-none space-y-5 text-zinc-200">
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        components={{
          h1: ({ children }) => (
            <h1 className="text-xl sm:text-2xl font-bold text-white pb-3 border-b border-white/10 flex items-center gap-2 tracking-tight">
              {children}
            </h1>
          ),
          h2: ({ children }) => (
            <div className="pt-6 pb-2 mb-3 border-b border-white/10 flex items-center gap-2">
              <h2 className="text-base sm:text-lg font-bold text-amber-300 tracking-wide m-0">
                {children}
              </h2>
            </div>
          ),
          h3: ({ children }) => (
            <h3 className="text-sm sm:text-base font-semibold text-zinc-200 mt-4 mb-2">
              {children}
            </h3>
          ),
          p: ({ children }) => (
            <p className="text-sm sm:text-base text-zinc-300 leading-relaxed sm:leading-loose mb-3.5">
              {children}
            </p>
          ),
          blockquote: ({ children }) => (
            <div className="my-2 text-sm sm:text-base text-zinc-300 leading-relaxed sm:leading-loose [&>p]:m-0">
              {children}
            </div>
          ),
          ul: ({ children }) => (
            <ul className="list-disc pl-5 space-y-3.5 my-3 text-sm sm:text-base text-zinc-300 marker:text-zinc-500">
              {children}
            </ul>
          ),
          ol: ({ children }) => (
            <ol className="list-decimal pl-5 space-y-3.5 my-3 text-sm sm:text-base text-zinc-300 marker:text-zinc-500 marker:font-medium">
              {children}
            </ol>
          ),
          li: ({ children }) => (
            <li className="text-zinc-300 leading-relaxed pl-1">{children}</li>
          ),
          strong: ({ children }) => (
            <strong className="text-white font-bold tracking-wide">{children}</strong>
          ),
          code: ({ children }) => (
            <code className="px-1.5 py-0.5 rounded bg-black/50 text-zinc-200 text-xs border border-white/10">
              {children}
            </code>
          ),
          hr: () => <hr className="my-6 border-white/10" />,
        }}
      >
        {sanitizedContent}
      </ReactMarkdown>
    </div>
  );
};