import { useState } from "react";
import axios from "axios";

interface GetResponse {
  commentId: string;
  boardId: string;
  userId: string;
  content: string;
  commentPath: string;
  isDeleted: boolean;
  isLiked: boolean;
  likeCount: number;
}

interface CreateResponse {
  commentId: string;
  commentPath: string;
}

interface LikeResponse {
  likeCount: number;
  isLiked: boolean;
}

type Tab = "create" | "read" | "readByUser" | "update" | "delete" | "like";

function CommentTest() {
  const [tab, setTab] = useState<Tab>("create");
  const [log, setLog] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);

  // create
  const [boardId, setBoardId] = useState("");
  const [content, setContent] = useState("");
  const [parentPath, setParentPath] = useState("");

  // read (infinite scroll)
  const [readBoardId, setReadBoardId] = useState("");
  const [lastPath, setLastPath] = useState("");
  const [pageSize, setPageSize] = useState("10");
  const [comments, setComments] = useState<GetResponse[]>([]);

  // read by user
  const [readUserId, setReadUserId] = useState("");
  const [userComments, setUserComments] = useState<GetResponse[]>([]);

  // update
  const [updateCommentId, setUpdateCommentId] = useState("");
  const [updateContent, setUpdateContent] = useState("");

  // delete
  const [deleteCommentId, setDeleteCommentId] = useState("");

  // like
  const [likeCommentId, setLikeCommentId] = useState("");
  const [likeStatus, setLikeStatus] = useState<LikeResponse | null>(null);

  const addLog = (msg: string) =>
    setLog((prev) => [`[${new Date().toLocaleTimeString()}] ${msg}`, ...prev]);

  const handleCreate = async () => {
    if (!boardId || !content) return alert("boardId와 content를 입력하세요");
    setLoading(true);
    try {
      const res = await axios.post<CreateResponse>(
        "/api/comments/create",
        { boardId, content, parentPath: parentPath || null },
        { withCredentials: true },
      );
      addLog(
        `댓글 작성 성공 → commentId: ${res.data.commentId}, path: ${res.data.commentPath}`,
      );
      setContent("");
      setParentPath("");
    } catch (e: any) {
      addLog(`댓글 작성 실패 → ${e.response?.data?.message ?? e.message}`);
    } finally {
      setLoading(false);
    }
  };

  const handleRead = async (loadMore = false) => {
    if (!readBoardId) return alert("boardId를 입력하세요");
    setLoading(true);
    try {
      const res = await axios.get<GetResponse[]>(
        "/api/comments/infinite-scroll",
        {
          params: {
            boardId: readBoardId,
            lastPath: lastPath || undefined,
            pageSize,
          },
          withCredentials: true,
        },
      );
      setComments(loadMore ? (prev) => [...prev, ...res.data] : res.data);
      if (res.data.length > 0)
        setLastPath(res.data[res.data.length - 1].commentPath);
      addLog(`댓글 조회 성공 → ${res.data.length}개`);
    } catch (e: any) {
      addLog(`댓글 조회 실패 → ${e.response?.data?.message ?? e.message}`);
    } finally {
      setLoading(false);
    }
  };

  const handleReadFresh = async () => {
    if (!readBoardId) return alert("boardId를 입력하세요");
    setLoading(true);
    setLastPath("");
    setComments([]);
    try {
      const res = await axios.get<GetResponse[]>(
        "/api/comments/infinite-scroll",
        {
          params: {
            boardId: readBoardId,
            pageSize,
          },
          withCredentials: true,
        },
      );
      setComments(res.data);
      if (res.data.length > 0)
        setLastPath(res.data[res.data.length - 1].commentPath);
      addLog(`댓글 조회 성공 → ${res.data.length}개`);
    } catch (e: any) {
      addLog(`댓글 조회 실패 → ${e.response?.data?.message ?? e.message}`);
    } finally {
      setLoading(false);
    }
  };

  const handleReadByUser = async () => {
    if (!readUserId) return alert("userId를 입력하세요");
    setLoading(true);
    try {
      const res = await axios.get<GetResponse[]>(
        `/api/comments/users/${readUserId}`,
        { withCredentials: true },
      );
      setUserComments(res.data);
      addLog(`사용자 댓글 조회 성공 → ${res.data.length}개`);
    } catch (e: any) {
      addLog(
        `사용자 댓글 조회 실패 → ${e.response?.data?.message ?? e.message}`,
      );
    } finally {
      setLoading(false);
    }
  };

  const handleUpdate = async () => {
    if (!updateCommentId || !updateContent)
      return alert("commentId와 내용을 입력하세요");
    setLoading(true);
    try {
      const res = await axios.put(
        `/api/comments/update/${updateCommentId}`,
        { content: updateContent },
        { withCredentials: true },
      );
      addLog(`댓글 수정 성공 → ${JSON.stringify(res.data)}`);
    } catch (e: any) {
      addLog(`댓글 수정 실패 → ${e.response?.data?.message ?? e.message}`);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!deleteCommentId) return alert("commentId를 입력하세요");
    setLoading(true);
    try {
      const res = await axios.delete(
        `/api/comments/delete/${deleteCommentId}`,
        {
          withCredentials: true,
        },
      );
      addLog(`댓글 삭제 성공 → ${JSON.stringify(res.data)}`);
    } catch (e: any) {
      addLog(`댓글 삭제 실패 → ${e.response?.data?.message ?? e.message}`);
    } finally {
      setLoading(false);
    }
  };

  const handleLike = async () => {
    if (!likeCommentId) return alert("commentId를 입력하세요");
    setLoading(true);
    try {
      const res = await axios.post<LikeResponse>(
        `/api/comments/like/${likeCommentId}`,
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
    if (!likeCommentId) return alert("commentId를 입력하세요");
    setLoading(true);
    try {
      const res = await axios.delete<LikeResponse>(
        `/api/comments/like/${likeCommentId}`,
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
    { key: "read", label: "조회 (무한스크롤)" },
    { key: "readByUser", label: "사용자별 조회" },
    { key: "update", label: "수정" },
    { key: "delete", label: "삭제" },
    { key: "like", label: "좋아요" },
  ];

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
          <input
            type="text"
            placeholder="boardId"
            value={boardId}
            onChange={(e) => setBoardId(e.target.value)}
            className="border border-gray-300 rounded px-3 py-2 text-sm w-full"
          />
          <input
            type="text"
            placeholder="parentPath (대댓글일 때만, 최상위면 비워두세요)"
            value={parentPath}
            onChange={(e) => setParentPath(e.target.value)}
            className="border border-gray-300 rounded px-3 py-2 text-sm w-full"
          />
          <textarea
            placeholder="댓글 내용"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            rows={3}
            className="border border-gray-300 rounded px-3 py-2 text-sm w-full resize-none"
          />
          <button
            onClick={handleCreate}
            disabled={loading}
            className="px-4 py-2 bg-blue-600 text-white rounded text-sm hover:bg-blue-700 disabled:opacity-50"
          >
            댓글 작성
          </button>
        </div>
      )}

      {/* 조회 (무한스크롤) */}
      {tab === "read" && (
        <div className="space-y-3">
          <div className="flex gap-2 flex-wrap">
            <input
              type="text"
              placeholder="boardId"
              value={readBoardId}
              onChange={(e) => {
                setReadBoardId(e.target.value);
                setLastPath("");
                setComments([]);
              }}
              className="border border-gray-300 rounded px-3 py-2 text-sm w-52"
            />
            <input
              type="number"
              placeholder="pageSize"
              value={pageSize}
              onChange={(e) => setPageSize(e.target.value)}
              className="border border-gray-300 rounded px-3 py-2 text-sm w-24"
            />
            <button
              onClick={handleReadFresh}
              disabled={loading}
              className="px-4 py-2 bg-blue-600 text-white rounded text-sm hover:bg-blue-700 disabled:opacity-50"
            >
              처음부터 조회
            </button>
          </div>
          {comments.length > 0 && (
            <div className="space-y-2 max-h-64 overflow-y-auto">
              {comments.map((c) => (
                <div
                  key={c.commentId}
                  className="border border-gray-200 rounded p-3 text-sm"
                  style={{
                    marginLeft: `${(c.commentPath.length / 5 - 1) * 16}px`,
                  }}
                >
                  <div className="flex gap-2 text-xs text-gray-400 mb-1">
                    <span>id: {c.commentId}</span>
                    <span>path: {c.commentPath}</span>
                    <span>❤️ {c.likeCount}</span>
                    {c.isDeleted && (
                      <span className="text-red-400">삭제됨</span>
                    )}
                  </div>
                  <p className="text-gray-700">{c.content}</p>
                </div>
              ))}
              <button
                onClick={() => handleRead(true)}
                disabled={loading}
                className="w-full py-2 border border-gray-200 rounded text-xs text-gray-500 hover:bg-gray-50"
              >
                더 보기
              </button>
            </div>
          )}
        </div>
      )}

      {/* 사용자별 조회 */}
      {tab === "readByUser" && (
        <div className="space-y-3">
          <div className="flex gap-2">
            <input
              type="text"
              placeholder="userId"
              value={readUserId}
              onChange={(e) => setReadUserId(e.target.value)}
              className="border border-gray-300 rounded px-3 py-2 text-sm w-60"
            />
            <button
              onClick={handleReadByUser}
              disabled={loading}
              className="px-4 py-2 bg-blue-600 text-white rounded text-sm hover:bg-blue-700 disabled:opacity-50"
            >
              조회
            </button>
          </div>
          {userComments.length > 0 && (
            <div className="space-y-2 max-h-64 overflow-y-auto">
              {userComments.map((c) => (
                <div
                  key={c.commentId}
                  className="border border-gray-200 rounded p-3 text-sm"
                >
                  <p className="text-gray-700">{c.content}</p>
                  <p className="text-xs text-gray-400 mt-1">
                    id: {c.commentId} · path: {c.commentPath} · ❤️ {c.likeCount}
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
            placeholder="commentId"
            value={updateCommentId}
            onChange={(e) => setUpdateCommentId(e.target.value)}
            className="border border-gray-300 rounded px-3 py-2 text-sm w-full"
          />
          <textarea
            placeholder="수정할 내용"
            value={updateContent}
            onChange={(e) => setUpdateContent(e.target.value)}
            rows={3}
            className="border border-gray-300 rounded px-3 py-2 text-sm w-full resize-none"
          />
          <button
            onClick={handleUpdate}
            disabled={loading}
            className="px-4 py-2 bg-yellow-500 text-white rounded text-sm hover:bg-yellow-600 disabled:opacity-50"
          >
            댓글 수정
          </button>
        </div>
      )}

      {/* 삭제 */}
      {tab === "delete" && (
        <div className="space-y-3">
          <input
            type="text"
            placeholder="commentId"
            value={deleteCommentId}
            onChange={(e) => setDeleteCommentId(e.target.value)}
            className="border border-gray-300 rounded px-3 py-2 text-sm w-60"
          />
          <button
            onClick={handleDelete}
            disabled={loading}
            className="px-4 py-2 bg-red-600 text-white rounded text-sm hover:bg-red-700 disabled:opacity-50"
          >
            댓글 삭제
          </button>
        </div>
      )}

      {/* 좋아요 */}
      {tab === "like" && (
        <div className="space-y-3">
          <input
            type="text"
            placeholder="commentId"
            value={likeCommentId}
            onChange={(e) => setLikeCommentId(e.target.value)}
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

export default CommentTest;
