import { useRef, useState, useCallback } from "react";
import { Client } from "@stomp/stompjs";
import type { ChatMessage } from "../types/chat.type";

export const useChatStomp = () => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const stompRef = useRef<Client | null>(null);

  const connect = useCallback(
    (roomId: string, userId: string, nickName: string) => {
      const client = new Client({
        brokerURL: `ws://${window.location.host}/ws/chat`,
        connectHeaders: {
          userId,
          nickName,
        },
        onConnect: () => {
          client.subscribe(`/sub/chat/${roomId}`, (msg) => {
            const data: ChatMessage = JSON.parse(msg.body);
            setMessages((prev) => [...prev, data]);
          });
          client.publish({
            destination: "/pub/chat/enter",
            body: JSON.stringify({ roomId }),
          });
        },
      });
      client.activate();
      stompRef.current = client;
    },
    [],
  );

  const disconnect = useCallback(() => {
    if (stompRef.current) {
      stompRef.current.deactivate();
      stompRef.current = null;
    }
  }, []);

  const sendMessage = useCallback((roomId: string, message: string) => {
    if (!message.trim() || !stompRef.current) return;
    stompRef.current.publish({
      destination: "/pub/chat/message",
      body: JSON.stringify({ roomId, message }),
    });
  }, []);

  return { messages, setMessages, connect, disconnect, sendMessage };
};
