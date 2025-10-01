"use client";

import { createContext, useContext, useEffect, useState } from "react";
import type { Attachment, Message } from "@/types/message";
import type { EmojiKind } from "@/types/reaction";
import { uid } from "@/utils/utils";

type ChatContextValue = {
  isLoading: boolean;
  messages: Message[];
  sendMessage: (msg: Omit<Message, "id" | "createdAt">) => Promise<Message>;
  addReaction: (messageId: string, emoji: EmojiKind) => Promise<void>;
  removeAttachmentObjectURLs: (attachments: Attachment[]) => void;
};

const ChatContext = createContext<ChatContextValue | null>(null);

export const useChat = () => {
  const ctx = useContext(ChatContext);
  if (!ctx) throw new Error("useChat must be used inside ChatProvider");
  return ctx;
};

export const ChatProvider: React.FC<{
  children: React.ReactNode;
  channel?: string;
}> = ({ children, channel = "general" }) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  // load messages từ server
  useEffect(() => {
    setIsLoading(true);
    fetch(`/api/messages/${channel}`)
      .then((res) => res.json())
      .then((data) => {
        setIsLoading(false);
        setMessages(data);
      })
      .catch(() => {
        setMessages([]);
        setIsLoading(false);
      });
  }, [channel]);

  const removeAttachmentObjectURLs = (attachments: Attachment[]) => {
    attachments.map((a) => URL.revokeObjectURL(a.url));
  };

  const sendMessage = async (msg: Omit<Message, "id" | "createdAt">) => {
    const m: Message = {
      id: uid("msg"),
      text: msg.text,
      attachments: msg.attachments,
      createdAt: Date.now(),
      scheduledAt: msg.scheduledAt || null,
      reactions: undefined,
      fromMe: true,
    };

    // optimistic update
    setMessages((prev) => [...prev, m]);

    // gửi lên server
    try {
      await fetch(`/api/messages/${channel}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(m),
      });
    } catch (e) {
      console.error("Failed to save message", e);
    }

    return m;
  };

  const addReaction = async (messageId: string, emoji: EmojiKind) => {
    // update local ngay lập tức
    // setMessages((prev) =>
    //   prev.map((m) => {
    //     if (m.id !== messageId) return m;
    //     const reactions = { ...(m.reactions || {}) };
    //     if (!reactions[emoji])
    //       reactions[emoji] = { kind: emoji, count: 0, byMe: false };
    //     const r = reactions[emoji];
    //     if (r.byMe) {
    //       r.byMe = false;
    //       r.count = Math.max(0, r.count - 1);
    //     } else {
    //       r.byMe = true;
    //       r.count = r.count + 1;
    //     }
    //     return { ...m, reactions };
    //   })
    // );
    // gửi reaction lên server (tạm bỏ qua, bạn có thể viết API riêng)
  };

  const ctxValue: ChatContextValue = {
    isLoading,
    messages,
    sendMessage,
    addReaction,
    removeAttachmentObjectURLs,
  };

  return (
    <ChatContext.Provider value={ctxValue}>{children}</ChatContext.Provider>
  );
};
