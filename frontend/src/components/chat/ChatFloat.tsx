import { useState, useEffect } from "react";
import { chatApi } from "../../api/chatApi";
import useAuthStore from "../../stores/authStore";
import { useChatStomp } from "../../hooks/useChatStomp";
import { ChatHeader } from "./ChatParts";
import { ChatRoomList } from "./ChatRoomList";
import { ChatView } from "./ChatView";
import { ChatUserSearch } from "./ChatUserSearch";
import type { ChatRoom } from "../../types/chat.type";

const ChatFloat = () => {
  const { isLoggedIn, user } = useAuthStore();
  const [open, setOpen] = useState(false);
  const [view, setView] = useState<"list" | "chat" | "search">("list");
  const [rooms, setRooms] = useState<ChatRoom[]>([]);
  const [selectedRoom, setSelectedRoom] = useState<any>(null);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);

  const { messages, setMessages, connect, disconnect, sendMessage } =
    useChatStomp();

  useEffect(() => {
    if (open && isLoggedIn && view === "list") {
      chatApi
        .getRooms()
        .then((res) => setRooms(res.data))
        .catch(() => setRooms([]));
    }
  }, [open, isLoggedIn, view]);

  const handleRoomSelect = async (room: any) => {
    setSelectedRoom(room);
    setView("chat");
    setLoading(true);
    try {
      const res = await chatApi.getMessages(room.roomId);
      setMessages(res.data.reverse());
      connect(room.roomId, String(user?.userId), user?.nickName ?? "");
    } catch (err) {
      console.error("데이터 로드 실패", err);
    } finally {
      setLoading(false);
    }
  };

  const handleStartChat = async (targetUser: any) => {
    if (!user) return;
    try {
      setLoading(true);
      const res = await chatApi.getRoomId(
        String(user.userId),
        String(targetUser.userId),
      );

      const roomData = {
        roomId: res.data,
        partnerNickName: targetUser.nickName,
      };

      handleRoomSelect(roomData);
    } catch (err) {
      alert("채팅 연결에 실패했습니다");
    } finally {
      setLoading(false);
    }
  };

  const handleBack = () => {
    disconnect();
    setView("list");
    setSelectedRoom(null);
  };

  if (!isLoggedIn) return null;

  return (
    /* items-end: 내부의 모든 요소(채팅창, 버튼)를 오른쪽으로 밀착 정렬 */
    <div className="fixed bottom-8 right-8 z-[120] font-['Pretendard_Variable'] flex flex-col items-end gap-4">
      {open && (
        <div className="w-[380px] h-[600px] bg-white rounded-[3rem] shadow-2xl border border-slate-100 flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-300">
          <ChatHeader
            view={view}
            title={
              selectedRoom?.partnerNickName ||
              (view === "search" ? "유저 검색" : "메시지")
            }
            onBack={handleBack}
            onClose={() => {
              handleBack();
              setOpen(false);
            }}
            onSearch={() => setView("search")}
          />

          {view === "list" && (
            <ChatRoomList
              rooms={rooms}
              onSelect={handleRoomSelect}
              onStartSearch={() => setView("search")}
            />
          )}

          {view === "chat" && (
            <ChatView
              messages={messages}
              userId={user?.userId}
              input={input}
              setInput={setInput}
              onSend={() => {
                if (selectedRoom) {
                  sendMessage(selectedRoom.roomId, input);
                  setInput("");
                }
              }}
              loading={loading}
            />
          )}

          {view === "search" && (
            <ChatUserSearch onSelectUser={handleStartChat} />
          )}
        </div>
      )}

      {/* 버튼 텍스트 '채팅' 고정 및 디자인 유지 */}
      <button
        onClick={() => setOpen(!open)}
        className="w-20 h-20 rounded-[2.5rem] shadow-2xl flex items-center justify-center font-black transition-all duration-300 bg-slate-700 text-white hover:scale-105 active:scale-95"
      >
        채팅
      </button>
    </div>
  );
};

export default ChatFloat;
