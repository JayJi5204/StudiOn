import { useState } from "react";
import DirectChatTest from "../test/DirectChatTest";
import GroupChatTest from "../test/GroupChatTest";
import BoardTest from "../test/BoardTest";
import CommentTest from "../test/CommentTest";
import UserTest from "../test/UserTest";
import AlarmTest from "../test/AlarmTest";
import RoomTest from "../test/RoomTest";

const tests = [
  { key: "유저 테스트", label: "회원 관리", component: <UserTest /> },
  { key: "게시판 테스트", label: "게시판", component: <BoardTest /> },
  { key: "댓글 테스트", label: "댓글", component: <CommentTest /> },
  { key: "방 테스트", label: "방", component: <RoomTest /> },
  {
    key: "1대1 채팅 테스트",
    label: "1대1 채팅",
    component: <DirectChatTest />,
  },
  { key: "그룹 채팅 테스트", label: "그룹 채팅", component: <GroupChatTest /> },
  { key: "알림 테스트", label: "알림", component: <AlarmTest /> },
];

function TestPage() {
  const [selected, setSelected] = useState<string | null>(null);

  return (
    <div className="p-6 max-w-5xl mx-auto">
      <h1 className="text-xl font-medium mb-6">테스트 페이지</h1>
      <div className="flex flex-wrap gap-2 mb-8">
        {/* flex-wrap 추가로 줄바꿈 대응 */}
        {tests.map((t) => (
          <button
            key={t.key}
            className={`px-4 py-2 rounded-lg border text-sm font-medium transition-all
        ${
          selected === t.key
            ? "bg-blue-600 text-white border-blue-600 shadow-md"
            : "bg-white hover:bg-gray-50 border-gray-300 text-gray-700"
        }`}
            onClick={() => setSelected(selected === t.key ? null : t.key)}
          >
            {t.key}
          </button>
        ))}
      </div>
      {selected ? (
        <div>
          <div className="text-sm text-gray-500 mb-4">
            {tests.find((t) => t.key === selected)?.label}
          </div>
          {tests.find((t) => t.key === selected)?.component}
        </div>
      ) : (
        <div className="text-gray-400 text-sm">
          숫자를 눌러 테스트를 선택하세요
        </div>
      )}
    </div>
  );
}

export default TestPage;
