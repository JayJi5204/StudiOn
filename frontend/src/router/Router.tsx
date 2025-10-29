import { lazy, Suspense } from "react";
import { createBrowserRouter } from "react-router";
import Layout from "../pages/Layout.tsx";

const Main = lazy(() => import("../pages/MainPage.tsx"));
const Loading = lazy(() => import("../pages/LoadingPage.tsx"));
const TestPage = lazy(() => import("../pages/TestPage.tsx"));
const FreeBulletinBoard = lazy(() => import("../pages/FreeBulletinBoard"));
const Login = lazy(() => import("../pages/Login"));
const Register = lazy(() => import("../pages/Register"));

const Router = createBrowserRouter([
  {
    path: "/",
    Component: Layout,
    children: [
      {
        index: true,
        element: (
          <Suspense fallback={<Loading />}>
            <Main />
          </Suspense>
        ),
      },
      {
        path: "/test",
        element: (
          <Suspense fallback={<Loading />}>
            <TestPage />
          </Suspense>
        ),
      },
    ],
  },
  {
    path: "/freebulletinboard",
    Component: Layout,
    children: [
      {
        index: true,
        element: (
          <Suspense fallback={<Loading />}>
            <FreeBulletinBoard/>
          </Suspense>
        ),
      },
    ],
  },
  {
    path: "/login",
    Component: Layout,
    children: [
      {
        index: true,
        element: (
          <Suspense fallback={<Loading />}>
            <Login/>
          </Suspense>
        ),
      },
    ],
  },
  {
    path: "/signup",
    Component: Layout,
    children: [
      {
        index: true,
        element: (
          <Suspense fallback={<Loading />}>
            <Register/>
          </Suspense>
        ),
      },
    ],
  },
]);

export default Router;
