/** biome-ignore-all lint/security/noDangerouslySetInnerHtml: <explanation> */
"use client";

import {
  forwardRef,
  useEffect,
  useImperativeHandle,
  useRef,
  useState,
} from "react";
import { markdownToHtml } from "@/utils/utils";

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

type TabEditor = "preview" | "write";

const TabList = ({
  actived,
  setActived,
}: {
  actived: TabEditor;
  setActived: (actived: TabEditor) => void;
}) => {
  const tabs: TabEditor[] = ["write", "preview"];

  return (
    <div role="tablist" className="flex">
      {tabs.map((tab) => (
        <button
          key={tab}
          type="button"
          onClick={() => setActived(tab)}
          className={`py-2 px-4 ${
            actived === tab
              ? "bg-background border border-b-0 rounded-t-lg transition-transform ease-linear duration-100"
              : "bg-foreground/20 border-b"
          }`}
        >
          {tab.toUpperCase()}
        </button>
      ))}
    </div>
  );
};

const RichEditor = forwardRef<RichEditorHandle, Props>(
  ({ initialHTML = "", onChange }, ref) => {
    const editorRef = useRef<HTMLDivElement | null>(null);
    const [mode, setMode] = useState<TabEditor>("write");
    const [content, setContent] = useState(initialHTML);

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

    return (
      <div>
        {/* Header */}
        <div className="flex justify-between items-center bg-foreground/20 border rounded-t-lg border-b-0">
          <TabList actived={mode} setActived={setMode} />
          <div className="flex bg-foreground/20 border-b px-2" role="toolbar">
            <button type="button" className="font-bold px-1">
              B
            </button>
            <button type="button" className="italic px-1">
              I
            </button>
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
            className="min-h-[120px] border rounded-b-lg p-3 border-t-0 focus:outline-0"
          />
        ) : (
          <div
            className="min-h-[120px] border rounded-b-lg p-3 border-t-0 focus:outline-0"
            dangerouslySetInnerHTML={{
              __html: markdownToHtml(content),
            }}
          />
        )}
      </div>
    );
  }
);

RichEditor.displayName = "RichEditor";
export { RichEditor };
