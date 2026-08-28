"use client";

import React, { useState, useRef, useEffect } from "react";
import { Send, Sparkles, User, Bot, Loader2, Moon } from "lucide-react";
import { ChatMessageDto } from "@/features/tarot/types/tarot.types";
import { tarotService } from "@/features/tarot/services/tarotService";
import { MarkdownRenderer } from "./MarkdownRenderer";

interface ChatBoxProps {
  readingId: string | number;
  initialMessages?: ChatMessageDto[];
}

export const ChatBox: React.FC<ChatBoxProps> = ({ readingId, initialMessages = [] }) => {
  const [messages, setMessages] = useState<ChatMessageDto[]>(initialMessages);
  const [inputMessage, setInputMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading]);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputMessage.trim() || isLoading) return;

    const userText = inputMessage.trim();
    setInputMessage("");

    const tempUserMsg: ChatMessageDto = {
      id: Date.now(),
      sender: "USER",
      message: userText,
      createdAt: new Date().toISOString(),
    };
    setMessages((prev) => [...prev, tempUserMsg]);
    setIsLoading(true);

    try {
      const aiReplyText = await tarotService.sendChatMessage(readingId, userText);
      const aiMsg: ChatMessageDto = {
        id: Date.now() + 1,
        sender: "AI",
        message: aiReplyText,
        createdAt: new Date().toISOString(),
      };
      setMessages((prev) => [...prev, aiMsg]);
    } catch (error) {
      console.error("Failed to send chat message:", error);
      const errorMsg: ChatMessageDto = {
        id: Date.now() + 1,
        sender: "AI",
        message: "Xin lỗi bạn, kết nối vũ trụ tạm thời bị gián đoạn. Vui lòng thử gửi lại câu hỏi nhé!",
        createdAt: new Date().toISOString(),
      };
      setMessages((prev) => [...prev, errorMsg]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full silver-card rounded-3xl overflow-hidden flex flex-col h-[520px]">
      {/* Header Chat */}
      <div className="px-6 py-4 bg-[#090D18] border-b border-white/[0.08] flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-white to-slate-400 flex items-center justify-center text-slate-950 shadow-md">
            <Moon className="w-4 h-4 text-slate-950 fill-slate-950" />
          </div>
          <div>
            <h3 className="text-sm font-semibold text-white">Oracle AI Reader</h3>
            <p className="text-[11px] text-slate-400">Tham vấn & Trò chuyện sâu bám sát 3 lá bài</p>
          </div>
        </div>
        <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-medium bg-white/[0.06] border border-white/15 text-slate-200">
          <span className="w-1.5 h-1.5 rounded-full bg-slate-300 animate-pulse"></span>
          Trực tuyến
        </span>
      </div>

      {/* Danh sách tin nhắn */}
      <div className="flex-1 p-5 overflow-y-auto space-y-4">
        {messages.length === 0 && (
          <div className="text-center py-12 px-4">
            <div className="w-12 h-12 mx-auto rounded-2xl bg-white/[0.04] border border-white/10 flex items-center justify-center text-slate-300 mb-3">
              <Bot className="w-6 h-6" />
            </div>
            <p className="text-sm text-slate-200 font-medium">Bạn có thắc mắc gì về 3 lá bài trên bàn không?</p>
            <p className="text-xs text-slate-400 mt-1">
              Hãy tâm sự hoặc hỏi sâu hơn về công việc, tình cảm, hướng đi tiếp theo nhé!
            </p>
          </div>
        )}

        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex gap-3 ${msg.sender === "USER" ? "justify-end" : "justify-start"}`}
          >
            {msg.sender === "AI" && (
              <div className="w-8 h-8 rounded-full bg-[#121829] border border-white/20 flex items-center justify-center flex-shrink-0 text-slate-200 mt-1">
                <Bot className="w-4 h-4" />
              </div>
            )}

            <div
              className={`max-w-[82%] sm:max-w-[75%] p-4 rounded-2xl text-sm leading-relaxed ${
                msg.sender === "USER"
                  ? "bg-slate-200 text-slate-950 font-medium rounded-br-none shadow-md"
                  : "bg-[#101524] border border-white/[0.08] text-slate-100 rounded-bl-none shadow-md"
              }`}
            >
              {msg.sender === "AI" ? (
                <MarkdownRenderer content={msg.message} />
              ) : (
                <p className="whitespace-pre-wrap">{msg.message}</p>
              )}
            </div>

            {msg.sender === "USER" && (
              <div className="w-8 h-8 rounded-full bg-slate-700 border border-slate-500 flex items-center justify-center flex-shrink-0 text-white mt-1">
                <User className="w-4 h-4" />
              </div>
            )}
          </div>
        ))}

        {isLoading && (
          <div className="flex gap-3 justify-start items-center">
            <div className="w-8 h-8 rounded-full bg-[#121829] border border-white/20 flex items-center justify-center flex-shrink-0 text-slate-200">
              <Bot className="w-4 h-4" />
            </div>
            <div className="bg-[#101524] border border-white/[0.08] rounded-2xl rounded-bl-none p-3.5 flex items-center gap-2 text-xs text-slate-300">
              <Loader2 className="w-4 h-4 animate-spin text-slate-200" />
              <span>AI Reader đang kết nối năng lượng lá bài để hồi đáp...</span>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Ô nhập tin nhắn */}
      <form
        onSubmit={handleSendMessage}
        className="p-3.5 bg-[#090D18] border-t border-white/[0.08] flex items-center gap-2.5"
      >
        <input
          type="text"
          value={inputMessage}
          onChange={(e) => setInputMessage(e.target.value)}
          placeholder="Nhắn tin tâm sự hoặc hỏi sâu về 3 lá bài..."
          disabled={isLoading}
          className="flex-1 bg-black/40 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-white/30 transition"
        />
        <button
          type="submit"
          disabled={isLoading || !inputMessage.trim()}
          className="px-5 py-2.5 rounded-xl silver-gradient-btn font-semibold text-sm flex items-center gap-1.5 disabled:opacity-50 disabled:cursor-not-allowed transition"
        >
          <Send className="w-4 h-4 text-slate-950" />
          <span className="hidden sm:inline">Gửi</span>
        </button>
      </form>
    </div>
  );
};