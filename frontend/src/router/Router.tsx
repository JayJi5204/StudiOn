import { lazy, Suspense } from "react";
import { createBrowserRouter } from "react-router-dom";

const Layout = lazy(() => import("../pages/Layout"));
const LoadingPage = lazy(() => import("../pages/LoadingPage"));
const MainPage = lazy(() => import("../pages/MainPage"));
const SignInPage = lazy(() => import("../pages/User/SignInPage"));
const SignUpPage = lazy(() => import("../pages/User/SignUpPage"));
const BoardListPage = lazy(() => import("../pages/Board/BoardListPage"));
const BoardDetailPage = lazy(() => import("../pages/Board//BoardDetailPage"));
const BoardCreatePage = lazy(() => import("../pages/Board//BoardCreatePage"));
const BoardUpdatePage = lazy(() => import("../pages/Board//BoardUpdatePage"));
const StudyRoomListPage = lazy(
  () => import("../pages/StudyRoom/StudyRoomListPage"),
);
const StudyRoomPage = lazy(() => import("../pages/StudyRoom/StudyRoomPage"));
const ProfilePage = lazy(() => import("../pages/User/ProfilePage"));
const RankingPage = lazy(() => import("../pages/RankingPage"));
const AdminPage = lazy(() => import("../pages/AdminPage"));
const StudyGroupListPage = lazy(
  () => import("../pages/StudyGroup/StudyGroupListPage"),
);
const StudyGroupCreatePage = lazy(
  () => import("../pages/StudyGroup/StudyGroupCreatePage"),
);
const StudyGroupDetailPage = lazy(
  () => import("../pages/StudyGroup/StudyGroupDetailPage"),
);
const StudyGroupEditPage = lazy(
  () => import("../pages/StudyGroup/StudyGroupUpdatePage"),
);

const Loading = () => (
  <Suspense fallback={null}>
    <LoadingPage />
  </Suspense>
);

const Router = createBrowserRouter([
  {
    path: "/",
    Component: Layout,
    children: [
      {
        index: true,
        element: (
          <Suspense fallback={<Loading />}>
            <MainPage />
          </Suspense>
        ),
      },
      {
        path: "board",
        children: [
          {
            index: true,
            element: (
              <Suspense fallback={<Loading />}>
                <BoardListPage />
              </Suspense>
            ),
          },
          {
            path: ":boardId",
            element: (
              <Suspense fallback={<Loading />}>
                <BoardDetailPage />
              </Suspense>
            ),
          },
          {
            path: ":boardId/edit",
            element: (
              <Suspense fallback={<Loading />}>
                <BoardUpdatePage />
              </Suspense>
            ),
          },
        ],
      },
      {
        path: "write-post",
        element: (
          <Suspense fallback={<Loading />}>
            <BoardCreatePage />
          </Suspense>
        ),
      },
      {
        path: "study",
        children: [
          {
            index: true,
            element: (
              <Suspense fallback={<Loading />}>
                <StudyRoomListPage />
              </Suspense>
            ),
          },
          {
            path: ":roomId",
            children: [
              {
                path: "room",
                element: (
                  <Suspense fallback={<Loading />}>
                    <StudyRoomPage />
                  </Suspense>
                ),
              },
            ],
          },
        ],
      },
      {
        path: "study-group",
        children: [
          {
            index: true,
            element: (
              <Suspense fallback={<Loading />}>
                <StudyGroupListPage />
              </Suspense>
            ),
          },
          {
            path: "create",
            element: (
              <Suspense fallback={<Loading />}>
                <StudyGroupCreatePage />
              </Suspense>
            ),
          },
          {
            path: ":groupId",
            element: (
              <Suspense fallback={<Loading />}>
                <StudyGroupDetailPage />
              </Suspense>
            ),
          },
          {
            path: ":groupId/edit",
            element: (
              <Suspense fallback={<Loading />}>
                <StudyGroupEditPage />
              </Suspense>
            ),
          },
        ],
      },
      {
        path: "profile/:userId",
        element: (
          <Suspense fallback={<Loading />}>
            <ProfilePage />
          </Suspense>
        ),
      },
      {
        path: "ranking",
        element: (
          <Suspense fallback={<Loading />}>
            <RankingPage />
          </Suspense>
        ),
      },
      {
        path: "admin",
        element: (
          <Suspense fallback={<Loading />}>
            <AdminPage />
          </Suspense>
        ),
      },
    ],
  },
  {
    path: "signin",
    Component: Layout,
    children: [
      {
        index: true,
        element: (
          <Suspense fallback={<Loading />}>
            <SignInPage />
          </Suspense>
        ),
      },
    ],
  },
  {
    path: "signup",
    Component: Layout,
    children: [
      {
        index: true,
        element: (
          <Suspense fallback={<Loading />}>
            <SignUpPage />
          </Suspense>
        ),
      },
    ],
  },
]);

export default Router;
