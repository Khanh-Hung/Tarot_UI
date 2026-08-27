"use client";

import React from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

interface MarkdownRendererProps {
  content: string;
}

export const MarkdownRenderer: React.FC<MarkdownRendererProps> = ({ content }) => {
  return (
    <div className="prose prose-invert max-w-none space-y-4 text-slate-200 leading-relaxed ">
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        components={{
          h1: ({ children }) => (
            <h1 className="text-xl sm:text-2xl  font-bold silver-gradient-text pb-2.5 border-b border-white/10 flex items-center gap-2">
              {children}
            </h1>
          ),
          h2: ({ children }) => (
            <h2 className="text-lg sm:text-xl  font-semibold text-slate-100 mt-6 mb-3 flex items-center gap-2">
              {children}
            </h2>
          ),
          h3: ({ children }) => (
            <h3 className="text-base sm:text-lg  font-medium text-slate-200 mt-4 mb-2">
              {children}
            </h3>
          ),
          p: ({ children }) => (
            <p className="text-sm sm:text-base text-slate-300 leading-relaxed mb-3">
              {children}
            </p>
          ),
          blockquote: ({ children }) => (
            <blockquote className="my-4 p-4.5 rounded-2xl bg-white/[0.03] border-l-4 border-slate-300 text-slate-200 italic shadow-inner">
              {children}
            </blockquote>
          ),
          ul: ({ children }) => (
            <ul className="list-disc list-inside space-y-1.5 text-sm sm:text-base text-slate-300 my-2">
              {children}
            </ul>
          ),
          ol: ({ children }) => (
            <ol className="list-decimal list-inside space-y-1.5 text-sm sm:text-base text-slate-300 my-2">
              {children}
            </ol>
          ),
          li: ({ children }) => (
            <li className="text-slate-300 leading-normal">{children}</li>
          ),
          strong: ({ children }) => (
            <strong className="text-white font-semibold">{children}</strong>
          ),
          code: ({ children }) => (
            <code className="px-1.5 py-0.5 rounded bg-black/40 text-slate-200 text-xs  border border-white/15">
              {children}
            </code>
          ),
          hr: () => <hr className="my-6 border-white/[0.08]" />,
        }}
      >
        {content}
      </ReactMarkdown>
    </div>
  );
};