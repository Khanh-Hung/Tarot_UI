"use client";

import React, { useState, useRef, useEffect } from "react";
import { Bot, Sparkles } from "lucide-react";
import { ChatMessageDto } from "@/features/tarot/types/tarot.types";
import { tarotService } from "@/features/tarot/services/tarotService";
import { MarkdownRenderer } from "./MarkdownRenderer";
import { useAuth } from "@/features/auth/hooks/useAuth";
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
  const chatContainerRef = useRef<HTMLDivElement>(null);
  const isInitialMount = useRef(true);

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
    } catch (err: unknown) {
      console.error("Failed to send message:", err);
      const errorMsg: ChatMessageDto = {
        id: Date.now() + 1,
        sender: "AI",
        message: "Xin lỗi bạn, kết nối vũ trụ tạm thời bị gián đoạn. Vui lòng thử gửi lại câu hỏi nhé!",
        content: "Xin lỗi bạn, kết nối vũ trụ tạm thời bị gián đoạn. Vui lòng thử gửi lại câu hỏi nhé!",
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

      {/* Ô nhập tin nhắn tự co giãn ChatInput */}
      <ChatInput
        value={inputMessage}
        onChange={setInputMessage}
        onSubmit={handleSendMessage}
        disabled={isLoading}
        placeholder="Nhập câu hỏi của bạn tại đây... (Enter để gửi, Shift+Enter xuống dòng)"
      />
    </div>
  );
};