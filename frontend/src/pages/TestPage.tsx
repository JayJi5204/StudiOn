import { useState } from "react";
import DirectChatTest from "../test/DirectChatTest";
import GroupChatTest from "../test/GroupChatTest";
import BoardTest from "../test/BoardTest";
import CommentTest from "../test/CommentTest";
import UserTest from "../test/UserTest";
const tests = [
  { key: "유저 테스트", label: "회원 관리", component: <UserTest /> },
  { key: "게시판 테스트", label: "게시판", component: <BoardTest /> },
  { key: "댓글 테스트", label: "댓글", component: <CommentTest /> },
  {
    key: "1대1 채팅 테스트",
    label: "1대1 채팅",
    component: <DirectChatTest />,
  },
  { key: "그룹 채팅 테스트", label: "그룹 채팅", component: <GroupChatTest /> },
];

function TestPage() {
  const [selected, setSelected] = useState<string | null>(null);

  return (
    <div className="p-6 max-w-5xl mx-auto">
      <h1 className="text-xl font-medium mb-6">테스트 페이지</h1>
      <div className="flex gap-3 mb-8">
        {tests.map((t) => (
          <button
            key={t.key}
            className={`w-12 h-12 rounded-full border text-lg font-medium transition-colors
              ${
                selected === t.key
                  ? "bg-blue-600 text-white border-blue-600"
                  : "hover:bg-gray-50 border-gray-300"
              }`}
            onClick={() => setSelected(selected === t.key ? null : t.key)}
            title={t.label}
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
