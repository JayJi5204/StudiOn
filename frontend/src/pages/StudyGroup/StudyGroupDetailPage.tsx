import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { studyGroupApi } from "../../api/studyGroupApi";
import type { StudyGroup, StudyMember } from "../../types/studyGroup.type";
import useAuthStore from "../../stores/authStore";

const DAY_MAP: Record<string, string> = {
  MON: "월",
  TUE: "화",
  WED: "수",
  THU: "목",
  FRI: "금",
  SAT: "토",
  SUN: "일",
};

const CATEGORY_MAP: Record<string, string> = {
  JOB: "취업",
  CERTIFICATE: "자격증",
  LANGUAGE: "어학",
  ETC: "기타",
};

const StudyGroupDetailPage = () => {
  const { groupId } = useParams<{ groupId: string }>();
  const navigate = useNavigate();
  const { user, isLoggedIn } = useAuthStore();

  const [group, setGroup] = useState<StudyGroup | null>(null);
  const [members, setMembers] = useState<StudyMember[]>([]);
  const [pendingMembers, setPendingMembers] = useState<StudyMember[]>([]);
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState<"info" | "pending">("info");
  const [joinLoading, setJoinLoading] = useState(false);
  const [copied, setCopied] = useState(false);

  // 1. 데이터 로딩
  useEffect(() => {
    if (!groupId) return;
    const fetchData = async () => {
      try {
        const [groupRes, membersRes] = await Promise.all([
          studyGroupApi.getGroup(groupId),
          studyGroupApi.getMembers(groupId),
        ]);
        setGroup(groupRes.data);
        setMembers(membersRes.data);
      } catch {
        navigate("/study-group");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [groupId, navigate]);

  // 2. 리더 판별 (타입 불일치 방지를 위해 String 변환 비교)
  const isLeader =
    user?.userId &&
    group?.leaderId &&
    String(user.userId) === String(group.leaderId);

  const isMember = members.some(
    (m) => String(m.userId) === String(user?.userId),
  );
  const isPending = pendingMembers.some(
    (m) => String(m.userId) === String(user?.userId),
  );

  // 3. 리더일 경우 가입 대기 멤버 목록 별도 로딩
  const fetchPendingMembers = async () => {
    if (!groupId || !isLeader) return;
    try {
      const res = await studyGroupApi.getPendingMembers(groupId);
      setPendingMembers(res.data);
    } catch {
      setPendingMembers([]);
    }
  };

  useEffect(() => {
    if (isLeader) fetchPendingMembers();
  }, [isLeader, groupId]);

  // 핸들러 함수들
  const handleJoin = async () => {
    if (!isLoggedIn) {
      navigate("/signin");
      return;
    }
    if (!groupId) return;
    setJoinLoading(true);
    try {
      await studyGroupApi.join(groupId);
      alert("가입 신청이 완료되었어요!");
    } catch (e: any) {
      alert(e?.response?.data?.message ?? "가입 신청에 실패했어요.");
    } finally {
      setJoinLoading(false);
    }
  };

  const handleLeave = async () => {
    if (!groupId || !confirm("그룹을 탈퇴하시겠습니까?")) return;
    try {
      await studyGroupApi.leave(groupId);
      navigate("/study-group");
    } catch (e: any) {
      alert(e?.response?.data?.message ?? "탈퇴에 실패했어요.");
    }
  };

  const handleDelete = async () => {
    if (
      !groupId ||
      !confirm("그룹을 삭제하시겠습니까?\n삭제된 데이터는 복구할 수 없습니다.")
    )
      return;
    try {
      await studyGroupApi.deleteGroup(groupId);
      navigate("/study-group");
    } catch {
      alert("삭제에 실패했어요.");
    }
  };

  const handleAccept = async (userId: string) => {
    if (!groupId) return;
    try {
      await studyGroupApi.acceptMember(groupId, userId);
      await fetchPendingMembers();
      const res = await studyGroupApi.getMembers(groupId);
      setMembers(res.data);
    } catch {
      alert("수락에 실패했어요.");
    }
  };

  const handleReject = async (userId: string) => {
    if (!groupId) return;
    try {
      await studyGroupApi.rejectMember(groupId, userId);
      await fetchPendingMembers();
    } catch {
      alert("거절에 실패했어요.");
    }
  };

  const handleKick = async (userId: string) => {
    if (!groupId || !confirm("해당 멤버를 그룹에서 제외할까요?")) return;
    try {
      await studyGroupApi.kickMember(groupId, userId);
      const res = await studyGroupApi.getMembers(groupId);
      setMembers(res.data);
    } catch {
      alert("추방에 실패했어요.");
    }
  };

  const handleChangeLeader = async (userId: string) => {
    if (!groupId || !confirm("그룹장 권한을 위임하시겠습니까?")) return;
    try {
      await studyGroupApi.changeLeader(groupId, userId);
      const groupRes = await studyGroupApi.getGroup(groupId);
      setGroup(groupRes.data);
    } catch {
      alert("위임에 실패했어요.");
    }
  };

  const handleCopyInviteCode = () => {
    const code = group?.inviteCode;
    if (!code) return;
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const formatDayOfWeek = (dayOfWeek: string) => {
    if (!dayOfWeek) return "요일 미정";
    return dayOfWeek
      .split(",")
      .map((d) => DAY_MAP[d] ?? d)
      .join(", ");
  };

  if (loading)
    return (
      <div className="max-w-4xl mx-auto px-6 py-16 space-y-8 animate-pulse">
        <div className="h-6 w-24 bg-slate-200 rounded-lg" />
        <div className="h-64 bg-slate-100 rounded-[3rem]" />
      </div>
    );

  if (!group) return null;

  return (
    <div className="max-w-5xl mx-auto px-6 py-16 font-['Pretendard_Variable']">
      {/* 네비게이션 */}
      <button
        onClick={() => navigate("/study-group")}
        className="group flex items-center gap-2 text-slate-900 hover:text-slate-600 transition-colors mb-10 font-black text-sm"
      >
        <span className="text-xl group-hover:-translate-x-1 transition-transform">
          ←
        </span>
        전체 목록으로 돌아가기
      </button>

      {/* 메인 히어로 */}
      <section className="bg-white rounded-[3rem] p-12 border border-slate-200 shadow-2xl shadow-slate-100 mb-10 relative overflow-hidden">
        <div className="flex flex-wrap items-center gap-3 mb-8">
          <span className="px-5 py-1.5 bg-slate-900 text-white text-[11px] font-black rounded-full uppercase">
            {CATEGORY_MAP[group.category] ?? group.category}
          </span>
          <span
            className={`px-5 py-1.5 border-2 text-[11px] font-black rounded-full ${
              group.isPrivate
                ? "border-slate-900 text-slate-900"
                : "border-emerald-500 text-emerald-500"
            }`}
          >
            {group.isPrivate ? "비공개 그룹" : "공개 그룹"}
          </span>
        </div>

        <h1 className="text-5xl font-black text-slate-900 tracking-tight mb-6 leading-tight">
          {group.groupName}
        </h1>
        <p className="text-xl font-bold text-slate-800 leading-relaxed mb-10 max-w-3xl">
          {group.description || "등록된 그룹 소개가 없습니다."}
        </p>

        <div className="flex flex-wrap items-center justify-between gap-8 pt-10 border-t border-slate-100">
          <div className="flex flex-wrap gap-2">
            {group.tags?.map((tag) => (
              <span
                key={tag}
                className="px-5 py-2.5 bg-slate-50 text-slate-900 text-xs font-black rounded-2xl border border-slate-200"
              >
                #{tag}
              </span>
            ))}
          </div>

          <div className="flex gap-3">
            {isLoggedIn && !isMember && !isPending && (
              <button
                onClick={handleJoin}
                disabled={
                  joinLoading || group.currentMembers >= group.maxMembers
                }
                className="px-10 py-5 bg-slate-900 text-white rounded-[1.5rem] font-black text-base hover:bg-slate-600 shadow-xl shadow-slate-100 disabled:opacity-30 transition-all"
              >
                {joinLoading ? "처리 중..." : "스터디 가입하기"}
              </button>
            )}
            {isPending && (
              <span className="px-10 py-5 bg-slate-100 text-slate-900 rounded-[1.5rem] font-black text-base border border-slate-200">
                승인 대기 중
              </span>
            )}
            {isLeader && (
              <div className="flex gap-2">
                <button
                  onClick={() => navigate(`/study-group/${groupId}/edit`)}
                  className="px-8 py-5 border-2 border-slate-900 text-slate-900 rounded-[1.5rem] font-black text-sm hover:bg-slate-900 hover:text-white transition-all"
                >
                  정보 수정
                </button>
                <button
                  onClick={handleDelete}
                  className="px-8 py-5 bg-rose-50 text-rose-600 rounded-[1.5rem] font-black text-sm hover:bg-rose-600 hover:text-white transition-all"
                >
                  그룹 삭제
                </button>
              </div>
            )}
            {isLoggedIn && !isLeader && isMember && (
              <button
                onClick={handleLeave}
                className="px-8 py-5 border-2 border-rose-500 text-rose-500 rounded-[1.5rem] font-black text-sm hover:bg-rose-500 hover:text-white transition-all"
              >
                그룹 탈퇴
              </button>
            )}
          </div>
        </div>
      </section>

      {/* 정보 그리드 */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-10">
        {[
          {
            label: "현재 멤버",
            value: `${group.currentMembers} / ${group.maxMembers} 명`,
          },
          { label: "진행 요일", value: formatDayOfWeek(group.dayOfWeek) },
          { label: "진행 시간", value: group.studyTime || "시간 협의" },
          {
            label: "초대 코드",
            value: isLeader ? group.inviteCode || "발급 안됨" : "리더 전용",
            isCopy: !!isLeader && !!group.inviteCode,
          },
        ].map((info, idx) => (
          <div
            key={idx}
            className="bg-white p-8 rounded-[2.5rem] border border-slate-200 shadow-sm"
          >
            <p className="text-[11px] font-black text-slate-500 mb-3 tracking-widest">
              {info.label}
            </p>
            {info.isCopy ? (
              <button
                onClick={handleCopyInviteCode}
                className="text-base font-black text-slate-900 hover:text-slate-600 transition-colors flex items-center gap-2"
              >
                {copied ? "복사 완료!" : info.value}
                {!copied && <span className="text-xs">📋</span>}
              </button>
            ) : (
              <p
                className={`text-base font-black ${info.label === "초대 코드" ? "text-slate-400" : "text-slate-900"}`}
              >
                {info.value}
              </p>
            )}
          </div>
        ))}
      </div>

      {/* 멤버 관리 섹션 */}
      <div className="bg-white rounded-[3rem] border border-slate-200 overflow-hidden shadow-sm">
        <nav className="flex p-3 bg-slate-50 border-b border-slate-100">
          <button
            onClick={() => setTab("info")}
            className={`flex-1 py-5 text-sm font-black rounded-[1.5rem] transition-all ${
              tab === "info"
                ? "bg-white text-slate-900 shadow-md"
                : "text-slate-500 hover:text-slate-700"
            }`}
          >
            참여 멤버 ({members.length})
          </button>
          {isLeader && (
            <button
              onClick={() => {
                setTab("pending");
                fetchPendingMembers();
              }}
              className={`flex-1 py-5 text-sm font-black rounded-[1.5rem] transition-all ${
                tab === "pending"
                  ? "bg-white text-slate-900 shadow-md"
                  : "text-slate-500 hover:text-slate-700"
              }`}
            >
              가입 대기 ({pendingMembers.length})
            </button>
          )}
        </nav>

        <div className="p-6">
          {tab === "info" ? (
            <div className="space-y-3">
              {members.length === 0 ? (
                <p className="py-24 text-center text-slate-400 font-bold">
                  멤버 정보가 없습니다.
                </p>
              ) : (
                members.map((member) => (
                  <div
                    key={member.memberId}
                    className="flex items-center justify-between p-8 rounded-[2rem] hover:bg-slate-50 group transition-all"
                  >
                    <div className="flex items-center gap-5">
                      <div className="w-14 h-14 bg-slate-900 text-white rounded-2xl flex items-center justify-center font-black text-xl">
                        {member.nickName?.[0]?.toUpperCase()}
                      </div>
                      <div>
                        <div className="flex items-center gap-3">
                          <p className="text-lg font-black text-slate-900">
                            {member.nickName}
                          </p>
                          {String(member.userId) === String(group.leaderId) && (
                            <span className="px-3 py-1 bg-amber-100 text-amber-700 text-[10px] font-black rounded-lg">
                              방장
                            </span>
                          )}
                        </div>
                        <p className="text-xs font-black text-slate-400 mt-1 uppercase">
                          Study Member
                        </p>
                      </div>
                    </div>
                    {isLeader &&
                      String(member.userId) !== String(user?.userId) && (
                        <div className="flex gap-3 opacity-0 group-hover:opacity-100 transition-all">
                          <button
                            onClick={() => handleChangeLeader(member.userId)}
                            className="px-5 py-2.5 text-xs font-black text-slate-600 hover:bg-white rounded-xl"
                          >
                            위임
                          </button>
                          <button
                            onClick={() => handleKick(member.userId)}
                            className="px-5 py-2.5 text-xs font-black text-rose-500 hover:bg-rose-50 rounded-xl"
                          >
                            추방
                          </button>
                        </div>
                      )}
                  </div>
                ))
              )}
            </div>
          ) : (
            <div className="space-y-4">
              {pendingMembers.length === 0 ? (
                <p className="py-24 text-center text-slate-400 font-bold">
                  새로운 가입 신청이 없습니다.
                </p>
              ) : (
                pendingMembers.map((member) => (
                  <div
                    key={member.memberId}
                    className="flex items-center justify-between p-8 rounded-[2rem] bg-slate-50 border border-slate-100"
                  >
                    <div className="flex items-center gap-5">
                      <div className="w-14 h-14 bg-white border border-slate-200 text-slate-900 rounded-2xl flex items-center justify-center font-black text-xl">
                        {member.nickName?.[0]?.toUpperCase()}
                      </div>
                      <p className="text-lg font-black text-slate-900">
                        {member.nickName}
                      </p>
                    </div>
                    <div className="flex gap-3">
                      <button
                        onClick={() => handleAccept(member.userId)}
                        className="px-7 py-3.5 bg-slate-900 text-white text-sm font-black rounded-xl hover:bg-black transition-all"
                      >
                        수락
                      </button>
                      <button
                        onClick={() => handleReject(member.userId)}
                        className="px-7 py-3.5 bg-white border border-slate-300 text-slate-600 text-sm font-black rounded-xl hover:bg-slate-100 transition-all"
                      >
                        거절
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default StudyGroupDetailPage;
