import { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { userApi } from "../../api/userApi";
import { studyGroupApi } from "../../api/studyGroupApi"; // 참여 스터디 조회를 위해 추가
import type { MyInfo, UpdateUserRequest } from "../../types/user.type";
import type { GroupListResponse } from "../../types/studyGroup.type"; // 타입 확인 필요
import useAuthStore from "../../stores/authStore";
import StudyGrass from "../../components/profile/StudyGrass";
import DeleteAccountModal from "../../components/profile/DeleteAccountModal";

const ProfilePage = () => {
  const { userId } = useParams<{ userId: string }>();
  const navigate = useNavigate();
  const { user, setUser } = useAuthStore();
  const isMe = user?.userId === userId;

  const [info, setInfo] = useState<MyInfo | null>(null);
  const [myGroups, setMyGroups] = useState<GroupListResponse[]>([]); // 스터디 그룹 상태
  const [loading, setLoading] = useState(true);
  const [groupLoading, setGroupLoading] = useState(true);
  const [tab, setTab] = useState<"boards" | "comments">("boards");

  const [editMode, setEditMode] = useState(false);
  const [editForm, setEditForm] = useState<UpdateUserRequest>({});
  const [editLoading, setEditLoading] = useState(false);
  const [editError, setEditError] = useState("");
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);

  useEffect(() => {
    if (!userId) return;
    const fetchProfileData = async () => {
      setLoading(true);
      setGroupLoading(true);
      try {
        // 1. 기본 프로필 정보 조회
        const res = isMe
          ? await userApi.getMyInfo()
          : await userApi.getUser(userId);
        setInfo(res.data);

        // 2. 참여 중인 스터디 그룹 조회
        const groupRes = await studyGroupApi.getMyGroups();
        setMyGroups(groupRes.data);

        if (isMe) {
          setEditForm({
            nickName: res.data.nickName,
            email: res.data.email,
            phoneNumber: res.data.phoneNumber,
            bio: res.data.bio ?? "",
          });
        }
      } catch (error) {
        console.error("데이터 로딩 실패:", error);
        navigate("/");
      } finally {
        setLoading(false);
        setGroupLoading(false);
      }
    };
    fetchProfileData();
  }, [userId, isMe, navigate]);

  const handleEditSubmit = async () => {
    setEditError("");
    setEditLoading(true);
    try {
      const res = await userApi.updateUser(editForm);
      setInfo((prev) => (prev ? { ...prev, ...res.data } : prev));
      setUser({ ...user!, nickName: res.data.nickName ?? user!.nickName });
      setEditMode(false);
    } catch {
      setEditError("정보 수정에 실패했습니다. 다시 확인해 주세요.");
    } finally {
      setEditLoading(false);
    }
  };

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString("ko-KR", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  if (loading) {
    return (
      <div className="max-w-5xl mx-auto px-8 py-20 space-y-10 animate-pulse">
        <div className="h-64 bg-slate-100 rounded-[3rem]" />
        <div className="h-96 bg-slate-100 rounded-[3rem]" />
      </div>
    );
  }

  if (!info) return null;

  return (
    <div className="max-w-5xl mx-auto px-8 py-20 font-['Pretendard_Variable']">
      {/* 1. 프로필 카드 */}
      <div className="bg-white rounded-[3.5rem] border border-slate-100 shadow-2xl shadow-slate-200/50 overflow-hidden mb-12 transition-all">
        <div className="p-10 md:p-14">
          <div className="flex flex-col md:flex-row items-center md:items-start gap-12">
            <div className="w-32 h-32 bg-gradient-to-br from-slate-900 to-slate-800 rounded-[2.5rem] flex items-center justify-center text-white text-4xl font-black shadow-2xl shadow-slate-300 shrink-0">
              {info.nickName?.[0]?.toUpperCase()}
            </div>

            <div className="flex-1 text-center md:text-left">
              <div className="flex flex-col md:flex-row md:items-center gap-4 mb-4">
                <h1 className="text-3xl font-black text-slate-900 tracking-tight">
                  {info.nickName}
                </h1>
                {info.role === "ADMIN" && (
                  <span className="inline-flex px-4 py-1.5 bg-rose-50 text-rose-500 text-[10px] font-black uppercase tracking-[0.2em] rounded-full border border-rose-100 mx-auto md:mx-0">
                    Admin Console
                  </span>
                )}
              </div>
              <p className="text-base font-bold text-slate-400 mb-6 flex items-center justify-center md:justify-start gap-2">
                <span className="w-1.5 h-1.5 bg-blue-500 rounded-full animate-pulse" />
                {info.email}
              </p>
              <div className="bg-slate-50 px-7 py-5 rounded-[2rem] inline-block max-w-full">
                <p
                  className={`text-slate-600 font-bold leading-relaxed ${!info.bio && "text-slate-300 italic font-medium text-sm"}`}
                >
                  {info.bio || "등록된 자기소개가 없습니다."}
                </p>
              </div>
            </div>

            {isMe && (
              <button
                onClick={() => setEditMode(!editMode)}
                className={`px-8 py-4 rounded-2xl text-[11px] font-black uppercase tracking-widest transition-all shadow-lg ${
                  editMode
                    ? "bg-rose-50 text-rose-500 shadow-rose-100 hover:bg-rose-100"
                    : "bg-slate-900 text-white shadow-slate-200 hover:bg-blue-600"
                }`}
              >
                {editMode ? "취소하기" : "프로필 수정"}
              </button>
            )}
          </div>

          {/* 수정 폼 */}
          {editMode && isMe && (
            <div className="mt-14 pt-14 border-t border-slate-50 animate-in slide-in-from-top-5 duration-500">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
                {[
                  { label: "닉네임", key: "nickName", type: "text" },
                  { label: "이메일", key: "email", type: "email" },
                  { label: "전화번호", key: "phoneNumber", type: "tel" },
                  {
                    label: "새 비밀번호",
                    key: "password",
                    type: "password",
                    placeholder: "변경 시에만 입력",
                  },
                ].map((field) => (
                  <div key={field.key} className="space-y-3">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-2">
                      {field.label}
                    </label>
                    <input
                      type={field.type}
                      value={(editForm as any)[field.key] ?? ""}
                      placeholder={field.placeholder}
                      onChange={(e) =>
                        setEditForm({
                          ...editForm,
                          [field.key]: e.target.value,
                        })
                      }
                      className="w-full px-7 py-5 bg-slate-50 border border-slate-100 rounded-[1.5rem] text-sm font-black focus:outline-none focus:bg-white focus:border-slate-900 focus:ring-4 focus:ring-slate-900/5 transition-all"
                    />
                  </div>
                ))}
              </div>
              <div className="space-y-3 mb-10">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-2">
                  자기소개
                </label>
                <textarea
                  value={editForm.bio ?? ""}
                  onChange={(e) =>
                    setEditForm({ ...editForm, bio: e.target.value })
                  }
                  rows={4}
                  className="w-full px-7 py-5 bg-slate-50 border border-slate-100 rounded-[1.5rem] text-sm font-black focus:outline-none focus:bg-white focus:border-slate-900 focus:ring-4 focus:ring-slate-900/5 transition-all resize-none"
                />
              </div>

              {editError && (
                <div className="mb-10 bg-rose-50 p-5 rounded-2xl border border-rose-100 flex items-center gap-3">
                  <span className="text-lg">❌</span>
                  <p className="text-xs font-bold text-rose-600">{editError}</p>
                </div>
              )}

              <div className="flex items-center justify-between">
                <button
                  onClick={() => setDeleteModalOpen(true)}
                  className="text-[11px] font-black text-slate-300 hover:text-rose-500 transition-colors uppercase tracking-widest"
                >
                  회원 탈퇴하기
                </button>
                <button
                  onClick={handleEditSubmit}
                  disabled={editLoading}
                  className="px-12 py-5 bg-slate-900 text-white rounded-2xl text-[13px] font-black uppercase tracking-widest hover:bg-blue-600 hover:shadow-2xl hover:shadow-blue-200 transition-all disabled:opacity-50 active:scale-95"
                >
                  {editLoading ? "저장 중..." : "변경사항 저장"}
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* 2. 학습 데이터 (잔디) */}
      {isMe && (
        <div className="mb-12">
          <StudyGrass />
        </div>
      )}

      {/* 3. 참여 중인 스터디 그룹 (추가됨) */}
      <div className="mb-12">
        <div className="flex items-center justify-between mb-6 px-4">
          <h2 className="text-xl font-black text-slate-900 tracking-tight">
            참여 중인 스터디
          </h2>
          <span className="text-[10px] font-black text-blue-600 bg-blue-50 px-3 py-1 rounded-full uppercase tracking-widest">
            {myGroups.length} Groups
          </span>
        </div>

        {groupLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {[1, 2].map((i) => (
              <div
                key={i}
                className="h-32 bg-slate-50 rounded-[2.5rem] animate-pulse"
              />
            ))}
          </div>
        ) : myGroups.length === 0 ? (
          <div className="bg-slate-50 rounded-[2.5rem] py-12 text-center border border-dashed border-slate-200">
            <p className="text-slate-400 font-bold text-sm">
              아직 참여 중인 스터디가 없습니다.
            </p>
            {isMe && (
              <Link
                to="/study-group"
                className="text-blue-600 font-black text-xs mt-2 inline-block hover:underline"
              >
                스터디 찾으러 가기 →
              </Link>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {myGroups.map((group) => (
              <Link
                key={group.groupId}
                to={`/study-group/${group.groupId}`}
                className="group bg-white p-6 rounded-[2.5rem] border border-slate-100 shadow-sm hover:shadow-xl hover:border-blue-600 transition-all flex items-center justify-between"
              >
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-[9px] font-black text-blue-500 bg-blue-50 px-2 py-0.5 rounded uppercase">
                      {group.category}
                    </span>
                    {group.isPrivate && (
                      <span className="text-[9px] text-slate-300">🔒</span>
                    )}
                  </div>
                  <h3 className="font-black text-slate-900 group-hover:text-blue-600 transition-colors truncate">
                    {group.groupName}
                  </h3>
                  <p className="text-[11px] text-slate-400 font-bold mt-1">
                    멤버 {group.currentMembers} / {group.maxMembers}
                  </p>
                </div>
                <div className="w-10 h-10 rounded-2xl bg-slate-50 flex items-center justify-center text-slate-300 group-hover:bg-blue-600 group-hover:text-white transition-all">
                  →
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>

      {/* 4. 탭 섹션 (활동 내역) */}
      <div className="bg-white rounded-[3.5rem] border border-slate-100 shadow-2xl shadow-slate-200/50 overflow-hidden">
        <div className="flex bg-slate-50/50 p-3">
          {[
            { id: "boards", label: "작성한 글", count: info.boards?.length },
            {
              id: "comments",
              label: "작성한 댓글",
              count: info.comments?.length,
            },
          ].map((t) => (
            <button
              key={t.id}
              onClick={() => setTab(t.id as any)}
              className={`flex-1 py-5 rounded-[2.5rem] text-xs font-black uppercase tracking-widest transition-all ${
                tab === t.id
                  ? "bg-white text-slate-900 shadow-xl shadow-slate-200"
                  : "text-slate-400 hover:text-slate-600 hover:bg-white/50"
              }`}
            >
              {t.label}{" "}
              <span
                className={`ml-2 ${tab === t.id ? "text-blue-600" : "opacity-40"}`}
              >
                {t.count ?? 0}
              </span>
            </button>
          ))}
        </div>

        <div className="p-4">
          {tab === "boards" ? (
            <div className="space-y-2">
              {!info.boards?.length ? (
                <div className="py-24 text-center opacity-20 flex flex-col items-center">
                  <span className="text-5xl mb-4">📝</span>
                  <p className="text-xs font-black uppercase tracking-[0.2em]">
                    아직 작성한 글이 없습니다
                  </p>
                </div>
              ) : (
                info.boards.map((board) => (
                  <Link
                    key={board.boardId}
                    to={`/board/${board.boardId}`}
                    className="flex items-center justify-between p-8 hover:bg-slate-50 rounded-[2.5rem] transition-all group"
                  >
                    <div className="min-w-0 pr-6">
                      <p className="text-[17px] text-slate-900 font-black group-hover:text-blue-600 transition-colors truncate mb-2">
                        {board.title}
                      </p>
                      <p className="text-[10px] text-slate-300 font-black uppercase tracking-widest">
                        {formatDate(board.createdAt)}
                      </p>
                    </div>
                    <div className="flex gap-6 shrink-0">
                      <div className="flex flex-col items-end">
                        <span className="text-[10px] font-black text-slate-300 uppercase tracking-widest">
                          조회수
                        </span>
                        <span className="text-sm font-black text-slate-900">
                          {board.viewCount}
                        </span>
                      </div>
                      <div className="flex flex-col items-end">
                        <span className="text-[10px] font-black text-slate-300 uppercase tracking-widest">
                          좋아요
                        </span>
                        <span className="text-sm font-black text-rose-500">
                          {board.likeCount}
                        </span>
                      </div>
                    </div>
                  </Link>
                ))
              )}
            </div>
          ) : (
            <div className="space-y-2">
              {!info.comments?.length ? (
                <div className="py-24 text-center opacity-20 flex flex-col items-center">
                  <span className="text-5xl mb-4">💬</span>
                  <p className="text-xs font-black uppercase tracking-[0.2em]">
                    아직 작성한 댓글이 없습니다
                  </p>
                </div>
              ) : (
                info.comments.map((comment) => (
                  <Link
                    key={comment.commentId}
                    to={`/board/${comment.boardId}`}
                    className="flex flex-col p-8 hover:bg-slate-50 rounded-[2.5rem] transition-all group"
                  >
                    <p className="text-[15px] text-slate-700 font-bold line-clamp-2 mb-3 group-hover:text-slate-900 leading-relaxed">
                      {comment.content}
                    </p>
                    <div className="flex items-center justify-between">
                      <p className="text-[10px] text-slate-300 font-black uppercase tracking-widest">
                        {formatDate(comment.createdAt)}
                      </p>
                      <span className="text-[10px] font-black text-blue-600 uppercase tracking-widest group-hover:underline underline-offset-4">
                        원문 보기 →
                      </span>
                    </div>
                  </Link>
                ))
              )}
            </div>
          )}
        </div>
      </div>

      <DeleteAccountModal
        isOpen={deleteModalOpen}
        onClose={() => setDeleteModalOpen(false)}
      />
    </div>
  );
};

export default ProfilePage;
