import { createRoot } from "react-dom/client";
import Router from "./router/router.tsx";
import { RouterProvider } from "react-router";

createRoot(document.getElementById("root")!).render(
  <RouterProvider router={Router}></RouterProvider>
);
