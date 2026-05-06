import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { roomApi } from "../../api/roomApi";
import type { CreateRoomRequest } from "../../types/room.type";

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

const StudyRoomCreateModal = ({ isOpen, onClose }: Props) => {
  const navigate = useNavigate();
  const [createLoading, setCreateLoading] = useState(false);
  const [form, setForm] = useState<CreateRoomRequest>({
    roomName: "",
    isPrivate: false,
    password: "",
  });

  if (!isOpen) return null;

  const handleCreate = async () => {
    if (!form.roomName.trim()) return;
    setCreateLoading(true);
    try {
      const res = await roomApi.createRoom({
        ...form,
        password: form.isPrivate ? form.password : undefined,
      });
      navigate(`/study/${res.data.roomId}/room`);
    } catch {
      alert("방 생성에 실패했습니다.");
    } finally {
      setCreateLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-6">
      {/* 배경 오버레이 */}
      <div
        className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* 모달 본체 */}
      <div className="relative w-full max-w-xl bg-white rounded-[3rem] p-10 shadow-2xl animate-in zoom-in-95 duration-200">
        <h2 className="text-3xl font-black text-slate-900 tracking-tight mb-8">
          새 스터디룸 만들기
        </h2>

        <div className="space-y-8">
          <div className="space-y-2">
            <label className="text-xs font-black text-slate-400 ml-1">
              방 이름
            </label>
            <input
              type="text"
              value={form.roomName}
              onChange={(e) => setForm({ ...form, roomName: e.target.value })}
              placeholder="어떤 공부를 할 예정인가요?"
              className="w-full px-6 py-4 bg-slate-50 border-none rounded-2xl text-sm font-bold focus:ring-2 focus:ring-slate-600 outline-none transition-all"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            {[false, true].map((val) => (
              <button
                key={String(val)}
                onClick={() => setForm({ ...form, isPrivate: val })}
                className={`py-4 rounded-2xl text-sm font-black transition-all ${
                  form.isPrivate === val
                    ? "bg-slate-900 text-white shadow-lg"
                    : "bg-slate-50 text-slate-400 hover:bg-slate-100"
                }`}
              >
                {val ? "비공개 방" : "공개 방"}
              </button>
            ))}
          </div>

          {form.isPrivate && (
            <div className="space-y-2 animate-in fade-in slide-in-from-top-2">
              <label className="text-xs font-black text-slate-400 ml-1">
                비밀번호 설정
              </label>
              <input
                type="password"
                value={form.password}
                onChange={(e) => setForm({ ...form, password: e.target.value })}
                placeholder="4~20자 이내"
                className="w-full px-6 py-4 bg-slate-50 border-none rounded-2xl text-sm font-bold focus:ring-2 focus:ring-slate-600 outline-none transition-all"
              />
            </div>
          )}

          <div className="flex gap-3 pt-4">
            <button
              onClick={onClose}
              className="flex-1 py-5 bg-slate-100 text-slate-500 rounded-2xl font-black text-base hover:bg-slate-200 transition-all"
            >
              취소
            </button>
            <button
              onClick={handleCreate}
              disabled={createLoading || !form.roomName.trim()}
              className="flex-[2] py-5 bg-slate-900 text-white rounded-2xl font-black text-bas shadow-xl transition-all active:scale-95 disabled:opacity-30"
            >
              {createLoading ? "생성 중..." : "스터디 시작하기"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StudyRoomCreateModal;
