"use client";

import { useEffect, useRef } from "react";
import { useChat } from "@/providers/chatProvider";
import { EmptyMessage } from "./emptyMessage";
import { MessageItem } from "./messageItem";

const MessagesArea = () => {
  const { messages } = useChat();
  const containerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const el = containerRef.current;
    if (el) el.scrollTop = el.scrollHeight;
  }, []);

  return (
    <div className="flex-1 overflow-auto p-4 space-y-4" ref={containerRef}>
      {messages.map((m) => (
        <MessageItem key={m.id} message={m} />
      ))}
      {messages.length === 0 && <EmptyMessage />}
    </div>
  );
};
export { MessagesArea };
