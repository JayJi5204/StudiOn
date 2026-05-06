import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { studyGroupApi } from "../../api/studyGroupApi";
import { roomApi } from "../../api/roomApi";

interface InviteCodeModalProps {
  isOpen: boolean;
  onClose: () => void;
  type: "ROOM" | "GROUP";
}

const InviteCodeModal = ({ isOpen, onClose, type }: InviteCodeModalProps) => {
  const navigate = useNavigate();
  const [inviteCode, setInviteCode] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen) return null;

  const handleInviteEnter = async (e: React.FormEvent) => {
    e.preventDefault();
    const cleanCode = inviteCode.trim().toUpperCase();
    if (!cleanCode || isSubmitting) return;

    setIsSubmitting(true);
    try {
      if (type === "GROUP") {
        const res = await studyGroupApi.getGroupByInviteCode(cleanCode);
        if (res.data && res.data.groupId) {
          onClose();
          setInviteCode("");
          navigate(`/study-group/${res.data.groupId}`);
        }
      } else {
        const res = await roomApi.getRoomByInviteCode(cleanCode);
        if (res.data && res.data.roomId) {
          onClose();
          setInviteCode("");
          navigate(`/study/${res.data.roomId}/room`);
        }
      }
    } catch (err: any) {
      console.error(`${type} 입장 실패:`, err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className="bg-white w-full max-w-md rounded-[3rem] p-10 shadow-2xl animate-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-slate-50 rounded-3xl flex items-center justify-center mx-auto mb-4">
            <span className="text-2xl">{type === "GROUP" ? "👥" : "🔑"}</span>
          </div>
          <h2 className="text-2xl font-black text-slate-900 tracking-tight">
            {type === "GROUP" ? "비공개 그룹 입장" : "비공개 스터디룸 입장"}
          </h2>
          <p className="text-sm font-bold text-slate-400 mt-2">
            공유받은 초대코드를 입력해 주세요.
          </p>
        </div>

        <form onSubmit={handleInviteEnter} className="space-y-4">
          <input
            type="text"
            value={inviteCode}
            onChange={(e) => setInviteCode(e.target.value.toUpperCase())}
            placeholder="코드 입력"
            maxLength={20}
            autoFocus
            className="w-full bg-slate-50 border-2 border-slate-100 rounded-2xl px-6 py-5 text-center text-xl font-black tracking-[0.3em] focus:outline-none focus:border-slate-900 focus:bg-white transition-all placeholder:tracking-normal placeholder:text-sm placeholder:font-bold text-slate-900"
          />
          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-4 bg-white border border-slate-200 text-slate-400 rounded-2xl font-black text-sm hover:bg-slate-50 transition-all"
            >
              취소
            </button>
            <button
              type="submit"
              disabled={inviteCode.length < 2 || isSubmitting}
              className="flex-[1.5] py-4 bg-slate-900 text-white rounded-2xl font-black text-sm hover:bg-black transition-all shadow-xl shadow-slate-200 disabled:opacity-30 disabled:hover:translate-y-0"
            >
              {isSubmitting ? "확인 중..." : "입장하기"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default InviteCodeModal;
