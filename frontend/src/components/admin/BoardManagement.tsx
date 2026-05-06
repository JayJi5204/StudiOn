import { useEffect, useState } from "react";
import { boardApi } from "../../api/boardApi";

const BoardManagement = () => {
  const [boards, setBoards] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchInput, setSearchInput] = useState("");
  const [keyword, setKeyword] = useState("");

  const fetchBoards = async () => {
    setLoading(true);
    try {
      const res = await boardApi.getBoards(
        0,
        100,
        undefined,
        keyword || undefined,
      );
      setBoards(res.data.content || []);
    } catch (error) {
      console.error("게시글 로드 실패:", error);
      setBoards([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBoards();
  }, [keyword]);

  const handleDelete = async (boardId: string) => {
    if (!confirm("해당 게시글을 삭제하시겠습니까?")) return;
    try {
      await boardApi.forceDeleteBoard(boardId);
      setBoards((prev) => prev.filter((b) => b.boardId !== boardId));
    } catch {
      alert("게시글 삭제에 실패했습니다.");
    }
  };

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
      {/* ✅ 검색바: BoardListPage와 통일된 디자인 */}
      <div className="flex items-center gap-3 mb-12">
        <input
          type="text"
          value={searchInput}
          onChange={(e) => setSearchInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && setKeyword(searchInput)}
          placeholder="검색할 게시글 제목이나 작성자를 입력하세요"
          className="flex-1 bg-white border-2 border-slate-900 rounded-2xl px-6 py-4 font-bold text-slate-800 transition-all outline-none focus:bg-slate-50 focus:shadow-[4px_4px_0px_0px_rgba(15,23,42,1)]"
        />
        <button
          onClick={() => setKeyword(searchInput)}
          className="px-10 py-4 bg-slate-900 text-white rounded-2xl text-sm font-black hover:bg-black transition-all shadow-lg shadow-slate-200 active:scale-95"
        >
          검색
        </button>
        {keyword && (
          <button
            onClick={() => {
              setKeyword("");
              setSearchInput("");
            }}
            className="px-8 py-4 bg-white border-2 border-slate-900 text-slate-900 rounded-2xl text-sm font-black transition-all hover:bg-slate-900 hover:text-white"
          >
            초기화
          </button>
        )}
      </div>

      {/* ✅ 테이블 영역 */}
      <div className="bg-transparent overflow-hidden">
        <div className="grid grid-cols-12 px-8 py-4 bg-slate-50/80 rounded-xl mb-4">
          <span className="col-span-6 text-[10px] font-black text-slate-400 uppercase tracking-widest">
            게시글 정보
          </span>
          <span className="col-span-2 text-center text-[10px] font-black text-slate-400 uppercase tracking-widest">
            카테고리
          </span>
          <span className="col-span-3 text-center text-[10px] font-black text-slate-400 uppercase tracking-widest">
            작성일
          </span>
          <span className="col-span-1 text-right text-[10px] font-black text-slate-400 uppercase tracking-widest">
            관리
          </span>
        </div>

        <div className="divide-y divide-slate-100">
          {loading ? (
            <div className="py-24 flex justify-center">
              <div className="w-6 h-6 border-2 border-slate-900 border-t-transparent rounded-full animate-spin" />
            </div>
          ) : boards.length === 0 ? (
            <div className="py-24 text-center text-[11px] font-black text-slate-300 uppercase tracking-widest">
              검색 결과가 없거나 게시글이 존재하지 않습니다.
            </div>
          ) : (
            boards.map((b) => (
              <div
                key={b.boardId}
                className="grid grid-cols-12 px-8 py-6 items-center hover:bg-slate-50/50 transition-colors rounded-xl"
              >
                <div className="col-span-6 flex flex-col gap-0.5">
                  <span className="text-sm font-bold text-slate-900 truncate pr-8">
                    {b.title}
                  </span>
                  <span className="text-[11px] text-slate-400 font-medium">
                    작성자: {b.nickName}
                  </span>
                </div>
                <div className="col-span-2 flex justify-center">
                  <span className="text-[10px] px-2.5 py-1 rounded-md font-bold bg-slate-50 text-slate-500 uppercase tracking-tighter">
                    {b.boardCategory}
                  </span>
                </div>
                <span className="col-span-3 text-center text-xs font-semibold text-slate-500">
                  {new Date(b.createdAt).toLocaleDateString()}
                </span>
                <div className="col-span-1 flex justify-end">
                  <button
                    onClick={() => handleDelete(b.boardId)}
                    className="text-slate-300 hover:text-red-500 transition-colors p-2"
                  >
                    <svg
                      className="w-5 h-5"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2.5"
                        d="M6 18L18 6M6 6l12 12"
                      />
                    </svg>
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default BoardManagement;
