"use client";
import Image from "next/image";
import { redirect } from "next/navigation";
import { useCallback, useRef } from "react";
import { useChat } from "@/providers/chatProvider";
import { RichEditor, type RichEditorHandle } from "./editor/editor";

const Composer: React.FC = () => {
  const ref = useRef<RichEditorHandle | null>(null);
  const { sendMessage } = useChat();

  // biome-ignore lint/correctness/useExhaustiveDependencies: <off>
  const handleSendMessage = useCallback(() => {
    const html = ref.current?.getHTML() || "";
    const attachments = ref.current?.getAttachments();
    console.log("Send HTML:", html);
    // send to your API or ChatProvider.sendMessage

    const username = localStorage.getItem("username");
    if (!username) {
      alert("You need to add username before sending message.");
      redirect("/");
    }

    sendMessage({
      text: html,
      attachments:
        attachments && attachments?.length > 0 ? attachments : undefined,
      scheduledAt: null,
      reactions: undefined,
      username,
    });

    //TODO: clear
    ref.current?.clear();
  }, []);

  return (
    <div className="p-4 border-t bg-background">
      <div className="flex flex-col sm:flex-row gap-2">
        <div className="flex-1 relative">
          <RichEditor
            ref={ref}
            onChange={(html) => console.log("content changed", html)}
            onSubmit={handleSendMessage}
          />
          <button
            type="button"
            className="border rounded-md absolute bottom-2 right-2 z-20 px-2 py-1 hover:cursor-pointer"
            onClick={handleSendMessage}
          >
            <Image
              className="dark:invert"
              src="/send.svg"
              alt="Send"
              width={24}
              height={24}
              priority
            />
          </button>
        </div>
      </div>
    </div>
  );
};

export { Composer };
