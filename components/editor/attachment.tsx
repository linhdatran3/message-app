import { useRef } from "react";
import type { AttachedFile } from "@/types/message";
import { fileToBase64 } from "@/utils/utils";

// Get file icon based on type
const getFileIcon = (type: string): string => {
  if (type.startsWith("image/")) return "🖼️";
  if (type.startsWith("video/")) return "🎥";
  if (type.startsWith("audio/")) return "🎵";
  if (type.includes("pdf")) return "📄";
  if (type.includes("word") || type.includes("document")) return "📝";
  if (type.includes("excel") || type.includes("sheet")) return "📊";
  if (type.includes("zip") || type.includes("rar")) return "📦";
  return "📎";
};
// Helper function to format file size
const formatFileSize = (bytes: number): string => {
  if (bytes === 0) return "0 Bytes";
  const k = 1024;
  const sizes = ["Bytes", "KB", "MB", "GB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return `${Math.round((bytes / k ** i) * 100) / 100}${" "}${sizes[i]}`;
};

const AttachmentFileTrigger = ({
  onAddFiles,
}: {
  onAddFiles: (files: AttachedFile[]) => void;
}) => {
  const attachmentInputRef = useRef<HTMLInputElement | null>(null);

  const handleAttachFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;

    const newFiles: AttachedFile[] = [];

    //TODO: limit size
    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      const base64Data = await fileToBase64(file);
      const fileData: AttachedFile = {
        id: `${Date.now()}-${i}`,
        name: file.name,
        size: file.size,
        type: file.type,
        base64Data: base64Data,
      };
      newFiles.push(fileData);
    }
    onAddFiles([...newFiles]);
    e.target.value = ""; // Reset input
  };

  return (
    <>
      <button
        type="button"
        onClick={() => attachmentInputRef.current?.click()}
        className="px-2 py-1 rounded hover:bg-foreground/10"
        title="Attach file"
      >
        📎 Attach
      </button>
      <input
        type="file"
        multiple
        ref={attachmentInputRef}
        hidden
        onChange={handleAttachFile}
      />
    </>
  );
};

const AttachmentFilesContent = ({
  attachedFiles,
  onRemoveFile,
}: {
  attachedFiles: AttachedFile[];
  onRemoveFile: (id: string) => void;
}) => {
  return (
    attachedFiles.length > 0 && (
      <div className="border-x border-b p-2 bg-background/50">
        <div className="text-sm font-medium mb-2">Attached Files:</div>
        <div className="flex flex-wrap gap-2">
          {attachedFiles.map((file) => (
            <div
              key={file.id}
              className="flex items-center gap-2 bg-foreground/10 rounded px-3 py-2 text-sm"
            >
              <span>{getFileIcon(file.type)}</span>
              <div className="flex flex-col">
                <span className="font-medium truncate max-w-[200px]">
                  {file.name}
                </span>
                <span className="text-xs text-foreground/60">
                  {formatFileSize(file.size)}
                </span>
              </div>
              <button
                type="button"
                onClick={() => onRemoveFile(file.id)}
                className="ml-2 text-red-500 hover:text-red-700"
                title="Remove file"
              >
                ✕
              </button>
            </div>
          ))}
        </div>
      </div>
    )
  );
};

const AttachmentDisplay = ({ file }: { file: AttachedFile }) => {
  const handleDownload = () => {
    const link = document.createElement("a");
    link.href = file.base64Data;
    link.download = file.name;
    link.click();
  };

  // Render image preview
  if (file.type.startsWith("image/")) {
    return (
      <div className="my-2">
        <img
          src={file.base64Data}
          alt={file.name}
          className="max-w-full max-h-[200px] rounded border cursor-pointer hover:opacity-80"
          onClick={handleDownload}
          onKeyDown={handleDownload}
        />
        <div className="text-xs text-foreground/60 mt-1">
          {file.name} • {formatFileSize(file.size)}
        </div>
      </div>
    );
  }

  // Render other files as download button
  return (
    <button
      onClick={handleDownload}
      type="button"
      className="flex items-center gap-2 bg-foreground/10 rounded px-3 py-2 my-2 cursor-pointer hover:bg-foreground/20 transition-colors"
    >
      <>
        <span className="text-2xl">{getFileIcon(file.type)}</span>
        <div className="flex flex-col flex-1">
          <span className="font-medium text-sm">{file.name}</span>
          <span className="text-xs text-foreground/60">
            {formatFileSize(file.size)}
          </span>
        </div>
        <span className="text-foreground/60">⬇️</span>
      </>
    </button>
  );
};

export { AttachmentFileTrigger, AttachmentFilesContent, AttachmentDisplay };
