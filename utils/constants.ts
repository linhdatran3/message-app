import type { FontStyles } from "@/types/marked";
import type { EmojiKind } from "@/types/reaction";

export const EMOJI_ICON: Record<EmojiKind, string> = {
  like: "👍",
  laugh: "😂",
  love: "❤️",
};

export const DEFAULT_EMOJI_KIND: EmojiKind[] = ["like", "laugh", "love"];

export const FONT_STYLES_SYNTAX: Record<FontStyles, string> = {
  bold: "**",
  italic: "*",
  code: "`",
};

export const MAX_CONTENT_LENGTH = 1000;
export const MAX_FILES = 3;
export const MAX_FILE_SIZE = 10;
