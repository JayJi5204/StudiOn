import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { userApi } from "../../api/userApi";

const SignUpPage = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [nickName, setNickName] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (password !== confirmPassword) {
      setError("비밀번호가 일치하지 않아요.");
      return;
    }

    setLoading(true);
    try {
      await userApi.signup({ email, password, nickName, phoneNumber });
      navigate("/signin");
    } catch {
      setError("회원가입에 실패했어요. 다시 시도해주세요.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#F8FAFC] px-4 py-20 font-['Pretendard_Variable']">
      <div className="w-full max-w-[480px]">
        {/* 상단 로고 & 안내 문구 */}
        <div className="text-center mb-10">
          <Link
            to="/"
            className="inline-block text-3xl font-black text-slate-900 tracking-tighter mb-4"
          >
            StudiOn<span className="text-indigo-600">.</span>
          </Link>
          <h2 className="text-xl font-black text-slate-900 tracking-tight">
            새로운 여정의 시작
          </h2>
          <p className="text-xs font-bold text-slate-400 mt-2 uppercase tracking-widest">
            StudiOn의 커뮤니티에 합류하세요
          </p>
        </div>

        {/* 회원가입 카드 */}
        <div className="bg-white p-10 md:p-12 rounded-[3rem] border border-slate-200 shadow-xl shadow-slate-200/50">
          <form onSubmit={handleSubmit} className="flex flex-col gap-6">
            {/* 이메일 섹션 */}
            <div className="space-y-2">
              <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest ml-1">
                이메일 주소
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="name@example.com"
                required
                className="w-full px-6 py-4 bg-slate-50 border border-slate-100 rounded-2xl text-sm font-bold focus:outline-none focus:bg-white focus:border-slate-900 focus:ring-4 focus:ring-slate-100 transition-all placeholder:text-slate-300"
              />
            </div>

            {/* 비밀번호 섹션 */}
            <div className="space-y-2">
              <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest ml-1">
                비밀번호
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="8자 이상 입력해주세요"
                required
                className="w-full px-6 py-4 bg-slate-50 border border-slate-100 rounded-2xl text-sm font-bold focus:outline-none focus:bg-white focus:border-slate-900 focus:ring-4 focus:ring-slate-100 transition-all placeholder:text-slate-300"
              />
            </div>

            {/* 비밀번호 확인 섹션 */}
            <div className="space-y-2">
              <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest ml-1">
                비밀번호 확인
              </label>
              <input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="비밀번호를 한번 더 입력해주세요"
                required
                className="w-full px-6 py-4 bg-slate-50 border border-slate-100 rounded-2xl text-sm font-bold focus:outline-none focus:bg-white focus:border-slate-900 focus:ring-4 focus:ring-slate-100 transition-all placeholder:text-slate-300"
              />
            </div>

            {/* 닉네임 섹션 */}
            <div className="space-y-2">
              <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest ml-1">
                닉네임
              </label>
              <input
                type="text"
                value={nickName}
                onChange={(e) => setNickName(e.target.value)}
                placeholder="활동하실 이름을 입력해주세요"
                required
                className="w-full px-6 py-4 bg-slate-50 border border-slate-100 rounded-2xl text-sm font-bold focus:outline-none focus:bg-white focus:border-slate-900 focus:ring-4 focus:ring-slate-100 transition-all placeholder:text-slate-300"
              />
            </div>

            {/* 전화번호 섹션 */}
            <div className="space-y-2">
              <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest ml-1">
                전화번호
              </label>
              <input
                type="tel"
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value)}
                placeholder="010-0000-0000"
                required
                className="w-full px-6 py-4 bg-slate-50 border border-slate-100 rounded-2xl text-sm font-bold focus:outline-none focus:bg-white focus:border-slate-900 focus:ring-4 focus:ring-slate-100 transition-all placeholder:text-slate-300"
              />
            </div>

            {error && (
              <div className="animate-shake">
                <p className="text-[11px] font-black text-rose-500 bg-rose-50 px-4 py-3 rounded-xl border border-rose-100 flex items-center gap-2">
                  <span className="text-lg">!</span> {error}
                </p>
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-slate-900 text-white py-5 rounded-2xl font-black text-sm uppercase tracking-[0.2em] hover:bg-slate-800 hover:-translate-y-1 transition-all active:scale-95 shadow-xl shadow-slate-200 disabled:opacity-50 disabled:translate-y-0 mt-2"
            >
              {loading ? "계정 생성 중..." : "시작하기"}
            </button>
          </form>

          {/* 하단 링크 */}
          <div className="mt-10 pt-8 border-t border-slate-50 text-center">
            <p className="text-xs font-bold text-slate-400 tracking-wider">
              이미 계정이 있으신가요?{" "}
              <Link
                to="/signin"
                className="text-slate-900 hover:text-indigo-600 transition-colors ml-2 underline underline-offset-4 decoration-2"
              >
                로그인하기
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignUpPage;
