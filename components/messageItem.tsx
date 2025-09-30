import type { Message } from "@/types/message";
import { formatTime, renderMarkdownToHtml } from "@/utils/utils";
import { ReactionTooltip } from "./reactionTooltip";

const MessageItem = ({ message }: { message: Message }) => {
  return (
    <ReactionTooltip
      id={message.id}
      position={message?.fromMe ? "right" : "left"}
    >
      <div
        className={`flex ${message.fromMe ? "justify-end" : "justify-start"}`}
      >
        <div
          className={`max-w-[75%] bg-primary p-3 rounded-2xl shadow-sm border ${
            message.fromMe ? "rounded-br-none" : "rounded-bl-none"
          }`}
        >
          <div className="text-xs text-slate-400 mb-1">
            {message.fromMe ? "You" : "User"} • {formatTime(message.createdAt)}
          </div>
          <div
            className="prose-sm break-words"
            // biome-ignore lint/security/noDangerouslySetInnerHtml: <explanation>
            dangerouslySetInnerHTML={{
              __html: renderMarkdownToHtml(message.text),
            }}
          />

          {message.attachments && message.attachments.length > 0 && (
            <div className="mt-2 grid grid-cols-3 gap-2">
              {message.attachments.map((a) => (
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

          {message.scheduledAt ? (
            <div className="mt-2 text-xs text-amber-600">
              Scheduled for {formatTime(message.scheduledAt)}
            </div>
          ) : null}
        </div>
      </div>
    </ReactionTooltip>
  );
};
MessageItem.displayName = "MessageItem";
export { MessageItem };
