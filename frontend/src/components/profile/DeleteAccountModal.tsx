import { useState } from "react";
import { userApi } from "../../api/userApi";
import useAuthStore from "../../stores/authStore";
import { useNavigate } from "react-router-dom";

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

const DeleteAccountModal = ({ isOpen, onClose }: Props) => {
  const navigate = useNavigate();
  const { logout } = useAuthStore();
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleDelete = async () => {
    if (!password.trim()) return;
    setLoading(true);
    setError("");
    try {
      await userApi.deleteUser({ password });
      logout();
      navigate("/");
    } catch {
      setError("비밀번호가 올바르지 않습니다.");
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-md flex items-center justify-center z-[200] px-4 animate-in fade-in duration-300">
      <div className="bg-white rounded-[3rem] p-10 md:p-12 w-full max-w-md shadow-[0_30px_60px_rgba(0,0,0,0.2)] border border-slate-100 animate-in zoom-in-95 duration-300">
        <div className="w-16 h-16 bg-rose-50 rounded-[1.5rem] flex items-center justify-center text-3xl mb-8">
          ⚠️
        </div>

        <h2 className="text-3xl font-black text-slate-900 mb-3 tracking-tight">
          회원 탈퇴
        </h2>
        <p className="text-sm font-bold text-slate-400 mb-10 leading-relaxed">
          탈퇴 시 모든 학습 데이터와 활동 내역이{" "}
          <span className="text-rose-500">영구적으로 삭제</span>되며 복구할 수
          없습니다. 계속하시려면 비밀번호를 입력해 주세요.
        </p>

        <div className="space-y-4">
          <div className="space-y-2">
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-1">
              Confirm Password
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="비밀번호를 입력하세요"
              className="w-full px-6 py-5 bg-slate-50 border border-slate-100 rounded-[1.5rem] text-sm font-black focus:outline-none focus:bg-white focus:border-rose-500 focus:ring-4 focus:ring-rose-500/5 transition-all"
            />
          </div>

          {error && (
            <p className="text-xs font-bold text-rose-500 ml-1 animate-bounce-short">
              {error}
            </p>
          )}

          <div className="flex gap-4 pt-6">
            <button
              onClick={onClose}
              className="flex-1 py-5 bg-slate-100 text-slate-400 rounded-2xl text-xs font-black uppercase tracking-widest hover:bg-slate-200 transition-all active:scale-95"
            >
              취소
            </button>
            <button
              onClick={handleDelete}
              disabled={loading || !password.trim()}
              className="flex-1 py-5 bg-rose-500 text-white rounded-2xl text-xs font-black uppercase tracking-widest hover:bg-rose-600 shadow-xl shadow-rose-100 transition-all disabled:opacity-50 active:scale-95"
            >
              {loading ? "처리 중..." : "탈퇴하기"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DeleteAccountModal;
