import { createRoot } from "react-dom/client";
import Router from "./router/Router.tsx";
import { RouterProvider } from "react-router";
import "./index.css";
createRoot(document.getElementById("root")!).render(
  <RouterProvider router={Router}></RouterProvider>
);
