"use client";
import { useEffect, useRef, useState } from "react";
import { useChat } from "@/providers/chatProvider";
import type { Attachment } from "@/types/message";
import { renderMarkdownToHtml, uid } from "@/utils/utils";

const Composer: React.FC = () => {
  const { sendMessage, removeAttachmentObjectURLs } = useChat();
  const [text, setText] = useState("");
  const [attachments, setAttachments] = useState<Attachment[]>([]);
  const [isPreview, setIsPreview] = useState(false);
  const [scheduleAt, setScheduleAt] = useState<string>("");

  const fileRef = useRef<HTMLInputElement | null>(null);
  const textareaRef = useRef<HTMLTextAreaElement | null>(null);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "b") {
        e.preventDefault();
        wrapSelectionIn(textareaRef.current!, "**");
      }
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "i") {
        e.preventDefault();
        wrapSelectionIn(textareaRef.current!, "*");
      }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, []);

  const wrapSelectionIn = (ta: HTMLTextAreaElement, wrapper: string) => {
    const start = ta.selectionStart;
    const end = ta.selectionEnd;
    const before = ta.value.slice(0, start);
    const sel = ta.value.slice(start, end);
    const after = ta.value.slice(end);
    const replacement = `${wrapper}${sel}${wrapper}`;
    const newText = before + replacement + after;
    setText(newText);
    // set caret
    requestAnimationFrame(() => {
      ta.focus();
      ta.setSelectionRange(
        start + wrapper.length,
        start + wrapper.length + sel.length
      );
    });
  };

  const onFiles = (files: FileList | null) => {
    if (!files) return;
    const arr: Attachment[] = [];
    Array.from(files).forEach((f) => {
      const url = URL.createObjectURL(f);
      arr.push({
        id: uid("att"),
        name: f.name,
        type: f.type,
        url,
        size: f.size,
      });
    });
    setAttachments((s) => [...s, ...arr]);
  };

  const onSend = () => {
    if (!text.trim() && attachments.length === 0) return;
    const scheduledAtTs = scheduleAt ? new Date(scheduleAt).getTime() : null;
    sendMessage({
      text,
      attachments,
      scheduledAt: scheduledAtTs,
      reactions: {},
    });
    setText("");
    setAttachments([]);
    setScheduleAt("");
    setIsPreview(false);
  };

  const onPaste = (e: React.ClipboardEvent) => {
    setAttachments((s) => s.filter((a) => a.id !== id));
  };
  const removeAttachment = (id: string) => {
    const found = attachments.find((a) => a.id === id);
    if (found) URL.revokeObjectURL(found.url);
    setAttachments((s) => s.filter((a) => a.id !== id));
  };
  return (
    <div className="p-4 border-t bg-background">
      <div className="flex flex-col sm:flex-row gap-2">
        <div className="flex-1">
          <textarea
            ref={textareaRef}
            value={text}
            onChange={(e) => setText(e.target.value)}
            onPaste={onPaste}
            placeholder="Write a message... (supports **bold**, *italic*, `code`, [link](https://))"
            className="w-full min-h-[70px] max-h-40 p-3 rounded-lg border resize-y"
          />
          <div className="mt-2 flex items-center gap-2">
            <button
              type="button"
              className="px-3 py-1 rounded border text-sm"
              onClick={() => wrapSelectionIn(textareaRef.current!, "**")}
            >
              Bold (Ctrl/Cmd+B)
            </button>
            <button
              type="button"
              className="px-3 py-1 rounded border text-sm"
              onClick={() => wrapSelectionIn(textareaRef.current!, "*")}
            >
              Italic (Ctrl/Cmd+I)
            </button>
            <button
              type="button"
              onClick={() => setIsPreview((s) => !s)}
              className="px-3 py-1 rounded border text-sm"
            >
              {isPreview ? "Edit" : "Preview"}
            </button>
            <label className="px-3 py-1 rounded border text-sm cursor-pointer">
              Attach
              <input
                ref={fileRef}
                type="file"
                className="hidden"
                onChange={(e) => onFiles(e.target.files)}
                multiple
              />
            </label>
            <div className="ml-auto text-xs text-slate-500">
              Tip: paste images directly into the editor
            </div>
          </div>

          {attachments.length > 0 && (
            <div className="mt-3 grid grid-cols-4 gap-2">
              {attachments.map((a) => (
                <div key={a.id} className="p-2 border rounded flex flex-col">
                  {a.type.startsWith("image/") ? (
                    <img
                      src={a.url}
                      alt={a.name}
                      className="h-24 object-cover rounded"
                    />
                  ) : (
                    <div className="h-24 flex items-center justify-center bg-slate-50 rounded text-sm">
                      {a.name}
                    </div>
                  )}
                  <div className="mt-2 flex items-center justify-between gap-2">
                    <div className="text-xs text-slate-500 truncate">
                      {a.name}
                    </div>
                    <div className="flex gap-1">
                      <button
                        type="button"
                        className="text-xs px-2 py-1 rounded border"
                        onClick={() => removeAttachment(a.id)}
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {isPreview && (
            <div className="mt-3 p-3 bg-white border rounded">
              <div className="text-xs text-slate-500 mb-2">Preview</div>
              <div
                // biome-ignore lint/security/noDangerouslySetInnerHtml: <explanation>
                dangerouslySetInnerHTML={{ __html: renderMarkdownToHtml(text) }}
              />
            </div>
          )}
        </div>

        <div className="w-full sm:w-56 flex-shrink-0 space-y-2">
          <div className="p-3 bg-white border rounded">
            <div className="text-xs text-slate-500 mb-2">Schedule</div>
            <input
              type="datetime-local"
              value={scheduleAt}
              onChange={(e) => setScheduleAt(e.target.value)}
              className="w-full rounded border p-2 text-sm"
            />
            <div className="text-xs text-slate-400 mt-2">
              Leave empty to send immediately.
            </div>
          </div>

          <div className="p-3 bg-white border rounded flex flex-col gap-2">
            <div className="text-xs text-slate-500">Actions</div>
            <button
              type="button"
              onClick={onSend}
              className="px-3 py-2 bg-indigo-600 text-white rounded"
            >
              Send
            </button>
            <button
              type="button"
              onClick={() => {
                setText("");
                removeAttachmentObjectURLs(attachments);
                setAttachments([]);
              }}
              className="px-3 py-2 border rounded"
            >
              Clear
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export { Composer };
