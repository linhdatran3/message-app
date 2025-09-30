export type EmojiKind = "like" | "laugh" | "love";

export type Reaction = {
  kind: EmojiKind;
  count: number;
  byMe?: boolean;
};
