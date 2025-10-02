import type { RefObject } from "react";
import type { FontStyles } from "@/types/marked";
import { FONT_STYLES_SYNTAX } from "@/utils/constants";
import { getHighlightedText } from "@/utils/utils";

interface ToolbarProps {
  editorRef: RefObject<HTMLDivElement | null>;
  onChange?: (html: string) => void;
}
const Toolbar = ({ editorRef, onChange }: ToolbarProps) => {
  const handleAddFontStyles = (style: FontStyles) => {
    if (!editorRef.current) return;

    const symbol = FONT_STYLES_SYNTAX?.[style];
    const selectedText = getHighlightedText();
    const selection = window.getSelection();

    if (selectedText && selection && selection.rangeCount > 0) {
      // Has selected text - wrap with ${symbol}
      const range = selection.getRangeAt(0);
      range.deleteContents();
      const boldText = document.createTextNode(
        `${symbol}${selectedText}${symbol}`
      );
      range.insertNode(boldText);
    } else if (selection && selection.rangeCount > 0) {
      // No selection - insert ${symbol} at cursor
      const range = selection.getRangeAt(0);
      const boldPlaceholder = document.createTextNode(`${symbol}${symbol}`);
      range.insertNode(boldPlaceholder);

      // Place cursor between the ${symbol}
      range.setStart(boldPlaceholder, 2);
      range.setEnd(boldPlaceholder, 2);
      selection.removeAllRanges();
      selection.addRange(range);
    }

    // Trigger change event
    const val = editorRef.current.innerHTML;
    onChange?.(val);

    // Keep focus on editor
    editorRef.current.focus();
  };
  return (
    <div>
      <button
        type="button"
        className="py-2 px-4 font-bold hover:opacity-60 hover:bg-background hover:rounded-lg"
        onClick={() => handleAddFontStyles("bold")}
      >
        B
      </button>
      <button
        type="button"
        className="py-2 px-4 italic hover:opacity-60 hover:bg-background hover:rounded-lg"
        onClick={() => handleAddFontStyles("italic")}
      >
        I
      </button>
      <button
        type="button"
        className="py-2 px-4 hover:opacity-60 hover:bg-background hover:rounded-lg"
        onClick={() => handleAddFontStyles("code")}
      >
        {"<>"}
      </button>
    </div>
  );
};

Toolbar.displayName = "Toolbar";
export default Toolbar;
