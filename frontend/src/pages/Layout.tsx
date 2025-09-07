import { Outlet,Link} from "react-router-dom";
import { useState, useEffect } from "react";
import * as AuthService from "../services/auth.service";
import type IUser from '../types/user.type';
import EventBus from "../common/EventBus";

export default function Layout() {
  const [showModeratorBoard, setShowModeratorBoard] = useState<boolean>(false);
  const [showAdminBoard, setShowAdminBoard] = useState<boolean>(false);
  const [currentUser, setCurrentUser] = useState<IUser | undefined>(undefined);

  useEffect(() => {
    const user = AuthService.getCurrentUser();

    if (user) {
      setCurrentUser(user);
      setShowModeratorBoard(user.roles.includes("ROLE_MODERATOR"));
      setShowAdminBoard(user.roles.includes("ROLE_ADMIN"));
    }

    EventBus.on("logout", logOut);

    return () => {
      EventBus.remove("logout", logOut);
    };
  }, []);

  const logOut = () => {
    AuthService.logout();
    setShowModeratorBoard(false);
    setShowAdminBoard(false);
    setCurrentUser(undefined);
  };

  return (
    <div className="min-h-screen flex flex-col">
      <header className="bg-blue-500 text-white p-4 flex justify-between">
        <h1 className="text-xl font-bold">온라인 공부 플랫폼</h1>
        <nav className="flex gap-4">
          {showModeratorBoard && (
            <li>
              <Link to={"/mod"} className="text-gray-300 hover:text-white transition-colors">
                Moderator Board
              </Link>
            </li>
          )}
          {showAdminBoard && (
            <li>
              <Link to={"/admin"} className="text-gray-300 hover:text-white transition-colors">
                Admin Board
              </Link>
            </li>
          )}
          {currentUser && (
            <li>
              <Link to={"/user"} className="text-gray-300 hover:text-white transition-colors">
                User
              </Link>
            </li>
          )}
          {currentUser ? (
          <ul className="flex space-x-4">
            <li>
              <Link to={"/profile"} className="hover:underline">
                {currentUser.username}
              </Link>
            </li>
            <li>
              <a
                href="/login"
                className="hover:underline"
                onClick={logOut}
              >
                LogOut
              </a>
            </li>
          </ul>
        ) : (
          <ul className="flex space-x-4">
            <li>
              <Link to={"/login"} className="hover:underline">Login</Link>
            </li>
            <li>
              <Link to={"/register"} className="hover:underline">Sign up</Link>
            </li>
          </ul>
        )}

          {/* <Link to="/study" className="hover:underline">스터디룸</Link>
          <Link to="/report" className="hover:underline">리포트</Link>
           */}
        </nav>
      </header>
      <main className="flex-1 p-6">
        <Outlet /> {/* 자식 페이지가 렌더링될 자리 */}
      </main>
    
      
    </div>
  );
}

