import type { EmojiKind } from "@/types/reaction";

export const EMOJI_ICON: Record<EmojiKind, string> = {
  like: "👍",
  laugh: "😂",
  love: "❤️",
};

export const DEFAULT_EMOJI_KIND: EmojiKind[] = ["like", "laugh", "love"];
