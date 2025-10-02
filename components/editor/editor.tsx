/** biome-ignore-all lint/security/noDangerouslySetInnerHtml: <explanation> */
"use client";

import {
  forwardRef,
  useEffect,
  useImperativeHandle,
  useRef,
  useState,
} from "react";
import { generateMarkdownToHTML } from "@/utils/utils";
import {
  type AttachedFile,
  AttachmentFilesContent,
  AttachmentFileTrigger,
} from "./attachment";
import { type TabEditor, TabList } from "./tabEditor";
import Toolbar from "./toolbar";

export type RichEditorHandle = {
  getHTML: () => string;
  setHTML: (html: string) => void;
  clear: () => void;
  focus: () => void;
};

type Props = {
  initialHTML?: string;
  onChange?: (html: string) => void;
};

const RichEditor = forwardRef<RichEditorHandle, Props>(
  ({ initialHTML = "", onChange }, ref) => {
    const editorRef = useRef<HTMLDivElement | null>(null);
    const [mode, setMode] = useState<TabEditor>("write");
    const [content, setContent] = useState(initialHTML);
    const fileInputRef = useRef<HTMLInputElement | null>(null);
    const [attachmentFiles, setAttchmentFiles] = useState<
      AttachedFile[] | undefined
    >();

    // biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
    useEffect(() => {
      if (mode === "write" && content !== initialHTML && editorRef.current) {
        editorRef.current.innerHTML = content;
      }
    }, [mode]);

    useImperativeHandle(
      ref,
      () => ({
        getHTML: () => content,
        setHTML: (html: string) => {
          setContent(html);
          if (editorRef.current) editorRef.current.innerHTML = html;
        },
        clear: () => {
          setContent("");
          if (editorRef.current) editorRef.current.innerHTML = "";
        },
        focus: () => editorRef.current?.focus(),
      }),
      [content]
    );

    const insertImage = (file: File) => {
      if (!editorRef.current) return;

      const url = URL.createObjectURL(file);
      const img = document.createElement("img");
      img.src = url;
      img.alt = file.name;
      img.style.maxWidth = "100%";

      const selection = window.getSelection();
      if (!selection || !selection.rangeCount) {
        editorRef.current.appendChild(img);
      } else {
        const range = selection.getRangeAt(0);
        range.insertNode(img);
        range.collapse(false);
      }

      // trigger change
      onChange?.(editorRef.current.innerHTML);
      setContent?.(editorRef.current.innerHTML);
    };

    const handleInsertImage = (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (file) insertImage(file);
      e.target.value = ""; // reset input so same file can be reselected
    };

    const handlePaste = (e: React.ClipboardEvent<HTMLDivElement>) => {
      const items = e.clipboardData.items;
      for (let i = 0; i < items.length; i++) {
        const item = items[i];
        if (item.type.startsWith("image/")) {
          const file = item.getAsFile();
          if (file) insertImage(file);
        }
      }
    };

    const handleRemoveFile = (fileId: string) => {
      setAttchmentFiles((prev) => {
        if (!prev) {
          return undefined;
        }
        const fileToRemove = prev.find((f) => f.id === fileId);
        if (fileToRemove) {
          URL.revokeObjectURL(fileToRemove.url); // Clean up memory
        }
        return prev.filter((f) => f.id !== fileId);
      });
    };

    return (
      <div>
        {/* Header */}
        <div className="flex justify-between items-center bg-foreground/20 border rounded-t-lg border-b-0">
          <TabList actived={mode} setActived={setMode} />
          <div
            className="flex bg-foreground/20 border-b px-2 w-full h-[webkit-fill-available]"
            role="toolbar"
          >
            <div className="flex">
              <Toolbar
                editorRef={editorRef}
                onChange={(val) => {
                  onChange?.(val);
                  setContent(val);
                }}
              />
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="px-2 py-1 border rounded hover:bg-foreground/10"
              >
                🖼️ Add Image
              </button>
              <input
                type="file"
                accept="image/*"
                ref={fileInputRef}
                hidden
                onChange={handleInsertImage}
              />
              <AttachmentFileTrigger
                onAddFiles={(newVal) =>
                  setAttchmentFiles((prev) =>
                    prev ? [...prev, ...newVal] : newVal
                  )
                }
              />
            </div>
          </div>
        </div>

        {/* Content */}
        {mode === "write" ? (
          <div
            ref={editorRef}
            contentEditable
            suppressContentEditableWarning
            onInput={() => {
              const val = editorRef.current?.innerHTML || "";
              setContent(val);
              onChange?.(val);
            }}
            onPaste={handlePaste}
            className="min-h-[120px] border rounded-b-lg p-3 border-t-0 focus:outline-0 max-h-[300px] overflow-y-auto"
          />
        ) : (
          <div
            className="min-h-[120px] border rounded-b-lg p-3 border-t-0 focus:outline-0 max-h-[300px] overflow-y-auto"
            dangerouslySetInnerHTML={{
              __html: generateMarkdownToHTML(content),
            }}
          />
        )}

        {attachmentFiles && (
          <AttachmentFilesContent
            attachedFiles={attachmentFiles}
            onRemoveFile={handleRemoveFile}
          />
        )}
      </div>
    );
  }
);

RichEditor.displayName = "RichEditor";
export { RichEditor };
