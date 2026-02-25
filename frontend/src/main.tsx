import { createRoot } from "react-dom/client";
import Router from "./router/Router.tsx";
import { RouterProvider } from "react-router";
import "./index.css";
import { GoogleOAuthProvider} from '@react-oauth/google';
import React from "react";

const clientId = import.meta.env.VITE_REACT_APP_GOOGLE_CLIENT_ID || '';

async function enableMocking() {
  
  //Vite 환경에서는 .DEV를 사용한다.
  if (!import.meta.env.DEV) {
    return;
  }

  const { worker } = await import('./mocks/browser');

  // `onUnhandledRequest` 옵션을 추가하면 
  // 실제 API와 모킹된 API가 섞여 있을 때 경고를 방지할 수 있습니다.
  return worker.start({
    onUnhandledRequest: 'bypass', 
  });
}

enableMocking().then( ()=> {
  createRoot(document.getElementById("root")!).render(
    <React.StrictMode>
      <GoogleOAuthProvider clientId={clientId}>
        <RouterProvider router={Router}></RouterProvider>
      </GoogleOAuthProvider>
    </React.StrictMode>
  );
})
