import { useState, useEffect } from "react";
import { chatApi } from "../../api/chatApi";

interface User {
  userId: string;
  nickName: string;
}

interface ChatUserSearchProps {
  onSelectUser: (user: User) => void;
}

export const ChatUserSearch = ({ onSelectUser }: ChatUserSearchProps) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [searchResults, setSearchResults] = useState<User[]>([]);
  const [isSearching, setIsSearching] = useState(false);

  useEffect(() => {
    const delayDebounceFn = setTimeout(async () => {
      if (searchTerm.trim().length < 2) {
        setSearchResults([]);
        return;
      }

      setIsSearching(true);
      try {
        const res = await chatApi.searchUsers(searchTerm);
        // 백엔드 응답 구조가 res.data.users 등일 경우 그에 맞춰 수정 필요
        setSearchResults(res.data);
      } catch (error) {
        console.error("유저 검색 실패", error);
        setSearchResults([]);
      } finally {
        setIsSearching(false);
      }
    }, 500);

    return () => clearTimeout(delayDebounceFn);
  }, [searchTerm]);

  return (
    <div className="flex-1 flex flex-col overflow-hidden bg-slate-50">
      <div className="p-6 bg-white border-b border-slate-100">
        <div className="relative">
          <input
            type="text"
            placeholder="닉네임으로 검색 (2글자 이상)"
            className="w-full bg-slate-100 border-none rounded-2xl py-4 px-6 text-sm focus:ring-2 focus:ring-slate-200 transition-all text-slate-700 font-bold"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            autoFocus
          />
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-3">
        {isSearching ? (
          <div className="text-center py-10 text-slate-400 text-[12px] font-black animate-pulse">
            검색 중입니다
          </div>
        ) : searchResults.length > 0 ? (
          searchResults.map((user) => (
            <button
              key={user.userId}
              onClick={() => onSelectUser(user)}
              className="w-full flex items-center gap-4 p-4 bg-white rounded-[2rem] shadow-sm hover:shadow-md hover:bg-slate-50 transition-all group"
            >
              <div className="w-12 h-12 bg-indigo-50 rounded-full flex items-center justify-center font-black text-indigo-400">
                {user.nickName[0]}
              </div>
              <div className="flex-1 text-left">
                <div className="font-bold text-slate-700">{user.nickName}</div>
                <div className="text-[10px] font-black text-slate-400 uppercase tracking-tighter">
                  대화 시작하기
                </div>
              </div>
              <div className="px-3 py-1 bg-slate-700 text-white text-[10px] font-black rounded-full opacity-0 group-hover:opacity-100 transition-all">
                선택
              </div>
            </button>
          ))
        ) : (
          <div className="mt-20 text-center space-y-2">
            <p className="text-sm font-bold text-slate-300 whitespace-pre-wrap">
              {searchTerm
                ? "검색 결과가 없습니다"
                : "검색어를 입력하여\n대화 상대를 찾아보세요"}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};
