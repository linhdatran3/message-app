/** biome-ignore-all lint/security/noDangerouslySetInnerHtml: <off> */
"use client";

import {
  forwardRef,
  useCallback,
  useEffect,
  useImperativeHandle,
  useRef,
  useState,
} from "react";
import type { AttachedFile } from "@/types/message";
import {
  MAX_CONTENT_LENGTH,
  MAX_FILE_SIZE,
  MAX_FILES,
} from "@/utils/constants";
import { generateMarkdownToHTML, getTextLength } from "@/utils/utils";
import { AttachmentFilesContent, AttachmentFileTrigger } from "./attachment";
import { type TabEditor, TabList } from "./tabEditor";
import Toolbar from "./toolbar";

export type RichEditorHandle = {
  getHTML: () => string;
  setHTML: (html: string) => void;
  clear: () => void;
  focus: () => void;
  getAttachments: () => AttachedFile[] | undefined;
};

type Props = {
  initialHTML?: string;
  onChange?: (html: string) => void;
  onSubmit: () => void;
};

const RichEditor = forwardRef<RichEditorHandle, Props>(
  ({ initialHTML = "", onChange, onSubmit }, ref) => {
    const editorRef = useRef<HTMLDivElement | null>(null);
    const [mode, setMode] = useState<TabEditor>("write");
    const [content, setContent] = useState(initialHTML);
    const [attachmentFiles, setAttchmentFiles] = useState<
      AttachedFile[] | undefined
    >();
    const [contentError, setContentError] = useState<string>("");
    const [fileError, setFileError] = useState<string>("");
    // biome-ignore lint/correctness/useExhaustiveDependencies: <off>
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
          // Clear attached files
          // attachmentFiles?.map(file => URL.revokeObjectURL(file.base64Data));
          setAttchmentFiles([]);
          setContentError("");
          setFileError("");
        },
        focus: () => editorRef.current?.focus(),
        getAttachments: () => attachmentFiles,
      }),
      [content, attachmentFiles]
    );

    const handleRemoveFile = useCallback(
      () => (fileId: string) => {
        setAttchmentFiles((prev) => {
          if (!prev) {
            return undefined;
          }
          return prev.filter((f) => f.id !== fileId);
        });
        setFileError("");
      },
      []
    );

    const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
      if (event.key === "Enter") {
        event.preventDefault();
        onSubmit?.();
      }
    };

    const handleInput = () => {
      const val = editorRef.current?.innerHTML || "";
      const textLength = getTextLength(val);

      if (textLength > MAX_CONTENT_LENGTH) {
        setContentError(
          `Content exceeds limit (${textLength}/${MAX_CONTENT_LENGTH} characters)`
        );
        return;
      }

      setContentError("");
      setContent(val);
      onChange?.(val);
    };

    // biome-ignore lint/correctness/useExhaustiveDependencies: <off>
    const handleAddFiles = useCallback((newFiles: AttachedFile[]) => {
      const currentFiles = attachmentFiles || [];

      if (currentFiles.length + newFiles.length > MAX_FILES) {
        setFileError(`Maximum ${MAX_FILES} files allowed`);
        return;
      }

      const maxSizeBytes = MAX_FILE_SIZE * 1024 * 1024; // Convert MB to bytes
      const oversizedFiles = newFiles.filter((f) => f.size > maxSizeBytes);

      if (oversizedFiles.length > 0) {
        setFileError(
          `File size exceeds ${MAX_FILE_SIZE}MB: ${oversizedFiles
            .map((f) => f.name)
            .join(", ")}`
        );
        return;
      }

      const totalSize = [...currentFiles, ...newFiles].reduce(
        (sum, f) => sum + f.size,
        0
      );
      const maxTotalSize = MAX_FILE_SIZE * MAX_FILES * 1024 * 1024;

      if (totalSize > maxTotalSize) {
        setFileError(`Total file size exceeds ${MAX_FILE_SIZE * MAX_FILES}MB`);
        return;
      }

      setFileError("");
      setAttchmentFiles((prev) => (prev ? [...prev, ...newFiles] : newFiles));
    }, []);

    return (
      <div>
        {/* Header */}
        <div className="flex flex-col md:flex-row md:justify-between md:items-center bg-forground/10 border rounded-t-lg border-b-0">
          <TabList actived={mode} setActived={setMode} />
          <div
            className="flex bg-foreground/10 border-b px-2 w-full h-[webkit-fill-available] order-first md:order-last"
            role="toolbar"
          >
            <Toolbar
              editorRef={editorRef}
              onChange={(val) => {
                const textLength = getTextLength(val);
                if (textLength <= MAX_CONTENT_LENGTH) {
                  onChange?.(val);
                  setContent(val);
                  setContentError("");
                }
              }}
            />

            <AttachmentFileTrigger onAddFiles={handleAddFiles} />

            <div
              className={`ml-auto text-xs whitespace-nowrap content-center ${
                getTextLength(content) > MAX_CONTENT_LENGTH * 0.9
                  ? "text-orange-500 font-semibold"
                  : contentError
                  ? "text-red-500 font-semibold"
                  : "text-slate-500"
              }`}
            >
              {getTextLength(content)}/{MAX_CONTENT_LENGTH}
            </div>
          </div>
        </div>
        {/* Error messages */}
        {(contentError || fileError) && (
          <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded px-3 py-2 text-sm text-red-600 dark:text-red-400 mt-2">
            {contentError && <div> {contentError}</div>}
            {fileError && (
              <div className="flex justify-between">
                {" "}
                {fileError}{" "}
                <button type="button" onClick={() => setFileError("")}>
                  X
                </button>
              </div>
            )}
          </div>
        )}
        {/* Content */}
        {mode === "write" ? (
          // biome-ignore lint/a11y/noStaticElementInteractions: <off>
          <div
            ref={editorRef}
            contentEditable
            suppressContentEditableWarning
            onInput={handleInput}
            // onPaste={handlePaste}
            onKeyDown={handleKeyDown}
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
