import { lazy, Suspense } from "react";
import { createBrowserRouter } from "react-router";

const Main = lazy(() => import("../pages/MainPage.tsx"));
const Layout = lazy(() => import('../pages/Layout.tsx'))
const Loading = lazy(() => import("../pages/LoadingPage.tsx"));
const TestPage = lazy(() => import("../pages/TestPage.tsx"));
const FreeBulletinBoard = lazy(() => import("../pages/FreeBulletinBoard.tsx"));
const SignIn = lazy(() => import("../pages/SignIn.tsx"));
const SignUp = lazy(() => import("../pages/SignUp.tsx"));
const Profile = lazy(() => import("../pages/Profile.tsx"));
const GoogleCallback = lazy(() => import("../api/GoogleCallback.tsx"));

const Router = createBrowserRouter([
  {
    path: import.meta.env.VITE_REACT_APP_URL,
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
    path: import.meta.env.VITE_REACT_APP_URL_SIGNIN,
    Component: Layout,
    children: [
      {
        index: true,
        element: (
          <Suspense fallback={<Loading />}>
            <SignIn/>
          </Suspense>
        ),
      },
    ],
  },
  {
    path: import.meta.env.VITE_REACT_APP_URL_SIGNUP,
    Component: Layout,
    children: [
      {
        index: true,
        element: (
          <Suspense fallback={<Loading />}>
            <SignUp/>
          </Suspense>
        ),
      },
    ],
  },
  {
    path: `${import.meta.env.VITE_REACT_APP_URL_PROFILE}:id`,
    Component: Layout,
    children: [
      {
        index: true,
        element: (
          <Suspense fallback={<Loading />}>
            <Profile />
          </Suspense>
        ),
      },
    ],
  },
  {
    path:"/api/auth/callback/google",
    children:[
      {
        index:true,
        element:(
          <Suspense fallback={<Loading />}>
            <GoogleCallback />
          </Suspense>
        ),
      },
    ],
  }
]);

export default Router;
