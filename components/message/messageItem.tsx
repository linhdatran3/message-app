import type { Message } from "@/types/message";
import { formatTime, generateMarkdownToHTML } from "@/utils/utils";
import { AttachmentDisplay } from "../editor/attachment";
import { ReactionTooltip } from "../reaction/reactionTooltip";

const MessageItem = ({
  id,
  fromMe = false,
  createdAt,
  text,
  attachments,
  username,
  reactions,
}: Message) => {
  return (
    <ReactionTooltip
      id={id}
      position={fromMe ? "right" : "left"}
      reactions={reactions}
    >
      <div className={`flex ${fromMe ? "justify-end" : "justify-start"}`}>
        <div className="max-w-[75%] group" id={id}>
          {/* <p className="text-xs text-foreground/80 text-end hidden group-focus-visible:visible">
            {formatTime(createdAt)}
          </p> */}
          {fromMe ? (
            <p className="text-xs text-foreground/80 text-end">
              {formatTime(createdAt)}
            </p>
          ) : (
            <div className="font-semibold flex justify-start gap-2 items-center">
              {username}
              <p className="text-xs text-foreground/80">
                {formatTime(createdAt)}
              </p>
            </div>
          )}
          <div
            className={`bg-primary rounded-2xl p-3 shadow-sm border ${
              fromMe ? "rounded-br-none" : "rounded-bl-none"
            }`}
          >
            <div
              className="prose-sm break-words"
              // biome-ignore lint/security/noDangerouslySetInnerHtml: <off>
              dangerouslySetInnerHTML={{
                __html: generateMarkdownToHTML(text),
              }}
            />

            {attachments && attachments.length > 0 && (
              <div className="mt-2">
                {attachments.map((file) => (
                  <AttachmentDisplay key={file.id} file={file} />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </ReactionTooltip>
  );
};
MessageItem.displayName = "MessageItem";
export { MessageItem };
