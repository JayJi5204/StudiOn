import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { userApi } from "../../api/userApi";
import useAuthStore from "../../stores/authStore";

const SignInPage = () => {
  const navigate = useNavigate();
  const { setUser } = useAuthStore();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await userApi.login({ email, password });
      setUser({
        userId: res.data.userId,
        email: res.data.email,
        nickName: res.data.nickName,
        role: res.data.role,
      });
      navigate("/");
    } catch {
      setError("이메일 또는 비밀번호가 올바르지 않아요.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#F8FAFC] px-4 font-['Pretendard_Variable']">
      <div className="w-full max-w-[440px]">
        {/* 상단 로고 & 환영 문구 */}
        <div className="text-center mb-10">
          <Link
            to="/"
            className="inline-block text-3xl font-black text-slate-900 tracking-tighter mb-4"
          >
            StudiOn<span className="text-indigo-600">.</span>
          </Link>
          <h2 className="text-xl font-black text-slate-900 tracking-tight">
            반가워요! 다시 오셨군요
          </h2>
          <p className="text-xs font-bold text-slate-400 mt-2 uppercase tracking-widest">
            오늘의 학습 여정을 시작해볼까요?
          </p>
        </div>

        {/* 로그인 카드 */}
        <div className="bg-white p-10 md:p-12 rounded-[3rem] border border-slate-200 shadow-xl shadow-slate-200/50">
          <form onSubmit={handleSubmit} className="flex flex-col gap-6">
            {/* 이메일 입력 */}
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

            {/* 비밀번호 입력 */}
            <div className="space-y-2">
              <div className="flex justify-between items-center ml-1">
                <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest">
                  비밀번호
                </label>
              </div>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
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
              className="w-full bg-slate-900 text-white py-5 rounded-2xl font-black text-sm uppercase tracking-[0.2em] hover:bg-slate-800 hover:-translate-y-1 transition-all active:scale-95 shadow-xl shadow-slate-200 disabled:opacity-50 disabled:translate-y-0"
            >
              {loading ? "인증 중..." : "로그인하기"}
            </button>
          </form>

          {/* 하단 링크 */}
          <div className="mt-10 pt-8 border-t border-slate-50 text-center">
            <p className="text-xs font-bold text-slate-400 tracking-wider">
              아직 계정이 없으신가요?{" "}
              <Link
                to="/signup"
                className="text-slate-900 hover:text-indigo-600 transition-colors ml-2 underline underline-offset-4 decoration-2"
              >
                회원가입하기
              </Link>
            </p>
          </div>
        </div>

        {/* 푸터 문구 */}
        <p className="text-center mt-8 text-[10px] font-black text-slate-300 uppercase tracking-[0.3em]">
          보안 접속 프로토콜 v3.0 활성화됨
        </p>
      </div>
    </div>
  );
};

export default SignInPage;
