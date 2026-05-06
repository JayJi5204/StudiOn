import React, { useState } from "react";

interface PasswordModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (password: string) => void;
}

const PasswordModal = ({ isOpen, onClose, onSubmit }: PasswordModalProps) => {
  const [password, setPassword] = useState("");

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!password.trim()) return;
    onSubmit(password);
    setPassword("");
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4">
      <form
        onSubmit={handleSubmit}
        className="bg-white w-full max-w-sm rounded-[2.5rem] p-10 shadow-2xl animate-in zoom-in-95 duration-200"
      >
        <div className="text-center mb-8">
          <span className="text-4xl block mb-4">🔐</span>
          <h2 className="text-xl font-black text-slate-900">비밀번호 입력</h2>
          <p className="text-sm font-bold text-slate-400 mt-2">
            비공개 스터디룸입니다.
          </p>
        </div>

        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="••••"
          autoFocus
          className="w-full bg-slate-50 border-2 border-slate-100 rounded-2xl px-6 py-4 text-center text-2xl font-black tracking-[0.5em] focus:outline-none focus:border-blue-600 transition-all mb-6"
        />

        <div className="flex gap-2">
          <button
            type="button"
            onClick={() => {
              setPassword("");
              onClose();
            }}
            className="flex-1 py-4 bg-slate-100 text-slate-400 rounded-xl font-black text-sm hover:bg-slate-200 transition-colors"
          >
            취소
          </button>
          <button
            type="submit"
            className="flex-1 py-4 bg-blue-600 text-white rounded-xl font-black text-sm hover:bg-blue-700 transition-colors shadow-lg shadow-blue-200"
          >
            확인
          </button>
        </div>
      </form>
    </div>
  );
};

export default PasswordModal;
