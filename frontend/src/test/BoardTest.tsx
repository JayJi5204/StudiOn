import { useState } from "react";
import axios from "axios";

interface CreateResponse {
  boardId: string;
  title: string;
  content: string;
}

interface GetWithCommentResponse {
  boardId: string;
  title: string;
  content: string;
  category: string;
  likeCount: number;
  isLiked: boolean;
  comments: any[];
}

interface PageResponse {
  boardId: string;
  title: string;
  category: string;
  likeCount: number;
  commentCount: number;
}

interface GetBoardResponse {
  boardId: string;
  title: string;
  content: string;
  category: string;
}

interface LikeResponse {
  likeCount: number;
  isLiked: boolean;
}

type Tab =
  | "create"
  | "getOne"
  | "getPage"
  | "getByUser"
  | "update"
  | "delete"
  | "like";

function BoardTest() {
  const [tab, setTab] = useState<Tab>("create");
  const [log, setLog] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);

  // create
  const [createTitle, setCreateTitle] = useState("");
  const [createContent, setCreateContent] = useState("");
  const [createCategory, setCreateCategory] = useState("COMMUNITY");

  // getOne
  const [getBoardId, setGetBoardId] = useState("");
  const [boardDetail, setBoardDetail] = useState<GetWithCommentResponse | null>(
    null,
  );

  // getPage
  const [pageCategory, setPageCategory] = useState("");
  const [page, setPage] = useState("1");
  const [size, setSize] = useState("10");
  const [pageResult, setPageResult] = useState<PageResponse[]>([]);

  // getByUser
  const [byUserUserId, setByUserUserId] = useState("");
  const [userBoards, setUserBoards] = useState<GetBoardResponse[]>([]);

  // update
  const [updateBoardId, setUpdateBoardId] = useState("");
  const [updateTitle, setUpdateTitle] = useState("");
  const [updateContent, setUpdateContent] = useState("");

  // delete
  const [deleteBoardId, setDeleteBoardId] = useState("");

  // like
  const [likeBoardId, setLikeBoardId] = useState("");
  const [likeStatus, setLikeStatus] = useState<LikeResponse | null>(null);

  const addLog = (msg: string) =>
    setLog((prev) => [`[${new Date().toLocaleTimeString()}] ${msg}`, ...prev]);

  const handleCreate = async () => {
    if (!createTitle || !createContent)
      return alert("제목과 내용을 입력하세요");
    setLoading(true);
    try {
      const res = await axios.post<CreateResponse>(
        "/api/boards/create",
        {
          title: createTitle,
          content: createContent,
          category: createCategory,
        },
        { withCredentials: true },
      );
      addLog(`게시글 작성 성공 → boardId: ${res.data.boardId}`);
      setCreateTitle("");
      setCreateContent("");
    } catch (e: any) {
      addLog(`게시글 작성 실패 → ${e.response?.data?.message ?? e.message}`);
    } finally {
      setLoading(false);
    }
  };

  const handleGetOne = async () => {
    if (!getBoardId) return alert("boardId를 입력하세요");
    setLoading(true);
    try {
      const res = await axios.get<GetWithCommentResponse>(
        `/api/boards/get/${getBoardId}`,
        { withCredentials: true },
      );
      setBoardDetail(res.data);
      addLog(`게시글 상세 조회 성공 → ${res.data.title}`);
    } catch (e: any) {
      addLog(
        `게시글 상세 조회 실패 → ${e.response?.data?.message ?? e.message}`,
      );
    } finally {
      setLoading(false);
    }
  };

  const handleGetPage = async () => {
    setLoading(true);
    try {
      const res = await axios.get("/api/boards/", {
        params: {
          category: pageCategory || undefined,
          page: Number(page),
          size: Number(size),
        },
        withCredentials: true,
      });
      setPageResult(res.data.content ?? res.data);
      addLog(
        `게시글 목록 조회 성공 → ${(res.data.content ?? res.data).length}개`,
      );
    } catch (e: any) {
      addLog(
        `게시글 목록 조회 실패 → ${e.response?.data?.message ?? e.message}`,
      );
    } finally {
      setLoading(false);
    }
  };

  const handleGetByUser = async () => {
    if (!byUserUserId) return alert("userId를 입력하세요");
    setLoading(true);
    try {
      const res = await axios.get<GetBoardResponse[]>(
        `/api/boards/users/${byUserUserId}`,
        { withCredentials: true },
      );
      setUserBoards(res.data);
      addLog(`사용자 게시글 조회 성공 → ${res.data.length}개`);
    } catch (e: any) {
      addLog(
        `사용자 게시글 조회 실패 → ${e.response?.data?.message ?? e.message}`,
      );
    } finally {
      setLoading(false);
    }
  };

  const handleUpdate = async () => {
    if (!updateBoardId) return alert("boardId를 입력하세요");
    setLoading(true);
    try {
      const res = await axios.put(
        `/api/boards/update/${updateBoardId}`,
        {
          title: updateTitle || undefined,
          content: updateContent || undefined,
        },
        { withCredentials: true },
      );
      addLog(`게시글 수정 성공 → ${JSON.stringify(res.data)}`);
    } catch (e: any) {
      addLog(`게시글 수정 실패 → ${e.response?.data?.message ?? e.message}`);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!deleteBoardId) return alert("boardId를 입력하세요");
    if (!window.confirm("정말 삭제하시겠습니까?")) return;
    setLoading(true);
    try {
      const res = await axios.delete(`/api/boards/delete/${deleteBoardId}`, {
        withCredentials: true,
      });
      addLog(`게시글 삭제 성공 → ${JSON.stringify(res.data)}`);
    } catch (e: any) {
      addLog(`게시글 삭제 실패 → ${e.response?.data?.message ?? e.message}`);
    } finally {
      setLoading(false);
    }
  };

  const handleLike = async () => {
    if (!likeBoardId) return alert("boardId를 입력하세요");
    setLoading(true);
    try {
      const res = await axios.post<LikeResponse>(
        `/api/boards/like/${likeBoardId}`,
        {},
        { withCredentials: true },
      );
      setLikeStatus(res.data);
      addLog(`좋아요 성공 → likeCount: ${res.data.likeCount}`);
    } catch (e: any) {
      addLog(`좋아요 실패 → ${e.response?.data?.message ?? e.message}`);
    } finally {
      setLoading(false);
    }
  };

  const handleUnlike = async () => {
    if (!likeBoardId) return alert("boardId를 입력하세요");
    setLoading(true);
    try {
      const res = await axios.delete<LikeResponse>(
        `/api/boards/like/${likeBoardId}`,
        { withCredentials: true },
      );
      setLikeStatus(res.data);
      addLog(`좋아요 취소 성공 → likeCount: ${res.data.likeCount}`);
    } catch (e: any) {
      addLog(`좋아요 취소 실패 → ${e.response?.data?.message ?? e.message}`);
    } finally {
      setLoading(false);
    }
  };

  const tabs: { key: Tab; label: string }[] = [
    { key: "create", label: "작성" },
    { key: "getOne", label: "상세 조회" },
    { key: "getPage", label: "목록 조회" },
    { key: "getByUser", label: "사용자별 조회" },
    { key: "update", label: "수정" },
    { key: "delete", label: "삭제" },
    { key: "like", label: "좋아요" },
  ];

  const categories = ["COMMUNITY", "NOTICE"];

  return (
    <div className="space-y-5">
      {/* 탭 */}
      <div className="flex gap-2 flex-wrap">
        {tabs.map((t) => (
          <button
            key={t.key}
            onClick={() => setTab(t.key)}
            className={`px-3 py-1.5 rounded text-sm font-medium transition-colors
              ${
                tab === t.key
                  ? "bg-blue-600 text-white"
                  : "border border-gray-300 hover:bg-gray-50"
              }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      {/* 작성 */}
      {tab === "create" && (
        <div className="space-y-3">
          <select
            value={createCategory}
            onChange={(e) => setCreateCategory(e.target.value)}
            className="border border-gray-300 rounded px-3 py-2 text-sm w-full"
          >
            {categories.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
          <input
            type="text"
            placeholder="제목"
            value={createTitle}
            onChange={(e) => setCreateTitle(e.target.value)}
            className="border border-gray-300 rounded px-3 py-2 text-sm w-full"
          />
          <textarea
            placeholder="내용"
            value={createContent}
            onChange={(e) => setCreateContent(e.target.value)}
            rows={4}
            className="border border-gray-300 rounded px-3 py-2 text-sm w-full resize-none"
          />
          <button
            onClick={handleCreate}
            disabled={loading}
            className="px-4 py-2 bg-blue-600 text-white rounded text-sm hover:bg-blue-700 disabled:opacity-50"
          >
            게시글 작성
          </button>
        </div>
      )}

      {/* 상세 조회 */}
      {tab === "getOne" && (
        <div className="space-y-3">
          <div className="flex gap-2">
            <input
              type="text"
              placeholder="boardId"
              value={getBoardId}
              onChange={(e) => setGetBoardId(e.target.value)}
              className="border border-gray-300 rounded px-3 py-2 text-sm w-60"
            />
            <button
              onClick={handleGetOne}
              disabled={loading}
              className="px-4 py-2 bg-blue-600 text-white rounded text-sm hover:bg-blue-700 disabled:opacity-50"
            >
              조회
            </button>
          </div>
          {boardDetail && (
            <div className="border border-gray-200 rounded p-3 text-sm space-y-2">
              <p className="font-medium text-base">{boardDetail.title}</p>
              <p className="text-gray-500 text-xs">
                {boardDetail.category} · ❤️ {boardDetail.likeCount}
              </p>
              <p className="text-gray-700">{boardDetail.content}</p>
              {boardDetail.comments?.length > 0 && (
                <p className="text-xs text-gray-400">
                  댓글 {boardDetail.comments.length}개
                </p>
              )}
            </div>
          )}
        </div>
      )}

      {/* 목록 조회 */}
      {tab === "getPage" && (
        <div className="space-y-3">
          <div className="flex gap-2 flex-wrap">
            <select
              value={pageCategory}
              onChange={(e) => setPageCategory(e.target.value)}
              className="border border-gray-300 rounded px-3 py-2 text-sm"
            >
              <option value="">전체</option>
              {categories.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
            <input
              type="number"
              placeholder="페이지"
              value={page}
              onChange={(e) => setPage(e.target.value)}
              className="border border-gray-300 rounded px-3 py-2 text-sm w-20"
            />
            <input
              type="number"
              placeholder="size"
              value={size}
              onChange={(e) => setSize(e.target.value)}
              className="border border-gray-300 rounded px-3 py-2 text-sm w-20"
            />
            <button
              onClick={handleGetPage}
              disabled={loading}
              className="px-4 py-2 bg-blue-600 text-white rounded text-sm hover:bg-blue-700 disabled:opacity-50"
            >
              조회
            </button>
          </div>
          {pageResult.length > 0 && (
            <div className="space-y-2 max-h-64 overflow-y-auto">
              {pageResult.map((b) => (
                <div
                  key={b.boardId}
                  className="border border-gray-200 rounded p-3 text-sm"
                >
                  <p className="font-medium">{b.title}</p>
                  <p className="text-gray-400 text-xs">
                    {b.category} · ❤️ {b.likeCount} · 💬 {b.commentCount} · id:{" "}
                    {b.boardId}
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* 사용자별 조회 */}
      {tab === "getByUser" && (
        <div className="space-y-3">
          <div className="flex gap-2">
            <input
              type="text"
              placeholder="userId"
              value={byUserUserId}
              onChange={(e) => setByUserUserId(e.target.value)}
              className="border border-gray-300 rounded px-3 py-2 text-sm w-60"
            />
            <button
              onClick={handleGetByUser}
              disabled={loading}
              className="px-4 py-2 bg-blue-600 text-white rounded text-sm hover:bg-blue-700 disabled:opacity-50"
            >
              조회
            </button>
          </div>
          {userBoards.length > 0 && (
            <div className="space-y-2 max-h-64 overflow-y-auto">
              {userBoards.map((b) => (
                <div
                  key={b.boardId}
                  className="border border-gray-200 rounded p-3 text-sm"
                >
                  <p className="font-medium">{b.title}</p>
                  <p className="text-gray-400 text-xs">
                    {b.category} · id: {b.boardId}
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* 수정 */}
      {tab === "update" && (
        <div className="space-y-3">
          <input
            type="text"
            placeholder="boardId"
            value={updateBoardId}
            onChange={(e) => setUpdateBoardId(e.target.value)}
            className="border border-gray-300 rounded px-3 py-2 text-sm w-full"
          />
          <input
            type="text"
            placeholder="새 제목 (변경 안 하면 비워두세요)"
            value={updateTitle}
            onChange={(e) => setUpdateTitle(e.target.value)}
            className="border border-gray-300 rounded px-3 py-2 text-sm w-full"
          />
          <textarea
            placeholder="새 내용 (변경 안 하면 비워두세요)"
            value={updateContent}
            onChange={(e) => setUpdateContent(e.target.value)}
            rows={4}
            className="border border-gray-300 rounded px-3 py-2 text-sm w-full resize-none"
          />
          <button
            onClick={handleUpdate}
            disabled={loading}
            className="px-4 py-2 bg-yellow-500 text-white rounded text-sm hover:bg-yellow-600 disabled:opacity-50"
          >
            게시글 수정
          </button>
        </div>
      )}

      {/* 삭제 */}
      {tab === "delete" && (
        <div className="space-y-3">
          <input
            type="text"
            placeholder="boardId"
            value={deleteBoardId}
            onChange={(e) => setDeleteBoardId(e.target.value)}
            className="border border-gray-300 rounded px-3 py-2 text-sm w-60"
          />
          <button
            onClick={handleDelete}
            disabled={loading}
            className="px-4 py-2 bg-red-600 text-white rounded text-sm hover:bg-red-700 disabled:opacity-50"
          >
            게시글 삭제
          </button>
        </div>
      )}

      {/* 좋아요 */}
      {tab === "like" && (
        <div className="space-y-3">
          <input
            type="text"
            placeholder="boardId"
            value={likeBoardId}
            onChange={(e) => setLikeBoardId(e.target.value)}
            className="border border-gray-300 rounded px-3 py-2 text-sm w-60"
          />
          {likeStatus && (
            <div className="flex items-center gap-3">
              <span className="text-2xl">
                {likeStatus.isLiked ? "❤️" : "🤍"}
              </span>
              <span className="text-lg font-medium">
                {likeStatus.likeCount}
              </span>
            </div>
          )}
          <div className="flex gap-3">
            <button
              onClick={handleLike}
              disabled={loading}
              className="px-4 py-2 bg-red-500 text-white rounded text-sm hover:bg-red-600 disabled:opacity-50"
            >
              좋아요 (POST)
            </button>
            <button
              onClick={handleUnlike}
              disabled={loading}
              className="px-4 py-2 bg-gray-500 text-white rounded text-sm hover:bg-gray-600 disabled:opacity-50"
            >
              취소 (DELETE)
            </button>
          </div>
        </div>
      )}

      {/* 로그 */}
      <div className="bg-gray-50 border border-gray-200 rounded p-3 space-y-1 max-h-40 overflow-y-auto">
        {log.length === 0 ? (
          <p className="text-gray-400 text-xs">요청 로그가 여기 표시됩니다</p>
        ) : (
          log.map((l, i) => (
            <p key={i} className="text-xs text-gray-700 font-mono">
              {l}
            </p>
          ))
        )}
      </div>
    </div>
  );
}

export default BoardTest;
