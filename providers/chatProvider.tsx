"use client";

import { createContext, useContext, useEffect, useMemo, useState } from "react";
import type { Message } from "@/types/message";
import type { EmojiKind } from "@/types/reaction";
import { uid } from "@/utils/utils";

type ChatContextValue = {
  isLoading: boolean;
  messages: Message[];
  username?: string;
  sendMessage: (
    msg: Omit<Message, "id" | "createdAt" | "fromMe">
  ) => Promise<Message>;
  addReaction: (messageId: string, emoji: EmojiKind) => Promise<void>;
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

  const username = useMemo(() => {
    if (typeof window !== "undefined") {
      return localStorage.getItem("username")?.trim() || "";
    }
    return "";
  }, []);

  useEffect(() => {
    setIsLoading(true);
    fetch(`/api/messages/${channel}`)
      .then((res) => res.json())
      .then((data) => {
        setIsLoading(false);
        setMessages(
          (data as Message[])?.map((item) => ({
            ...item,
            fromMe: item.username === username,
          }))
        );
      })
      .catch(() => {
        setMessages([]);
        setIsLoading(false);
      });
  }, [channel, username]);

  const sendMessage = async (msg: Omit<Message, "id" | "createdAt">) => {
    const m: Message = {
      id: uid("msg"),
      text: msg.text,
      attachments: msg.attachments,
      createdAt: Date.now(),
      scheduledAt: msg.scheduledAt || null,
      reactions: undefined,
      fromMe: true,
      username: username,
    };

    setMessages((prev) => [...prev, m]);

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
    if (!username) {
      console.warn("No username found");
      return;
    }

    const previousMessages = messages;

    setMessages((prev) =>
      prev.map((m) => {
        if (m.id !== messageId) return m;

        const reactions = m.reactions || [];
        const reactionIndex = reactions.findIndex((r) => r.kind === emoji);

        if (reactionIndex !== -1) {
          const reaction = { ...reactions[reactionIndex] };
          const users = [...(reaction.users || [])];
          const userIndex = users.indexOf(username);

          const updatedReactions = [...reactions];

          if (userIndex !== -1) {
            users.splice(userIndex, 1);

            if (users.length === 0) {
              updatedReactions.splice(reactionIndex, 1);
            } else {
              updatedReactions[reactionIndex] = {
                ...reaction,
                users,
                count: users.length,
              };
            }
          } else {
            users.push(username);
            updatedReactions[reactionIndex] = {
              ...reaction,
              users,
              count: users.length,
            };
          }

          return { ...m, reactions: updatedReactions };
        } else {
          return {
            ...m,
            reactions: [
              ...reactions,
              {
                kind: emoji,
                users: [username],
                count: 1,
              },
            ],
          };
        }
      })
    );

    try {
      const res = await fetch(`/api/messages/${channel}/reactions`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messageId,
          emoji,
          username,
        }),
      });

      if (!res.ok) {
        throw new Error("Failed to save reaction");
      }
    } catch (e) {
      console.error("Failed to save reaction", e);
      setMessages(previousMessages);
    }
  };

  const ctxValue: ChatContextValue = {
    isLoading,
    messages,
    sendMessage,
    addReaction,
    username,
  };

  return (
    <ChatContext.Provider value={ctxValue}>{children}</ChatContext.Provider>
  );
};
