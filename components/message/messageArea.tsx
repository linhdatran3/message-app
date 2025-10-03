"use client";

import { useEffect, useRef } from "react";
import { useChat } from "@/providers/chatProvider";
import { EmptyMessage } from "./emptyMessage";
import { MessageItem } from "./messageItem";
import { MessagesSkeleton } from "./messageSkeleton";

const MessagesArea = () => {
  const { isLoading, messages } = useChat();
  const messagesContainerRef = useRef<HTMLDivElement | null>(null);
  const isFirstLoadRef = useRef(true);
  const previousLengthRef = useRef(0);

  useEffect(() => {
    const hasNewMessage = messages.length > previousLengthRef.current;

    if (
      !isFirstLoadRef.current &&
      hasNewMessage &&
      messagesContainerRef.current
    ) {
      messagesContainerRef.current.scrollTop =
        messagesContainerRef.current.scrollHeight;
    }

    previousLengthRef.current = messages.length;

    if (isFirstLoadRef.current && messages.length > 0) {
      isFirstLoadRef.current = false;
    }
  }, [messages]);

  if (isLoading) {
    return (
      <div className="flex-1 overflow-auto p-4 space-y-4">
        <MessagesSkeleton />
      </div>
    );
  }

  return (
    <div
      ref={messagesContainerRef}
      className="flex-1 overflow-auto p-4 flex flex-col-reverse gap-4 pb-8"
    >
      {messages.length === 0 ? (
        <div className="flex-1 flex items-center justify-center">
          <EmptyMessage />
        </div>
      ) : (
        [...messages]
          .reverse()
          .map((m) => (
            <MessageItem
              key={m.id}
              id={m.id}
              fromMe={m?.fromMe}
              createdAt={m.createdAt}
              text={m.text}
              attachments={m.attachments}
              scheduledAt={m.scheduledAt}
              username={m?.username}
              reactions={m?.reactions}
            />
          ))
      )}
    </div>
  );
};
MessagesArea.displayName = "MessagesArea";
export { MessagesArea };
