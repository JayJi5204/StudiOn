import { http, HttpResponse } from "msw";
import { POSTS_DB } from "../DB/postDB";
import type { IComment } from "../../types/posts.type";

const API_URL_COMMUNITY_BOARD = import.meta.env.VITE_REACT_APP_URL_BOARD

export const testViewCount = http.patch(`${API_URL_COMMUNITY_BOARD}/post/:id/views`, async ({ params }) => {
  const { id } = params;
  
  // 1. DB에서 해당 ID를 가진 포스트 찾기
  const postIndex = POSTS_DB.posts.findIndex(post => post.id === Number(id));

  if (postIndex !== -1) {
    // 2. 실제 데이터(메모리 내 DB) 업데이트
    POSTS_DB.posts[postIndex].views += 1;
    
    // 로그로 확인해보기 (터미널이나 브라우저 콘솔)
    console.log(`Post ${id} 조회수 증가 완료:`, POSTS_DB.posts[postIndex].views);

    return HttpResponse.json(
      { message: "조회수 업데이트 성공", updatedPost: POSTS_DB.posts[postIndex] },
      { status: 200 }
    );
  }

  // 포스트를 찾지 못한 경우 예외 처리
  return HttpResponse.json(
    { message: "포스트를 찾을 수 없습니다." },
    { status: 404 }
  );
});

export const testGetPostDetail = http.get(
  `${API_URL_COMMUNITY_BOARD}/post/:id`,
  ({ params }) => {
    const { id } = params;

    try {
      const post = POSTS_DB.posts.find((p) => p.id === Number(id));

      if (!post) {
        return new HttpResponse(null, {
          status: 404,
          statusText: "Post Not found",
        });
      }

      return HttpResponse.json(post, { status: 200 });
    } catch (error) {
      return HttpResponse.json({ message: "서버 에러" }, { status: 200 });
    }
  },
);

export const testDeletePost = http.delete(
  `${API_URL_COMMUNITY_BOARD}/post/:id`,
  ({ params }) => {
    const { id } = params;
    POSTS_DB.posts = POSTS_DB.posts.filter((post) => post.id !== Number(id));
    return new HttpResponse(null, { status: 204 }); //204 No Content
  },
);

export const testGetPosts = http.get(`${API_URL_COMMUNITY_BOARD}/posts`, ({ request }) => {
  // 1. URL 객체를 생성하여 쿼리 스트링을 파싱
  const url = new URL(request.url);
  const authorId = url.searchParams.get("authorId");

  console.log("실제 호출된 URL:", request.url);
  console.log("찾으려는 authorId:", authorId);

  try {
    // 2. authorId 쿼리가 있으면 필터링, 없으면 전체 목록 반환
    if (authorId) {
      const filtered_POSTS_DB = POSTS_DB.posts.filter(
        (post) => post.authorId === Number(authorId),
      );
      return HttpResponse.json(filtered_POSTS_DB, { status: 200 });
    }

    // 쿼리가 없으면 전체 DB 반환
    return HttpResponse.json(POSTS_DB, { status: 200 });
  } catch (error) {
    return HttpResponse.json({ message: "서버 에러" }, { status: 500 });
  }
});

export const testUpdatePost = http.patch(
  `${API_URL_COMMUNITY_BOARD}/post/:id`,
  async ({ params, request }) => {
    const { id } = params;
    const updateData = (await request.json()) as any; // 클라이언트가 보낸 수정 데이터

    // 1. DB에서 해당 ID를 가진 포스트의 인덱스 찾기
    const idx = POSTS_DB.posts.findIndex((post) => post.id === Number(id));

    // 2. 해당 포스트가 없을 경우 404 에러 반환
    if (idx === -1) {
      return new HttpResponse(null, {
        status: 404,
        statusText: "Post not found",
      });
    }

    // 3. 기존 데이터 유지 + 새로운 데이터로 덮어쓰기 (업데이트)
    POSTS_DB.posts[idx] = {
      ...POSTS_DB.posts[idx], // 기존 데이터 (id, author 등)
      ...updateData, // 수정된 데이터 (title, content 등)
    };

    console.log(`[MSW] ${id}번 게시글 수정 완료:`, POSTS_DB.posts[idx]);

    // 4. 업데이트된 전체 객체 반환
    return HttpResponse.json(id, { status: 200 });
  },
);

export const testCreatePost = http.post( `${API_URL_COMMUNITY_BOARD}/post`,
  async ({ request }) => {
    const newPost = (await request.json()) as IComment;
    
    const postWithId = {
      ...newPost,
      id: Number(POSTS_DB.posts.length) + 1,
      createdAt: new Date().toISOString().slice(0, 16).replace("T", " "),
      views: 0,
      likes: 0,
      comments: [],
    };
    POSTS_DB.posts.push(postWithId);
    return HttpResponse.json(postWithId, { status: 200 });
  },
)