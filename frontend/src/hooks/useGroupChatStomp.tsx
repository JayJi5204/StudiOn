import { useRef, useState, useCallback } from "react";
import { Client } from "@stomp/stompjs";
import type { ChatMessage } from "../types/chat.type";

export const useChatStomp = () => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const stompRef = useRef<Client | null>(null);

  const connect = useCallback((roomId: string) => {
    const client = new Client({
      brokerURL: `ws://${window.location.host}/ws/chat`,
      onConnect: () => {
        // 채팅방 구독
        client.subscribe(`/topic/chat/${roomId}`, (msg) => {
          const data: ChatMessage = JSON.parse(msg.body);
          setMessages((prev) => [...prev, data]);
        });
        // 입장 알림
        client.publish({
          destination: "/app/chat/enter",
          body: JSON.stringify({ roomId }),
        });
      },
    });
    client.activate();
    stompRef.current = client;
  }, []);

  const disconnect = useCallback(() => {
    if (stompRef.current) {
      stompRef.current.deactivate();
      stompRef.current = null;
    }
  }, []);

  const sendMessage = useCallback((roomId: string, message: string) => {
    if (!message.trim() || !stompRef.current) return;
    stompRef.current.publish({
      destination: "/app/chat/message",
      body: JSON.stringify({ roomId, message }),
    });
  }, []);

  return { messages, setMessages, connect, disconnect, sendMessage };
};
