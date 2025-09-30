import type { Reaction } from "./reaction";

export type Attachment = {
  id: string;
  name: string;
  type: string; // mime
  url: string; // object URL
  size?: number;
};

export type Message = {
  id: string;
  text: string; // raw markdown-ish text
  attachments: Attachment[];
  createdAt: number;
  scheduledAt?: number | null;
  reactions?: Reaction[];
  fromMe?: boolean;
};
