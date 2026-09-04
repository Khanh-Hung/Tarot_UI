"use client";

import React, { useState, useRef, useEffect } from "react";
import { Bot, Sparkles, Lock, ShieldCheck, Mail, Loader2 } from "lucide-react";
import { ChatMessageDto } from "@/features/tarot/types/tarot.types";
import { tarotService } from "@/features/tarot/services/tarotService";
import { MarkdownRenderer } from "./MarkdownRenderer";
import { useAuth } from "@/features/auth/hooks/useAuth";
import { authService } from "@/features/auth/services/authService";
import { Avatar } from "@/components/ui/Avatar";
import {
  ChatBubble,
  ChatBubbleMessage,
  ChatBubbleCopyButton,
  ChatInput,
  ChatMessageList,
  ChatTypingIndicator,
} from "@/components/ui/chat";

interface ChatBoxProps {
  readingId: string | number;
  initialMessages?: ChatMessageDto[];
}

const getMessageText = (msg: ChatMessageDto) => msg.content || msg.message || "";
const isAi = (sender?: string) => sender === "AI" || sender === "AI_READER";

export const ChatBox: React.FC<ChatBoxProps> = ({ readingId, initialMessages = [] }) => {
  const { user } = useAuth();
  const [messages, setMessages] = useState<ChatMessageDto[]>(initialMessages);
  const [inputMessage, setInputMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isSendingLink, setIsSendingLink] = useState(false);
  const [isLinkSent, setIsLinkSent] = useState(false);
  const [resendCountdown, setResendCountdown] = useState(0);
  const chatContainerRef = useRef<HTMLDivElement>(null);
  const isInitialMount = useRef(true);

  useEffect(() => {
    if (resendCountdown <= 0) return;
    const timer = setInterval(() => setResendCountdown((c) => c - 1), 1000);
    return () => clearInterval(timer);
  }, [resendCountdown]);

  const handleSendVerificationLink = async () => {
    if (!user?.email || isSendingLink || resendCountdown > 0) return;
    setIsSendingLink(true);
    try {
      await authService.sendVerificationEmail(user.email);
      setIsLinkSent(true);
      setResendCountdown(60);
    } catch (e) {
      console.error("Failed to send verification link:", e);
    } finally {
      setIsSendingLink(false);
    }
  };

  // Đồng bộ lại danh sách tin nhắn khi initialMessages được nạp từ server
  useEffect(() => {
    if (initialMessages && initialMessages.length > 0) {
      setMessages(initialMessages);
    }
  }, [initialMessages]);

  const scrollToBottom = () => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTo({
        top: chatContainerRef.current.scrollHeight,
        behavior: "smooth",
      });
    }
  };

  useEffect(() => {
    if (isInitialMount.current) {
      isInitialMount.current = false;
      return;
    }
    if (messages.length > 0 || isLoading) {
      scrollToBottom();
    }
  }, [messages, isLoading]);

  const handleSendMessage = async () => {
    if (!inputMessage.trim() || isLoading) return;

    const userText = inputMessage.trim();
    setInputMessage("");

    const tempUserMsg: ChatMessageDto = {
      id: Date.now(),
      sender: "USER",
      message: userText,
      content: userText,
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
        content: aiReplyText,
        createdAt: new Date().toISOString(),
      };
      setMessages((prev) => [...prev, aiMsg]);
    } catch (err: any) {
      console.error("Failed to send message:", err);
      const isEmailErr =
        err?.response?.data?.code === "EMAIL_NOT_VERIFIED" ||
        err?.response?.data?.message?.includes("verify your email");
      if (isEmailErr) {
        handleSendVerificationLink();
      }
      const errorMsg: ChatMessageDto = {
        id: Date.now() + 1,
        sender: "AI",
        message: isEmailErr
          ? "✦ Đã gửi liên kết kích hoạt đến email của bạn! Vui lòng mở hòm thư và nhấn vào link để mở khóa trò chuyện nhé."
          : "Xin lỗi bạn, kết nối vũ trụ tạm thời bị gián đoạn. Vui lòng thử gửi lại câu hỏi nhé!",
        content: isEmailErr
          ? "✦ Đã gửi liên kết kích hoạt đến email của bạn! Vui lòng mở hòm thư và nhấn vào link để mở khóa trò chuyện nhé."
          : "Xin lỗi bạn, kết nối vũ trụ tạm thời bị gián đoạn. Vui lòng thử gửi lại câu hỏi nhé!",
        createdAt: new Date().toISOString(),
      };
      setMessages((prev) => [...prev, errorMsg]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full rounded-2xl border border-[#31333a] bg-[#191a1e] shadow-xl overflow-hidden flex flex-col h-[520px]">
      {/* Header Chat */}
      <div className="px-6 py-4 bg-[#202228] border-b border-[#31333a] flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-amber-400/10 border border-amber-400/30 flex items-center justify-center text-amber-300 shadow-sm shrink-0">
            <Bot className="w-4 h-4 text-amber-300" />
          </div>
          <div>
            <h3 className="text-sm font-semibold text-zinc-100">Hỏi đáp về quẻ bài</h3>
            <p className="text-[11px] text-zinc-400">Giải đáp mọi thắc mắc của bạn</p>
          </div>
        </div>
        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-medium bg-[#16171b] border border-[#31333a] text-zinc-300">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
          Sẵn sàng
        </span>
      </div>

      {/* Danh sách tin nhắn qua ChatMessageList component */}
      <ChatMessageList ref={chatContainerRef}>
        {messages.length === 0 && (
          <div className="text-center py-14 px-4">
            <div className="w-12 h-12 mx-auto rounded-2xl bg-[#22242a] border border-[#353740] flex items-center justify-center text-amber-300 mb-3.5 shadow-sm">
              <Bot className="w-6 h-6 text-amber-300" />
            </div>
            <p className="text-sm text-zinc-200 font-semibold">Bạn có câu hỏi nào khác không?</p>
            <p className="text-xs text-zinc-400 mt-1.5 max-w-sm mx-auto leading-relaxed">
              Nhắn tin vào đây nếu bạn muốn hiểu rõ hơn về quẻ bài này nhé.
            </p>
          </div>
        )}

        {messages.map((msg) => (
          <ChatBubble
            key={msg.id}
            variant={msg.sender === "USER" ? "sent" : "received"}
          >
            {isAi(msg.sender) && (
              <div className="w-8 h-8 rounded-full bg-amber-400/10 border border-amber-400/30 flex items-center justify-center flex-shrink-0 text-amber-300 mb-0.5 shadow-sm">
                <Bot className="w-4 h-4 text-amber-300" />
              </div>
            )}

            <ChatBubbleMessage variant={msg.sender === "USER" ? "sent" : "received"}>
              {isAi(msg.sender) ? (
                <div>
                  <MarkdownRenderer content={getMessageText(msg)} />
                  <div className="flex justify-end mt-1 pt-1 border-t border-white/[0.04]">
                    <ChatBubbleCopyButton content={getMessageText(msg)} />
                  </div>
                </div>
              ) : (
                <p className="whitespace-pre-wrap">{getMessageText(msg)}</p>
              )}
            </ChatBubbleMessage>

            {msg.sender === "USER" && (
              <Avatar
                src={(user as { avatarUrl?: string })?.avatarUrl}
                alt={user?.username || "Bạn"}
                size="sm"
                className="!rounded-full !size-8 !h-8 !w-8 border border-[#3b3d46] shrink-0 mb-0.5"
              />
            )}
          </ChatBubble>
        ))}

        {isLoading && (
          <ChatBubble variant="received">
            <div className="w-8 h-8 rounded-full bg-amber-400/10 border border-amber-400/30 flex items-center justify-center flex-shrink-0 text-amber-300 mb-0.5 shadow-sm">
              <Bot className="w-4 h-4 text-amber-300" />
            </div>
            <ChatTypingIndicator message="Đang giải đáp câu hỏi của bạn..." />
          </ChatBubble>
        )}
      </ChatMessageList>

      {/* Ô nhập tin nhắn hoặc Khóa Email Verification */}
      {user && !user.isEmailVerified ? (
        <div className="p-4 bg-gradient-to-r from-[#17181c] via-[#1c1d24] to-[#17181c] border-t border-[#31333a] flex flex-col sm:flex-row items-center justify-between gap-3 text-center sm:text-left">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-400/10 border border-amber-400/30 flex items-center justify-center text-amber-400 shrink-0 shadow-[0_0_12px_rgba(251,191,36,0.15)]">
              <Lock className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-xs font-semibold text-zinc-100 flex items-center gap-1.5 justify-center sm:justify-start">
                <span>Trò chuyện trực tiếp cùng AI Reader</span>
                <Sparkles className="w-3.5 h-3.5 text-amber-400" />
              </h4>
              <p className="text-[11px] text-zinc-400 mt-0.5">
                {isLinkSent
                  ? "✦ Đã gửi liên kết kích hoạt đến email của bạn! Mở hòm thư và bấm link để kích hoạt."
                  : "Xác thực email tài khoản để mở khóa đối thoại chuyên sâu về quẻ bài của bạn."}
              </p>
            </div>
          </div>
          <button
            onClick={handleSendVerificationLink}
            disabled={isSendingLink || resendCountdown > 0}
            className="px-4 py-2 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-black font-bold text-xs rounded-xl shadow-lg transition-all shrink-0 flex items-center gap-1.5 hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSendingLink ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Đang gửi link...</span>
              </>
            ) : resendCountdown > 0 ? (
              <>
                <Mail className="w-4 h-4" />
                <span>Gửi lại sau ({resendCountdown}s)</span>
              </>
            ) : (
              <>
                <ShieldCheck className="w-4 h-4" />
                <span>{isLinkSent ? "Gửi lại link kích hoạt" : "Gửi link kích hoạt Email"}</span>
              </>
            )}
          </button>
        </div>
      ) : (
        <ChatInput
          value={inputMessage}
          onChange={setInputMessage}
          onSubmit={handleSendMessage}
          disabled={isLoading}
          placeholder="Nhập câu hỏi của bạn tại đây... (Enter để gửi, Shift+Enter xuống dòng)"
        />
      )}
    </div>
  );
};