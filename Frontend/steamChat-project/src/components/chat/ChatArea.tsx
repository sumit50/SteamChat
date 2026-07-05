import { useEffect, useState, useRef } from "react";
import { socket } from "@/socket";
import { Send, Smile, Paperclip, Users, Circle } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { authStorage } from "../../auth/authUtils";

interface Message {
  message: string;
  time: Date;
  self?: boolean;
  senderName?: string;
  senderUserName?: string;
  senderAvatar?: string;
  isSystem?: boolean;
}

export const ChatArea = () => {
  const [chatId] = useState("room1");
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState<Message[]>([]);
  const [typingUser, setTypingUser] = useState<string | null>(null);
  const [activeUsers, setActiveUsers] = useState<any[]>([]);
  const bottomRef = useRef<HTMLDivElement>(null);

  // Synchronously grab user details from storage on initial render
  const [currentUser] = useState<any>(() => {
    return authStorage.getUser();
  });

  useEffect(() => {
    // Join the room with user metadata
    socket.emit("join", { chatId, user: currentUser });

    // Listen for incoming messages (system or user-sent)
    socket.on("receiveMessage", (data: Message) => {
      setMessages((prev) => [...prev, data]);
    });

    // Listen for typing events specifying the username
    socket.on("typing", (userName: string) => {
      setTypingUser(userName);
    });

    // Listen for the active online users list inside the room
    socket.on("activeUsers", (users: any[]) => {
      setActiveUsers(users);
    });

    return () => {
      socket.off("receiveMessage");
      socket.off("typing");
      socket.off("activeUsers");
    };
  }, [chatId, currentUser]);

  // Clean up typing indicator timer when a new typing signal comes in
  useEffect(() => {
    if (!typingUser) return;
    const timer = setTimeout(() => {
      setTypingUser(null);
    }, 2000);
    return () => clearTimeout(timer);
  }, [typingUser]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const sendMessage = () => {
    if (!message.trim()) return;

    // Send to backend with active room, message text, and sender user object
    socket.emit("sendMessage", { chatId, message, user: currentUser });

    // Local Echo: immediately show on self right side
    setMessages((prev) => [
      ...prev,
      {
        message,
        time: new Date(),
        self: true,
        senderName: currentUser?.name,
        senderUserName: currentUser?.userName,
      },
    ]);

    setMessage("");
  };

  const handleTyping = () => {
    socket.emit("typing", { chatId, userName: currentUser?.userName || "Someone" });
  };

  return (
    <div className="flex flex-col h-full bg-background border border-border rounded-2xl shadow-xl overflow-hidden mx-4 my-2">
      {/* Chat header */}
      <div className="p-4 border-b bg-muted/20 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold">
            S
          </div>
          <div>
            <h2 className="font-semibold text-foreground">Steam Chat Room</h2>
            <p className="text-xs text-muted-foreground flex items-center gap-1.5">
              <Circle className="w-2 h-2 fill-emerald-500 stroke-emerald-500 animate-pulse" />
              <span>{activeUsers.length} online</span>
            </p>
          </div>
        </div>

        {/* List of online user bubbles in the header */}
        <div className="flex items-center gap-1">
          <div className="hidden sm:flex -space-x-2 mr-2">
            {activeUsers.slice(0, 4).map((user, i) => (
              <div
                key={user._id || i}
                title={user.userName}
                className="w-7 h-7 rounded-full bg-muted border-2 border-background flex items-center justify-center text-[10px] font-bold text-foreground"
              >
                {user.name ? user.name[0].toUpperCase() : user.userName[0].toUpperCase()}
              </div>
            ))}
            {activeUsers.length > 4 && (
              <div className="w-7 h-7 rounded-full bg-primary/15 border-2 border-background flex items-center justify-center text-[10px] font-bold text-primary">
                +{activeUsers.length - 4}
              </div>
            )}
          </div>
          <Users className="h-5 w-5 text-muted-foreground" />
        </div>
      </div>

      {/* Messages area */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((msg, i) => {
          // Render system messages beautifully centered
          if (msg.isSystem) {
            return (
              <div key={i} className="flex justify-center my-2">
                <span className="bg-muted px-3 py-1 rounded-full text-xs text-muted-foreground border border-border/50">
                  {msg.message}
                </span>
              </div>
            );
          }

          return (
            <div
              key={i}
              className={`flex flex-col ${msg.self ? "items-end" : "items-start"}`}
            >
              {/* Show sender username for others */}
              {!msg.self && (
                <span className="text-[11px] text-muted-foreground mb-1 ml-2">
                  {msg.senderName || msg.senderUserName || "Unknown"}
                </span>
              )}

              <div
                className={`max-w-[85%] sm:max-w-[70%] px-4 py-2.5 rounded-2xl shadow-sm text-sm ${
                  msg.self
                    ? "bg-primary text-primary-foreground rounded-br-none"
                    : "bg-muted text-foreground rounded-bl-none border border-border"
                }`}
              >
                {msg.message}
                <div className="text-[10px] mt-1 opacity-70 text-right">
                  {new Date(msg.time).toLocaleTimeString([], {
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </div>
              </div>
            </div>
          );
        })}

        {/* Enhanced typing indicator */}
        {typingUser && (
          <div className="flex items-center gap-2 text-muted-foreground text-xs italic ml-2">
            <div className="flex gap-1 shrink-0">
              <span className="w-1.5 h-1.5 bg-muted-foreground/60 rounded-full animate-bounce delay-75"></span>
              <span className="w-1.5 h-1.5 bg-muted-foreground/60 rounded-full animate-bounce delay-150"></span>
              <span className="w-1.5 h-1.5 bg-muted-foreground/60 rounded-full animate-bounce delay-300"></span>
            </div>
            <span>{typingUser} is typing...</span>
          </div>
        )}
        <div ref={bottomRef} />
      </div>

      {/* Input area */}
      <div className="p-4 border-t bg-background">
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="icon" className="shrink-0 text-muted-foreground">
            <Paperclip className="h-5 w-5" />
          </Button>
          <div className="relative flex-1">
            <Input
              value={message}
              onChange={(e) => {
                setMessage(e.target.value);
                handleTyping();
              }}
              onKeyDown={(e) => {
                if (e.key === "Enter") sendMessage();
              }}
              placeholder="Type your message..."
              className="pr-10 bg-muted/40 border-border focus-visible:ring-1 focus-visible:ring-primary/20 h-11"
            />
            <Button
              type="button"
              variant="ghost"
              size="icon"
              className="absolute right-0 top-0 h-full text-muted-foreground hover:text-primary transition-colors"
            >
              <Smile className="h-5 w-5" />
            </Button>
          </div>
          <Button onClick={sendMessage} className="shrink-0 gap-2 h-11 px-5 shadow-lg shadow-primary/10">
            <Send className="h-4 w-4" />
            <span className="hidden sm:inline">Send</span>
          </Button>
        </div>
      </div>
    </div>
  );
};