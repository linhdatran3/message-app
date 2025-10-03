import { useState } from "react";
import { useChat } from "@/providers/chatProvider";

interface ReactionPillProps {
  emoji: string;
  count: number;
  onClick: () => void;
  users?: string[];
}

const ReactionPill = ({ emoji, count, onClick, users }: ReactionPillProps) => {
  const [showUsers, setShowUsers] = useState(false);
  const { username } = useChat();

  const isActive = users?.includes(username || "");

  return (
    <div className="relative">
      <button
        type="button"
        onClick={onClick}
        onMouseEnter={() => setShowUsers(true)}
        onMouseLeave={() => setShowUsers(false)}
        className={`flex items-center gap-1 px-2 py-1 rounded-full text-sm border
          hover:bg-foreground/20 transition-colors
          ${isActive ? "border-2 border-primary" : ""}`}
      >
        <span>{emoji}</span>
        {count > 0 && <span className="text-xs">{count}</span>}
      </button>

      {users && users.length > 0 && showUsers && (
        // biome-ignore lint/a11y/noStaticElementInteractions: <off>
        <div
          className={`absolute bottom-full left-1/2 -translate-x-1/2 mb-2 
            bg-slate-900 text-white text-xs rounded-md px-3 py-2 
            whitespace-nowrap z-50 shadow-lg
            animate-in fade-in slide-in-from-bottom-1 duration-200 `}
          onMouseEnter={() => setShowUsers(true)}
          onMouseLeave={() => setShowUsers(false)}
        >
          <div className="absolute top-full left-1/2 -translate-x-1/2 -mt-[1px]">
            <div className="border-4 border-transparent border-t-slate-900" />
          </div>

          <div className="flex flex-col gap-1">
            {users.map((user, index) => (
              <div key={index.toString()} className="flex items-center gap-1">
                <span>{user}</span>
                {user === username && (
                  <span className="text-blue-400">(You)</span>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

ReactionPill.displayName = "ReactionPill";
export default ReactionPill;
