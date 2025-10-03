import { ChatHeader } from "@/components/chatHeader";
import { Composer } from "@/components/composer";
import { MessagesArea } from "@/components/message/messageArea";
import { ChatProvider } from "@/providers/chatProvider";

export default async function ChatChannel({
  params,
}: {
  params: Promise<{ channel: string }>;
}) {
  const { channel } = await params;
  return (
    <div className="min-h-screen max-w-2xl mx-auto px-4">
      <div className="block p-4 h-12">
        <a href="/" className="text-end hover:underline">
          {"< "}Back to Homepage
        </a>
      </div>
      <ChatProvider channel={channel}>
        <div className="bg-background shadow-md rounded-lg w-full max-w-3xl flex flex-col border h-[calc(100dvh-60px)]">
          <ChatHeader />
          <MessagesArea />
          <Composer />
        </div>
      </ChatProvider>
    </div>
  );
}
