import type { Message } from "@/types/message";
import { formatTime, renderMarkdownToHtml } from "@/utils/utils";
import { ReactionTooltip } from "./reactionTooltip";

const MessageItem = ({
  id,
  fromMe = false,
  createdAt,
  text,
  attachments,
  scheduledAt,
}: Message) => {
  return (
    <ReactionTooltip id={id} position={fromMe ? "right" : "left"}>
      <div className={`flex ${fromMe ? "justify-end" : "justify-start"}`}>
        <div
          className={`max-w-[75%] bg-primary p-3 rounded-2xl shadow-sm border ${
            fromMe ? "rounded-br-none" : "rounded-bl-none"
          }`}
        >
          <div className="text-xs text-slate-400 mb-1">
            {fromMe ? "You" : "User"} • {formatTime(createdAt)}
          </div>
          <div
            className="prose-sm break-words"
            // biome-ignore lint/security/noDangerouslySetInnerHtml: <explanation>
            dangerouslySetInnerHTML={{
              __html: renderMarkdownToHtml(text),
            }}
          />

          {attachments && attachments.length > 0 && (
            <div className="mt-2 grid grid-cols-3 gap-2">
              {attachments.map((a) => (
                <div key={a.id} className="flex flex-col items-start gap-1">
                  {a.type.startsWith("image/") ? (
                    <img
                      src={a.url}
                      alt={a.name}
                      className="w-full h-28 object-cover rounded"
                    />
                  ) : (
                    <div className="p-2 bg-slate-50 rounded w-full text-sm">
                      {a.name}
                    </div>
                  )}
                  <div className="text-xs text-slate-400">
                    {Math.round((a.size || 0) / 1024)} KB
                  </div>
                </div>
              ))}
            </div>
          )}

          {scheduledAt ? (
            <div className="mt-2 text-xs text-amber-600">
              Scheduled for {formatTime(scheduledAt)}
            </div>
          ) : null}
        </div>
      </div>
    </ReactionTooltip>
  );
};
MessageItem.displayName = "MessageItem";
export { MessageItem };
