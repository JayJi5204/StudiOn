import { useState, useRef } from "react";
import { Client } from "@stomp/stompjs";
import { MessageBox, SendBox } from "./ChatComponents";

interface Message {
  userId: string;
  nickName: string;
  message: string;
  sendAt: string;
}

export default function DirectChatTest() {
  const [user1Connected, setUser1Connected] = useState(false);
  const [user2Connected, setUser2Connected] = useState(false);
  const [roomId, setRoomId] = useState("");
  const [messages1, setMessages1] = useState<Message[]>([]);
  const [messages2, setMessages2] = useState<Message[]>([]);
  const [msg1, setMsg1] = useState("");
  const [msg2, setMsg2] = useState("");
  const [user1Id, setUser1Id] = useState("1");
  const [user1Nick, setUser1Nick] = useState("홍길동");
  const [user2Id, setUser2Id] = useState("2");
  const [user2Nick, setUser2Nick] = useState("김철수");
  const client1 = useRef<Client | null>(null);
  const client2 = useRef<Client | null>(null);

  const addSystemMsg = (
    setMessages: React.Dispatch<React.SetStateAction<Message[]>>,
    text: string,
  ) => {
    setMessages((prev) => [
      ...prev,
      {
        userId: "system",
        nickName: "system",
        message: text,
        sendAt: new Date().toISOString(),
      },
    ]);
  };

  const generateRoomId = () => {
    const id1 = parseInt(user1Id);
    const id2 = parseInt(user2Id);
    setRoomId(`${Math.min(id1, id2)}:${Math.max(id1, id2)}`);
  };

  const connect = (userNum: number) => {
    const userId = userNum === 1 ? user1Id : user2Id;
    const nickName = userNum === 1 ? user1Nick : user2Nick;
    const setConnected = userNum === 1 ? setUser1Connected : setUser2Connected;
    const setMessages = userNum === 1 ? setMessages1 : setMessages2;
    const clientRef = userNum === 1 ? client1 : client2;

    const client = new Client({
      brokerURL: `ws://${window.location.host}/ws/chat`,
      connectHeaders: { userId, nickName },
      onConnect: () => {
        setConnected(true);
        addSystemMsg(setMessages, "서버에 연결되었습니다");
      },
      onDisconnect: () => {
        setConnected(false);
        addSystemMsg(setMessages, "연결이 끊어졌습니다");
      },
      onStompError: (frame) => {
        addSystemMsg(setMessages, `오류: ${frame.headers.message}`);
      },
    });
    client.activate();
    clientRef.current = client;
  };

  const disconnect = (userNum: number) => {
    const clientRef = userNum === 1 ? client1 : client2;
    const setConnected = userNum === 1 ? setUser1Connected : setUser2Connected;
    const setMessages = userNum === 1 ? setMessages1 : setMessages2;
    clientRef.current?.deactivate();
    clientRef.current = null;
    setConnected(false);
    addSystemMsg(setMessages, "연결을 해제했습니다");
  };

  const enter = (userNum: number) => {
    if (!roomId) return alert("채팅방 ID를 먼저 생성하세요");
    const clientRef = userNum === 1 ? client1 : client2;
    const setMessages = userNum === 1 ? setMessages1 : setMessages2;
    const myUserId = userNum === 1 ? user1Id : user2Id;
    if (!clientRef.current) return;

    clientRef.current.subscribe(`/sub/chat/${roomId}`, (msg) => {
      const data: Message = JSON.parse(msg.body);
      setMessages((prev) => [
        ...prev,
        { ...data, userId: data.userId === myUserId ? "me" : data.userId },
      ]);
    });
    clientRef.current.publish({
      destination: "/pub/chat/enter",
      body: JSON.stringify({ roomId }),
    });
    addSystemMsg(setMessages, `채팅방 [${roomId}] 에 입장했습니다`);
  };

  const sendMsg = (userNum: number) => {
    if (!roomId) return alert("채팅방에 먼저 입장하세요");
    const clientRef = userNum === 1 ? client1 : client2;
    const msg = userNum === 1 ? msg1 : msg2;
    const setMsg = userNum === 1 ? setMsg1 : setMsg2;
    if (!msg.trim()) return;
    clientRef.current?.publish({
      destination: "/pub/chat/message",
      body: JSON.stringify({ roomId, message: msg }),
    });
    setMsg("");
  };

  const renderUserBox = (
    u: number,
    connected: boolean,
    messages: Message[],
    msg: string,
    setMsg: React.Dispatch<React.SetStateAction<string>>,
    nick: string,
    setNick: React.Dispatch<React.SetStateAction<string>>,
    onConnect: () => void,
    onDisconnect: () => void,
    onEnter: () => void,
    onSend: () => void,
  ) => (
    <div key={u} className="border rounded-xl p-4">
      <div className="text-sm font-medium mb-3 pb-2 border-b">유저 {u}</div>
      <div className="space-y-2 mb-3">
        <label className="text-xs text-gray-500">nickName</label>
        <input
          className="border rounded px-2 py-1 w-full text-sm mt-1"
          value={nick}
          onChange={(e) => setNick(e.target.value)}
        />
      </div>
      <div
        className={`text-xs px-2 py-1 rounded mb-2 ${connected ? "bg-green-50 text-green-700" : "bg-red-50 text-red-700"}`}
      >
        {connected ? "연결됨" : "연결 안됨"}
      </div>
      <div className="space-y-1 mb-2">
        {!connected ? (
          <button
            className="w-full border rounded px-3 py-1.5 text-sm hover:bg-gray-50 text-blue-600 border-blue-200"
            onClick={onConnect}
          >
            연결
          </button>
        ) : (
          <button
            className="w-full border rounded px-3 py-1.5 text-sm hover:bg-gray-50 text-red-600 border-red-200"
            onClick={onDisconnect}
          >
            연결 해제
          </button>
        )}
        <button
          className="w-full border rounded px-3 py-1.5 text-sm hover:bg-gray-50"
          onClick={onEnter}
          disabled={!connected}
        >
          채팅방 입장
        </button>
      </div>
      <MessageBox messages={messages} />
      <SendBox
        msg={msg}
        setMsg={setMsg}
        onSend={onSend}
        connected={connected}
      />
    </div>
  );

  return (
    <div>
      <div className="flex gap-3 mb-6 items-center">
        <input
          className="border rounded px-3 py-2 w-28 text-sm"
          value={user1Id}
          onChange={(e) => setUser1Id(e.target.value)}
          placeholder="유저1 ID"
        />
        <input
          className="border rounded px-3 py-2 w-28 text-sm"
          value={user2Id}
          onChange={(e) => setUser2Id(e.target.value)}
          placeholder="유저2 ID"
        />
        <button
          className="border rounded px-4 py-2 text-sm hover:bg-gray-50"
          onClick={generateRoomId}
        >
          채팅방 ID 생성
        </button>
        {roomId && (
          <span className="text-sm text-green-700 bg-green-50 px-3 py-2 rounded">
            채팅방 ID: {roomId}
          </span>
        )}
      </div>
      <div className="grid grid-cols-2 gap-4">
        {renderUserBox(
          1,
          user1Connected,
          messages1,
          msg1,
          setMsg1,
          user1Nick,
          setUser1Nick,
          () => connect(1),
          () => disconnect(1),
          () => enter(1),
          () => sendMsg(1),
        )}
        {renderUserBox(
          2,
          user2Connected,
          messages2,
          msg2,
          setMsg2,
          user2Nick,
          setUser2Nick,
          () => connect(2),
          () => disconnect(2),
          () => enter(2),
          () => sendMsg(2),
        )}
      </div>
    </div>
  );
}
