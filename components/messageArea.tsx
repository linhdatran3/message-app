"use client";

import { useEffect, useRef } from "react";
import { useChat } from "@/providers/chatProvider";
import { EmptyMessage } from "./emptyMessage";
import { MessageItem } from "./messageItem";

const MessagesSkeleton = () => {
  return (
    <div className="space-y-4 animate-pulse">
      {Array.from({ length: 3 }).map((_, i) => (
        <div
          key={i.toString()}
          className="w-3/4 h-16 bg-foreground/80 rounded-xl"
        />
      ))}
    </div>
  );
};
const MessagesArea = () => {
  const { isLoading, messages } = useChat();
  const containerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const el = containerRef.current;
    if (el) {
      el.scrollTop = el.scrollHeight;
    }
  }, []);

  if (isLoading) {
    return (
      <div className="flex-1 overflow-auto p-4 space-y-4" ref={containerRef}>
        <MessagesSkeleton />
      </div>
    );
  }

  return (
    <div className="flex-1 overflow-auto p-4 space-y-4" ref={containerRef}>
      {messages.length === 0 ? (
        <EmptyMessage />
      ) : (
        messages.map((m) => (
          <MessageItem
            key={m.id}
            id={m.id}
            fromMe={m?.fromMe}
            createdAt={m.createdAt}
            text={m.text}
            attachments={m.attachments}
            scheduledAt={m.scheduledAt}
          />
        ))
      )}
    </div>
  );
};

export { MessagesArea };
