import { Outlet } from "react-router";

function Layout() {
  return (
    <>
      <header>여기는 헤더</header>
      <main>
        <Outlet />
      </main>
      <footer>여기는 푸터</footer>
    </>
  );
}

export default Layout;
