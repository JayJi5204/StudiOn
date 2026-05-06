import { Link } from "react-router-dom";

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-[#0A0A0A] text-slate-500 mt-auto border-t border-white/5">
      <div className="max-w-7xl mx-auto px-8 py-16">
        <div className="flex flex-col lg:flex-row justify-between items-start gap-12">
          {/* 브랜드 섹션 */}
          <div className="max-w-xs">
            <Link to="/" className="group flex items-center gap-2 mb-6">
              <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform shadow-lg shadow-white/5">
                <span className="text-black font-black text-sm">S</span>
              </div>
              <span className="text-xl font-black text-white tracking-tighter">
                Studi<span>On</span>
              </span>
            </Link>
            <p className="text-[13px] leading-relaxed mb-6 font-bold text-slate-400">
              함께하는 힘을 믿습니다. <br />
              웹캠 기반의 몰입형 스터디 공간에서 <br />
              당신의 더 나은 내일을 기록하세요.
            </p>
          </div>

          {/* 사이트 맵 링크 */}
          <div className="grid grid-cols-2 md:grid-cols-3 gap-12 lg:gap-24">
            <div className="flex flex-col gap-5">
              <span className="text-[10px] font-black text-white uppercase tracking-[0.2em] opacity-50">
                서비스
              </span>
              <nav className="flex flex-col gap-3 text-[13px] font-bold">
                <Link
                  to="/study"
                  className="hover:text-white transition-colors"
                >
                  라이브 스터디
                </Link>
                <Link
                  to="/study-group"
                  className="hover:text-white transition-colors"
                >
                  스터디 그룹
                </Link>
                <Link
                  to="/board"
                  className="hover:text-white transition-colors"
                >
                  커뮤니티
                </Link>
                <Link
                  to="/ranking"
                  className="hover:text-white transition-colors"
                >
                  랭킹
                </Link>
              </nav>
            </div>

            <div className="flex flex-col gap-5">
              <span className="text-[10px] font-black text-white uppercase tracking-[0.2em] opacity-50">
                고객지원
              </span>
              <nav className="flex flex-col gap-3 text-[13px] font-bold">
                <a href="#" className="hover:text-white transition-colors">
                  고객센터
                </a>
                <a href="#" className="hover:text-white transition-colors">
                  이용약관
                </a>
                <a href="#" className="hover:text-white transition-colors">
                  개인정보 처리방침
                </a>
              </nav>
            </div>
          </div>
        </div>

        {/* 하단 저작권 섹션 */}
        <div className="mt-20 pt-8 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-[10px] font-black uppercase tracking-widest text-slate-600">
            © {currentYear} StudiOn. 몰입하는 즐거움을 위해 제작되었습니다.
          </p>
          <div className="flex items-center gap-6">
            <span className="text-[10px] font-black text-slate-700 uppercase tracking-widest">
              React & SpringBoot 기반
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
