import type { Reaction } from "./reaction";

export type AttachedFile = {
  id: string;
  name: string;
  size: number;
  type: string;
  base64Data: string;
};
export type Message = {
  id: string;
  text: string; // raw markdown-ish text
  attachments: AttachedFile[] | undefined;
  createdAt: number;
  scheduledAt?: number | null;
  reactions?: Reaction[];
  fromMe?: boolean;
  username: string; //TODO: use User object has userId
};
