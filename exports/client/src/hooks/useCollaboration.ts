import { useState, useEffect, useRef } from "react";
import { useAuth } from "@/hooks/useAuth";

interface CollaborationMessage {
  type: "join_session" | "leave_session" | "send_chat" | "sync_workspace" | "debate_update";
  sessionCode: string;
  userId?: string;
  content?: string;
  messageType?: string;
  action?: string;
  details?: string;
}

interface CollaborationHook {
  isConnected: boolean;
  sendMessage: (message: CollaborationMessage) => void;
  participantCount: number;
  lastActivity?: Date;
}

export function useCollaboration(sessionCode: string): CollaborationHook {
  const { user, isAuthenticated } = useAuth();
  const [isConnected, setIsConnected] = useState(false);
  const [participantCount, setParticipantCount] = useState(0);
  const [lastActivity, setLastActivity] = useState<Date>();
  const wsRef = useRef<WebSocket | null>(null);

  useEffect(() => {
    if (!sessionCode || !isAuthenticated) return;

    // Connect to WebSocket
    const protocol = window.location.protocol === "https:" ? "wss:" : "ws:";
    const wsUrl = `${protocol}//${window.location.host}/ws`;
    const ws = new WebSocket(wsUrl);

    ws.onopen = () => {
      setIsConnected(true);
      // Join collaboration session
      ws.send(JSON.stringify({
        type: "join_session",
        sessionCode,
        userId: user?.id
      }));
    };

    ws.onmessage = (event) => {
      const data = JSON.parse(event.data);
      
      if (data.sessionCode === sessionCode) {
        setLastActivity(new Date());
        
        if (data.type === "participant_count") {
          setParticipantCount(data.count || 0);
        }
      }
    };

    ws.onclose = () => {
      setIsConnected(false);
    };

    ws.onerror = () => {
      setIsConnected(false);
    };

    wsRef.current = ws;

    return () => {
      if (wsRef.current) {
        wsRef.current.close();
        wsRef.current = null;
      }
    };
  }, [sessionCode, isAuthenticated, user?.id]);

  const sendMessage = (message: CollaborationMessage) => {
    if (wsRef.current && isConnected) {
      wsRef.current.send(JSON.stringify(message));
    }
  };

  return {
    isConnected,
    sendMessage,
    participantCount,
    lastActivity
  };
}