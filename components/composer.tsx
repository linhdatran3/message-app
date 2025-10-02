"use client";
import { useRef } from "react";
import { useChat } from "@/providers/chatProvider";

import { RichEditor, type RichEditorHandle } from "./editor/editor";

const Composer: React.FC = () => {
  const ref = useRef<RichEditorHandle | null>(null);
  const { sendMessage } = useChat();

  return (
    <div className="p-4 border-t bg-background">
      <div className="flex flex-col sm:flex-row gap-2">
        <div className="flex-1">
          <RichEditor
            ref={ref}
            onChange={(html) => console.log("content changed", html)}
          />
          <div className="mt-3 flex gap-2">
            <button
              type="button"
              className="px-3 py-2 bg-indigo-600 text-white rounded"
              onClick={() => {
                const html = ref.current?.getHTML() || "";
                console.log("Send HTML:", html);
                // send to your API or ChatProvider.sendMessage

                sendMessage({
                  text: html,
                  attachments: [],
                  scheduledAt: null,
                  reactions: undefined,
                  fromMe: true,
                });

                //TODO: clear
                ref.current?.clear();
              }}
            >
              Send
            </button>

            <button
              type="button"
              className="px-3 py-2 border rounded"
              onClick={() => {
                ref.current?.clear();
              }}
            >
              Reset
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export { Composer };
