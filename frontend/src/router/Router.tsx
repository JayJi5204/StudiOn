import { lazy, Suspense } from "react";
import { createBrowserRouter } from "react-router";
import Layout from "../pages/Layout.tsx";

const Main = lazy(() => import("../pages/MainPage.tsx"));
const Loading = lazy(() => import("../pages/LoadingPage.tsx"));
const TestPage = lazy(() => import("../pages/TestPage.tsx"));
const Login = lazy(() => import("../components/Login.tsx"));
const Register = lazy(() => import("../components/Register.tsx"));
const Profile = lazy(() => import("../components/Profile.tsx"));
const BoardUser = lazy(() => import("../components/BoardUser.tsx"));
const BoardModerator = lazy(() => import("../components/BoardModerator.tsx"));
const BoardAdmin = lazy(() => import("../components/BoardAdmin.tsx"));

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
    path: "/login",
    Component:Layout,
    children:[
      { 
        index:true,
        element: (
          <Suspense fallback={<Loading />}>
            <Login />
          </Suspense>
        ),
      }
    ]
  },
  {
    path:"/register",
    Component:Layout,
    children:[
      {
        index:true,
        element: (
          <Suspense fallback={<Loading />}>
            <Register />
          </Suspense>
        ),
      }
    ]
  },
  {
    path:"/profile",
    Component:Layout,
    children:[
      {
        index:true,
        element: (
          <Suspense fallback={<Loading />}>
            <Profile />
          </Suspense>
        ),
      }
    ]
  },
  {
    path:"/user",
    Component:Layout,
    children:[
      {
        index:true,
        element: (
          <Suspense fallback={<Loading />}>
            <BoardUser />
          </Suspense>
        ) 
      }
    ]
  },
  {
    path:"/mod",
    Component:Layout,
    children:[
      {
        index:true,
        element: (
          <Suspense fallback={<Loading />}>
            <BoardModerator />
          </Suspense>
        ),
      }
    ]
  },
  {
    path:"/admin",
    Component:Layout,
    children:[
      {
        index:true,
        element: (
          <Suspense fallback={<Loading />}>
            <BoardAdmin />
          </Suspense>
        ),
      }
    ]
  },
]);

export default Router;
