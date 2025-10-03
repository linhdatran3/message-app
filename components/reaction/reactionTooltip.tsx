"use client";
import { useEffect, useRef, useState } from "react";
import { useChat } from "@/providers/chatProvider";
import type { EmojiKind, Reaction } from "@/types/reaction";
import { DEFAULT_EMOJI_KIND, EMOJI_ICON } from "@/utils/constants";
import ReactionPill from "./reactionPill";

interface ReactionTooltipProps {
  reactions?: Reaction[];
  id: string;
  children: React.ReactNode;
  defaultEmojiKinds?: EmojiKind[];
  position: "left" | "right";
}
//TODO: button add more reactions that differ from the default list

const ReactionTooltip = ({
  reactions,
  id,
  children,
  defaultEmojiKinds = DEFAULT_EMOJI_KIND,
  position = "left",
}: ReactionTooltipProps) => {
  const { addReaction } = useChat();

  const [showPicker, setShowPicker] = useState(false);
  const pickerRef = useRef<HTMLDivElement>(null);
  const touchTimerRef = useRef<NodeJS.Timeout>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // Close picker when click/touch outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent | TouchEvent) => {
      if (
        pickerRef.current &&
        !pickerRef.current.contains(event.target as Node) &&
        containerRef.current &&
        !containerRef.current.contains(event.target as Node)
      ) {
        setShowPicker(false);
      }
    };

    if (showPicker) {
      document.addEventListener("mousedown", handleClickOutside);
      document.addEventListener("touchstart", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("touchstart", handleClickOutside);
    };
  }, [showPicker]);

  // Mobile: Long press to show picker
  const handleTouchStart = (e: React.TouchEvent) => {
    const target = e.target as HTMLElement;
    if (
      target.tagName === "A" ||
      target.tagName === "BUTTON" ||
      target.closest("button")
    ) {
      return;
    }

    touchTimerRef.current = setTimeout(() => {
      setShowPicker(true);
      if (navigator.vibrate) {
        navigator.vibrate(50);
      }
    }, 500); // Long press 500ms
  };

  const handleTouchEnd = () => {
    if (touchTimerRef.current) {
      clearTimeout(touchTimerRef.current);
    }
  };

  const handleTouchMove = () => {
    // Cancel long press if user scroll
    if (touchTimerRef.current) {
      clearTimeout(touchTimerRef.current);
    }
  };

  useEffect(() => {
    return () => {
      if (touchTimerRef.current) {
        clearTimeout(touchTimerRef.current);
      }
    };
  }, []);

  return (
    <div className="group relative">
      <div
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
        onTouchMove={handleTouchMove}
        className="touch-none select-none" // Prevent text selection on long press
      >
        {children}
      </div>

      {/* Desc: only visible when hover the content */}
      <div
        className={`hidden border md:flex gap-2 absolute w-fit bottom-0 -mb-1 translate-y-full bg-background z-10
           opacity-0 invisible group-hover:opacity-100 group-hover:visible
           transition-all duration-300
           px-2 py-1 rounded-md text-sm whitespace-nowrap ${
             position === "right" ? "right-0" : "left-0"
           }`}
      >
        {defaultEmojiKinds?.map((e) => (
          <ReactionPill
            key={e.toString()}
            emoji={EMOJI_ICON?.[e]}
            count={0}
            onClick={() => addReaction(id, e)}
            users={undefined}
          />
        ))}
      </div>

      {/* Mobile: Long press picker */}
      {showPicker && (
        <div
          ref={pickerRef}
          className={`border flex gap-2 absolute w-fit bottom-0 -mb-1 translate-y-full bg-background z-20
            px-2 py-1 rounded-md text-sm whitespace-nowrap shadow-lg
            animate-in fade-in zoom-in-95 duration-200 ${
              position === "right" ? "right-0" : "left-0"
            }`}
        >
          {defaultEmojiKinds?.map((e) => (
            <ReactionPill
              key={e.toString()}
              emoji={EMOJI_ICON?.[e]}
              count={0}
              onClick={() => {
                addReaction(id, e);
                setShowPicker(false);
              }}
              users={undefined}
            />
          ))}
        </div>
      )}

      {reactions && reactions.length > 0 && (
        <div
          className={`mt-3 flex gap-2 flex-wrap ${
            position === "right" ? "justify-end" : "justify-start"
          }`}
        >
          {reactions.map((react) => (
            <ReactionPill
              key={react.kind}
              emoji={EMOJI_ICON?.[react.kind]}
              count={react?.count || 0}
              onClick={() => addReaction(id, react.kind)}
              users={react?.users}
            />
          ))}
        </div>
      )}
    </div>
  );
};

ReactionTooltip.displayName = "ReactionTooltip";
export { ReactionTooltip };
