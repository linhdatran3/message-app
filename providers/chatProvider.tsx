"use client";

import { createContext, useContext, useEffect, useState } from "react";
import type { Attachment, Message } from "@/types/message";
import { uid } from "@/utils/utils";

type ChatContextValue = {
  messages: Message[];
  sendMessage: (msg: Omit<Message, "id" | "createdAt">) => Message;
  addReaction: (messageId: string, emoji: string) => void;
  removeAttachmentObjectURLs: (attachments: Attachment[]) => void;
};

const ChatContext = createContext<ChatContextValue | null>(null);

export const useChat = () => {
  const ctx = useContext(ChatContext);
  if (!ctx) throw new Error("useChat must be used inside ChatProvider");
  return ctx;
};

export const ChatProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [messages, setMessages] = useState<Message[]>(() => {
    try {
      const raw =
        typeof window !== "undefined"
          ? localStorage.getItem("chat_messages_v1")
          : null;
      return raw ? JSON.parse(raw) : [];
    } catch (e) {
      return [];
    }
  });

  // restore scheduled messages timeouts
  useEffect(() => {
    const now = Date.now();
    messages.forEach((m) => {
      if (m.scheduledAt && m.scheduledAt > now) {
        const delay = m.scheduledAt - now;
        setTimeout(() => {
          setMessages((prev) =>
            prev.map((pm) =>
              pm.id === m.id ? { ...pm, scheduledAt: null } : pm
            )
          );
        }, delay);
      }
    });
  }, []);

  useEffect(() => {
    try {
      localStorage.setItem("chat_messages_v1", JSON.stringify(messages));
    } catch (e) {}
  }, [messages]);

  const removeAttachmentObjectURLs = (attachments: Attachment[]) => {
    attachments.forEach((a) => URL.revokeObjectURL(a.url));
  };

  const sendMessage = (msg: Omit<Message, "id" | "createdAt">) => {
    const m: Message = {
      id: uid("msg"),
      text: msg.text,
      attachments: msg.attachments,
      createdAt: Date.now(),
      scheduledAt: msg.scheduledAt || null,
      reactions: msg.reactions || {},
      fromMe: true,
    };

    if (m.scheduledAt && m.scheduledAt > Date.now()) {
      // schedule
      setMessages((prev) => [...prev, m]);
      const delay = m.scheduledAt - Date.now();
      setTimeout(() => {
        setMessages((prev) =>
          prev.map((pm) => (pm.id === m.id ? { ...pm, scheduledAt: null } : pm))
        );
      }, delay);
    } else {
      setMessages((prev) => [...prev, m]);
    }

    return m;
  };

  const addReaction = (messageId: string, emoji: string) => {
    setMessages((prev) =>
      prev.map((m) => {
        if (m.id !== messageId) return m;
        const reactions = { ...(m.reactions || {}) };
        if (!reactions[emoji])
          reactions[emoji] = { kind: emoji, count: 0, byMe: false };
        const r = reactions[emoji];
        if (r.byMe) {
          r.byMe = false;
          r.count = Math.max(0, r.count - 1);
        } else {
          r.byMe = true;
          r.count = r.count + 1;
        }
        return { ...m, reactions };
      })
    );
  };

  const ctxValue: ChatContextValue = {
    messages,
    sendMessage,
    addReaction,
    removeAttachmentObjectURLs,
  };

  return (
    <ChatContext.Provider value={ctxValue}>{children}</ChatContext.Provider>
  );
};
