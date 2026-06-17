import { ChatArea } from "@/components/chat/ChatArea";

export const ChatPage = () => {
  return (
    <div className="flex-1 flex flex-col min-h-0 bg-background overflow-hidden relative">
      <div className="flex-1 container max-w-6xl mx-auto py-4 h-full flex flex-col">
        <ChatArea />
      </div>
    </div>
  );
};

