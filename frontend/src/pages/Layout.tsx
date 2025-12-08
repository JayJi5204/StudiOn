import { Outlet,useNavigate } from "react-router";
import {BookOpen} from 'lucide-react';
import {Link } from "react-router-dom";
import { getCurrentUser,logout } from "../services/auth.service";
import {useEffect, useState } from "react";
import useUserInfoStore from "../common/userInfoStore";
import { LogOut } from "lucide-react";

function Layout() {
  const currentUser = getCurrentUser()
  let navigate = useNavigate();

  const [isLoggedIn,setIsLoggedIn] = useState<boolean>(false);
  const {userInfo} = useUserInfoStore();

  useEffect(() => {
      // 설정 코드
      setIsLoggedIn(!!currentUser);
      return () => {
        //정리 코드  
        setIsLoggedIn(false);
      }
  }, [currentUser]);

  const LogoutContent = () => {
    return (
      <div className="flex space-x-4">
        <button className="text-gray-600 hover:text-indigo-600 transition-colors">
          <Link to="/login">로그인</Link>
        </button>
        <button className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition-colors">
          <Link to="/signup">회원가입</Link>
        </button>
      </div>
    );
  ;}

  const LoginedContent = () => {
    return (
      <div className="flex space-x-4">
        <div className="relative inline-block hover:bg-red-50 mt-6 mb-6">{userInfo.username}님</div>
        
        <button
          onClick={() => {
            navigate(`/profile/${userInfo.id}`);
          }}
          className="rounded-xl hover:bg-red-50 transition-colors font-medium"
        >
            <div className='w-16 h-16 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-full flex items-center justify-center text-6xl mb-4 shadow-lg ring-4 ring-indigo-300/50'>
                {userInfo.avatar}
            </div>
        </button>

        <button
            onClick={() => {
                logout();
                navigate('/login');
            }}
            className='items-center px-4 py-3 text-red-600 hover:bg-red-50 rounded-xl transition-colors font-medium'
        >
            <LogOut className="w-5 h-5" />
        </button>
      </div>
    );
  };

  const renderLoginContent = () => {
    switch (isLoggedIn) {
      case true:
        return <LoginedContent/>
      default:
        return <LogoutContent/>
    }
  }

  return (
    <>
      <header className="bg-white shadow-md">
        <div className="max-w-full mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-4">
              <div className="text-2xl font-bold text-indigo-600 flex items-center">
                <BookOpen className="mr-2" />
                StudyTogether
              </div>
            </div>
            <nav className="hidden md:flex space-x-8">
              <a href="#" className="text-gray-600 hover:text-indigo-600 transition-colors">스터디 찾기</a>
              <a href="#" className="text-gray-600 hover:text-indigo-600 transition-colors">스터디 만들기</a>
              <a href="#" className="text-gray-600 hover:text-indigo-600 transition-colors">내 스터디</a>
              <a href="#" className="text-gray-600 hover:text-indigo-600 transition-colors">커뮤니티</a>
            </nav>
            {}
            {renderLoginContent()}
          </div>
        </div>
      </header>
      <main>
        <Outlet />
      </main>
      {/* Footer */}
      <footer className="bg-gray-800 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <div className="text-2xl font-bold mb-4 flex items-center">
                <BookOpen className="mr-2" />
                StudyTogether
              </div>
              <p className="text-gray-300">함께 성장하는 온라인 스터디 플랫폼</p>
            </div>
            <div>
              <h4 className="font-semibold mb-4">서비스</h4>
              <ul className="space-y-2 text-gray-300">
                <li><a href="#" className="hover:text-white">스터디 찾기</a></li>
                <li><a href="#" className="hover:text-white">스터디 만들기</a></li>
                <li><a href="#" className="hover:text-white">커뮤니티</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">지원</h4>
              <ul className="space-y-2 text-gray-300">
                <li><a href="#" className="hover:text-white">고객센터</a></li>
                <li><a href="#" className="hover:text-white">이용가이드</a></li>
                <li><a href="#" className="hover:text-white">FAQ</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">회사</h4>
              <ul className="space-y-2 text-gray-300">
                <li><a href="#" className="hover:text-white">회사소개</a></li>
                <li><a href="#" className="hover:text-white">개인정보처리방침</a></li>
                <li><a href="#" className="hover:text-white">이용약관</a></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-600 mt-8 pt-8 text-center text-gray-300">
            <p>&copy; 2024 StudyTogether. All rights reserved.</p>
          </div>
        </div>
    </footer>
    </>
  );
}

export default Layout;
