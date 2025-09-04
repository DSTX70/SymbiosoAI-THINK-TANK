import { useState, useEffect, useRef } from "react";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Send, Users, MessageCircle, Volume2, VolumeX } from "lucide-react";
import { formatDistanceToNow } from "date-fns";

interface ChatMessage {
  id: string;
  sessionCode: string;
  userId: string;
  content: string;
  timestamp: Date;
  messageType: "chat" | "system" | "debate_update";
  userInfo?: {
    firstName?: string;
    lastName?: string;
    profileImageUrl?: string;
  };
}

interface LiveChatProps {
  sessionCode: string;
  isVisible: boolean;
  onToggle: () => void;
  participantCount?: number;
}

export function LiveChat({ sessionCode, isVisible, onToggle, participantCount = 0 }: LiveChatProps) {
  const { user, isAuthenticated } = useAuth();
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputValue, setInputValue] = useState("");
  const [isConnected, setIsConnected] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const wsRef = useRef<WebSocket | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    if (sessionCode && isAuthenticated) {
      // Connect to WebSocket for real-time updates
      const protocol = window.location.protocol === "https:" ? "wss:" : "ws:";
      const wsUrl = `${protocol}//${window.location.host}/ws`;
      const ws = new WebSocket(wsUrl);

      ws.onopen = () => {
        setIsConnected(true);
        // Join session channel
        ws.send(JSON.stringify({ 
          type: "join_session", 
          sessionCode,
          userId: user?.id 
        }));
      };

      ws.onmessage = (event) => {
        const data = JSON.parse(event.data);
        if (data.type === "chat_message" && data.sessionCode === sessionCode) {
          setMessages(prev => [...prev, data.message]);
          scrollToBottom();
        } else if (data.type === "participant_joined" || data.type === "participant_left") {
          if (data.sessionCode === sessionCode) {
            // Add system message for participant changes
            const systemMessage: ChatMessage = {
              id: Date.now().toString(),
              sessionCode,
              userId: "system",
              content: data.type === "participant_joined" 
                ? `${data.user.firstName || "Someone"} joined the session` 
                : `${data.user.firstName || "Someone"} left the session`,
              timestamp: new Date(),
              messageType: "system"
            };
            setMessages(prev => [...prev, systemMessage]);
            scrollToBottom();
          }
        }
      };

      ws.onclose = () => {
        setIsConnected(false);
      };

      wsRef.current = ws;

      // Load chat history
      fetch(`/api/sessions/code/${sessionCode}/chat`)
        .then(res => res.json())
        .then(data => {
          setMessages(data);
          scrollToBottom();
        })
        .catch(console.error);

      return () => {
        ws.close();
        wsRef.current = null;
      };
    }
  }, [sessionCode, isAuthenticated, user?.id]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const sendMessage = () => {
    if (!inputValue.trim() || !wsRef.current || !isConnected) return;

    const message = {
      type: "send_chat",
      sessionCode,
      userId: user?.id,
      content: inputValue.trim(),
      messageType: "chat"
    };

    wsRef.current.send(JSON.stringify(message));
    setInputValue("");
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const getUserInitials = (msg: ChatMessage) => {
    if (msg.userId === "system") return "S";
    const firstName = msg.userInfo?.firstName || "";
    const lastName = msg.userInfo?.lastName || "";
    return (firstName.charAt(0) + lastName.charAt(0)).toUpperCase() || "U";
  };

  const getDisplayName = (msg: ChatMessage) => {
    if (msg.userId === "system") return "System";
    const firstName = msg.userInfo?.firstName || "";
    const lastName = msg.userInfo?.lastName || "";
    if (firstName && lastName) return `${firstName} ${lastName}`;
    return msg.userInfo?.firstName || "Anonymous User";
  };

  if (!isVisible) {
    return (
      <Button
        onClick={onToggle}
        className="fixed bottom-6 right-6 rounded-full h-14 w-14 shadow-lg"
        data-testid="button-show-chat"
      >
        <MessageCircle className="h-6 w-6" />
      </Button>
    );
  }

  return (
    <div className="fixed bottom-6 right-6 w-80 h-96 bg-background border rounded-lg shadow-lg flex flex-col">
      {/* Chat Header */}
      <div className="flex items-center justify-between p-3 border-b">
        <div className="flex items-center gap-2">
          <MessageCircle className="h-4 w-4" />
          <span className="font-medium text-sm">Team Chat</span>
          {participantCount > 0 && (
            <Badge variant="secondary" className="text-xs">
              <Users className="h-3 w-3 mr-1" />
              {participantCount}
            </Badge>
          )}
        </div>
        <div className="flex items-center gap-1">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsMuted(!isMuted)}
            data-testid="button-toggle-sound"
          >
            {isMuted ? <VolumeX className="h-4 w-4" /> : <Volume2 className="h-4 w-4" />}
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={onToggle}
            data-testid="button-hide-chat"
          >
            ×
          </Button>
        </div>
      </div>

      {/* Connection Status */}
      {!isConnected && (
        <div className="px-3 py-2 bg-yellow-50 dark:bg-yellow-900/20 border-b">
          <p className="text-xs text-yellow-700 dark:text-yellow-300">
            Reconnecting to chat...
          </p>
        </div>
      )}

      {/* Messages Area */}
      <ScrollArea className="flex-1 p-3">
        <div className="space-y-3">
          {messages.map((message) => (
            <div key={message.id} className="flex items-start gap-2">
              <Avatar className="h-6 w-6 mt-1">
                <AvatarImage src={message.userInfo?.profileImageUrl} />
                <AvatarFallback className="text-xs">
                  {getUserInitials(message)}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-xs font-medium">
                    {getDisplayName(message)}
                  </span>
                  <span className="text-xs text-muted-foreground">
                    {formatDistanceToNow(new Date(message.timestamp), { addSuffix: true })}
                  </span>
                  {message.messageType !== "chat" && (
                    <Badge variant="outline" className="text-xs">
                      {message.messageType === "system" ? "System" : "Debate"}
                    </Badge>
                  )}
                </div>
                <p className={`text-sm ${
                  message.messageType === "system" 
                    ? "text-muted-foreground italic" 
                    : "text-foreground"
                }`}>
                  {message.content}
                </p>
              </div>
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>
      </ScrollArea>

      {/* Message Input */}
      {isAuthenticated && (
        <div className="p-3 border-t">
          <div className="flex gap-2">
            <Input
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyDown={handleKeyPress}
              placeholder="Type a message..."
              className="text-sm"
              disabled={!isConnected}
              data-testid="input-chat-message"
            />
            <Button
              onClick={sendMessage}
              disabled={!inputValue.trim() || !isConnected}
              size="sm"
              data-testid="button-send-message"
            >
              <Send className="h-4 w-4" />
            </Button>
          </div>
          {!isConnected && (
            <p className="text-xs text-red-500 mt-1">
              Chat is disconnected. Messages may not be sent.
            </p>
          )}
        </div>
      )}
    </div>
  );
}