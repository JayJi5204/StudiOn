import { lazy, Suspense } from "react";
import { createBrowserRouter } from "react-router";
import Layout from "../pages/Layout.tsx";
const Main = lazy(() => import("../pages/MainPage.tsx"));
const Loading = lazy(() => import("../pages/LoadingPage.tsx"));
const TestPage = lazy(() => import("../pages/TestPage.tsx"));

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
]);

export default Router;
