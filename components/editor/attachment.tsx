import { useRef } from "react";

type AttachedFile = {
  id: string;
  name: string;
  size: number;
  type: string;
  url: string;
};
const AttachmentFileTrigger = ({
  onAddFiles,
}: {
  onAddFiles: (files: AttachedFile[]) => void;
}) => {
  const attachmentInputRef = useRef<HTMLInputElement | null>(null);

  // Handle file attachment
  const handleAttachFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;

    const newFiles: AttachedFile[] = [];

    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      const fileData: AttachedFile = {
        id: `${Date.now()}-${i}`,
        name: file.name,
        size: file.size,
        type: file.type,
        url: URL.createObjectURL(file),
      };
      newFiles.push(fileData);
    }
    onAddFiles([...newFiles]);
    // setAttachedFiles((prev) => [...prev, ...newFiles]);
    e.target.value = ""; // Reset input
  };

  // Remove attached file

  return (
    <>
      <button
        type="button"
        onClick={() => attachmentInputRef.current?.click()}
        className="px-2 py-1 border rounded hover:bg-foreground/10"
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
export { AttachmentFileTrigger, AttachmentFilesContent, type AttachedFile };
