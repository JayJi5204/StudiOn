import { lazy, Suspense } from "react";
import { createBrowserRouter } from "react-router";

const Main = lazy(() => import("../pages/MainPage.tsx"));
const Layout = lazy(() => import('../pages/Layout.tsx'))
const Loading = lazy(() => import("../pages/LoadingPage.tsx"));
const TestPage = lazy(() => import("../pages/TestPage.tsx"));
const CommunityBoardPage = lazy(() => import("../pages/CommunityBoardPage.tsx"));
const PostDetailsPage = lazy(() => import("../pages/PostDetailPage.tsx"));
const WritePostPage = lazy(() => import('../pages/WritePostPage.tsx'));
const SignInPage = lazy(() => import("../pages/SignInPage.tsx"));
const SignUpPage = lazy(() => import("../pages/SignUpPage.tsx"));
const ProfilePage = lazy(() => import("../pages/ProfilePage.tsx"));
const GoogleCallback = lazy(() => import("../components/OAuth/GoogleCallback.tsx"));

const layoutPageUrl = import.meta.env.VITE_REACT_APP_URL;
const communityPageUrl = import.meta.env.VITE_REACT_APP_URL_BOARD;
const writePostPageUrl = import.meta.env.VITE_REACT_APP_URL_WRITE_POST;
const updatePostPageUrl = `${import.meta.env.VITE_REACT_APP_URL_WRITE_UPDATE}/post/:id`;
const signinPageUrl = import.meta.env.VITE_REACT_APP_URL_SIGNIN;
const signupPageUrl = import.meta.env.VITE_REACT_APP_URL_SIGNUP;
const profilePageUrl = `${import.meta.env.VITE_REACT_APP_URL_PROFILE}/:id`;
const googleCallbackPageUrl = import.meta.env.VITE_REACT_APP_AUTH_API_URL_GOOGLE;

const Router = createBrowserRouter([
  {
    path: layoutPageUrl,
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
    path: communityPageUrl,
    Component: Layout,
    children: [
      {
        index: true,
        element: (
          <Suspense fallback={<Loading />}>
            <CommunityBoardPage />
          </Suspense>
        ),
      },
      {
        path:":id",
        element: (
          <Suspense fallback={<Loading />}>
            <PostDetailsPage/> 
          </Suspense>
        ),
      }
    ],
  },
  {
    path: writePostPageUrl,
    Component: Layout,
    children: [
      {
        index: true,
        element: (
          <Suspense fallback={<Loading/>}>
              <WritePostPage/>
          </Suspense>
        )
      }
    ]
  },
  {
    path: updatePostPageUrl,
    Component: Layout,
    children: [
      {
        index: true,
        element: (
          <Suspense fallback={<Loading/>}>
              <WritePostPage/>
          </Suspense>
        )
      }
    ]    
  },
  {
    path: signinPageUrl,
    Component: Layout,
    children: [
      {
        index: true,
        element: (
          <Suspense fallback={<Loading />}>
            <SignInPage/>
          </Suspense>
        ),
      },
    ],
  },
  {
    path: signupPageUrl,
    Component: Layout,
    children: [
      {
        index: true,
        element: (
          <Suspense fallback={<Loading />}>
            <SignUpPage/>
          </Suspense>
        ),
      },
    ],
  },
  {
    path: profilePageUrl,
    Component: Layout,
    children: [
      {
        index: true,
        element: (
          <Suspense fallback={<Loading />}>
            <ProfilePage />
          </Suspense>
        ),
      },
      {
        path:"myBoards/:id",
        element: (
          <Suspense fallback={<Loading />}>
            <PostDetailsPage/> 
          </Suspense>
        ),
      }
    ],
  },
  {
    path:googleCallbackPageUrl,
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
