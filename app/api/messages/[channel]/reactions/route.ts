import fs from "node:fs";
import path from "node:path";
import type { Message } from "@/types/message";
import type { Reaction } from "@/types/reaction";

const filePath = path.join(process.cwd(), "data", "messages.json");

export async function POST(
  req: Request,
  { params }: { params: Promise<{ channel: string }> }
) {
  try {
    const { messageId, emoji, username } = await req.json();
    const { channel } = await params;

    const data = JSON.parse(fs.readFileSync(filePath, "utf-8"));
    if (!data.channels[channel]) {
      return Response.json({ error: "Channel not found" }, { status: 404 });
    }

    const messageIndex = data.channels[channel].findIndex(
      (msg: Message) => msg.id === messageId
    );

    if (messageIndex === -1) {
      return Response.json({ error: "Message not found" }, { status: 404 });
    }

    const message = data.channels[channel][messageIndex];

    if (!message.reactions) {
      message.reactions = [];
    }

    const reactionIndex = message.reactions.findIndex(
      (r: Reaction) => r.kind === emoji
    );
    if (reactionIndex !== -1) {
      const reaction = message.reactions[reactionIndex];
      const users = reaction.users || [];
      const userIndex = users.indexOf(username);

      if (userIndex !== -1) {
        users.splice(userIndex, 1);

        if (users.length === 0) {
          message.reactions.splice(reactionIndex, 1);
        } else {
          reaction.users = users;
          reaction.count = users.length;
        }
      } else {
        users.push(username);
        reaction.users = users;
        reaction.count = users.length;
      }
    } else {
      message.reactions.push({
        kind: emoji,
        users: [username],
        count: 1,
      });
    }

    data.channels[channel][messageIndex] = message;

    fs.writeFileSync(filePath, JSON.stringify(data, null, 2));

    return Response.json(
      {
        success: true,
        message: message,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error processing reaction:", error);
    return Response.json({ error: "Internal server error" }, { status: 500 });
  }
}
