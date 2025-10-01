"use client";
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

  return (
    <div className="group relative">
      {children}

      {/* Desc: only visible when hover the content */}
      <div
        className={`border flex gap-2 absolute w-fit bottom-0 -mb-1 translate-y-full bg-background z-10
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
            active={undefined}
          />
        ))}
      </div>

      {reactions ? (
        <div className="mt-3 flex gap-2">
          {reactions?.map((react) => (
            <ReactionPill
              key={react.kind}
              emoji={EMOJI_ICON?.[react.kind]}
              count={react?.count || 0}
              onClick={() => addReaction(id, react.kind)}
              active={!!react?.byMe}
            />
          ))}
        </div>
      ) : (
        ""
      )}
    </div>
  );
};

ReactionTooltip.displayName = "ReactionTooltip";
export { ReactionTooltip };
