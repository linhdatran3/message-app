import { ChatHeader } from "@/components/chatHeader";
import { Composer } from "@/components/composer";
import { MessagesArea } from "@/components/messageArea";
import { ChatProvider } from "@/providers/chatProvider";

export default async function ChatChannel({
  params,
}: {
  params: Promise<{ channel: string }>;
}) {
  const { channel } = await params;
  return (
    <div className="min-h-screen max-w-2xl mx-auto">
      <div className="block pt-20 pb-4">
        <a href="/" className="text-end hover:underline">
          {"< "}Back to Homepage
        </a>
      </div>
      <ChatProvider channel={channel}>
        <div className="bg-background border flex items-center justify-center p-4">
          <div className="bg-background shadow-md rounded-2xl w-full max-w-3xl flex flex-col h-[80vh]">
            <ChatHeader />
            <MessagesArea />
            <Composer />
          </div>
        </div>
      </ChatProvider>
    </div>
  );
}
