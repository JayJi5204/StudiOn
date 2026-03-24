import { http, HttpResponse } from "msw";
import { USER_DB } from "./userDB";
import { POSTS_DB } from "./postDB";
import type { Comment } from "../types/posts.type";
import { dateFormatter } from "../utils/date";

const API_URL_USERS = import.meta.env.VITE_REACT_APP_API_URL_USERS;
const API_URL_PROFILE = import.meta.env.VITE_REACT_APP_AUTH_API_URL_PROFILE
const API_URL_COMMUNITY_BOARD = import.meta.env.VITE_REACT_APP_URL_COMMUNITY_BOARD

const testViewCount = http.patch(`${API_URL_COMMUNITY_BOARD}/post/:id/views`, async ({ params }) => {
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

const testUpdateUser = http.patch(`${API_URL_USERS}/:id`, async ({ params, request }) => {
    const { id } = params;
    const editForm = await request.json() as any;

    const idx = USER_DB.users.findIndex(u => String(u.id) === String(id));

    if (idx !== -1) {
        USER_DB.users[idx] = { ...USER_DB.users[idx], ...editForm };
        console.log('업데이트 성공:', USER_DB.users[idx]);
        
        return HttpResponse.json(USER_DB.users[idx], { status: 200 });
    }

    // 데이터가 없어서 404가 나는 경우 콘솔에 표시
    console.error(`ID ${id}에 해당하는 유저를 찾을 수 없어 404를 반환합니다.`);
    return new HttpResponse(null, { status: 404 });
});

const testDeleteComment = http.delete(
  `${API_URL_COMMUNITY_BOARD}/posts/:postId/comments/:commentId`, 
  ({ params }) => {
    const { postId, commentId } = params;
    const postIdx = POSTS_DB.posts.findIndex(post => post.id === Number(postId));

    if (postIdx !== -1) {
      
      POSTS_DB.posts[postIdx].comments = POSTS_DB.posts[postIdx].comments.filter(
        (comment) => comment.id !== Number(commentId)
      );
      
      console.log(`게시글 ${postId}번의 ${commentId}번 댓글 삭제 완료`);
      return HttpResponse.json({ message: "삭제 성공" }, { status: 200 });
    }

    // 게시글을 못 찾았을 경우 에러 응답
    return new HttpResponse(null, { status: 404 });
  }
);

const testUpdateComment = http.put(`${API_URL_COMMUNITY_BOARD}/posts/:id/comments`,async ({params,request})=>{
  const {id} = params
  const editComment = await request.json() as Comment;
  const idx = POSTS_DB.posts.findIndex(post => post.id === Number(id))
  if (idx === -1) {
    return HttpResponse.json(null,{status:404,statusText:"Post Not found"});
  }

    POSTS_DB.posts[idx].comments[editComment.id] = editComment;

    return HttpResponse.json(editComment, { status: 200 });
  },
);

const testCreateComment = http.post(
  `${API_URL_COMMUNITY_BOARD}/posts/:id/comments`,
  async ({ params, request }) => {
    const { id } = params;
    const newComment = (await request.json()) as Comment;
    const idx = POSTS_DB.posts.findIndex((post) => post.id === Number(id));
    if (idx === -1) {
      return HttpResponse.json(null, {
        status: 404,
        statusText: "Post Not found",
      });
    }

    POSTS_DB.posts[idx].comments.push(newComment);

    return HttpResponse.json(newComment, { status: 200 });
  },
);

const testGetPostDetail = http.get(
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

const testDeletePost = http.delete(
  `${API_URL_COMMUNITY_BOARD}/post/:id`,
  ({ params }) => {
    const { id } = params;
    POSTS_DB.posts = POSTS_DB.posts.filter((post) => post.id !== Number(id));
    return new HttpResponse(null, { status: 204 }); //204 No Content
  },
);

const testGetPosts = http.get(`${API_URL_COMMUNITY_BOARD}/posts`, ({ request }) => {
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

const testUpdatePost = http.patch(
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

const testCreatePost = http.post( `${API_URL_COMMUNITY_BOARD}/post`,
  async ({ request }) => {
    const newPost = (await request.json()) as any;
    console.log("받은 새 게시글 데이터:", newPost);
    const postWithId = {
      ...newPost,
      id: POSTS_DB.posts.length + 1,
      createdAt: new Date().toISOString().slice(0, 16).replace("T", " "),
      views: 0,
      likes: 0,
      comments: 0,
      isPopular: false,
    };
    POSTS_DB.posts.push(postWithId);
    return HttpResponse.json(postWithId, { status: 200 });
  },
);

const testLogOut = http.post(`${API_URL_USERS}/auth/:id`, async ({params}) => {
  const { id } = params;
  const user = USER_DB.users.find(u => u.id === Number(id));
 
  return HttpResponse.json({
        ...user,
        isLoggedin: false,
      }, { status: 200 });
});

const testLogin = http.post(`${API_URL_USERS}/auth`, async ({ request }) => {
    const { email, password } = await (request.json()) as any
    const user = USER_DB.users.find(u => u.email === email && u.password == password);
    if (user) {
      return HttpResponse.json({
        ...user,
        isLoggedin:true,
        accessToken: 'mocked-jwt-token-xyz'
      }, { status: 200 });
    }
    
    return new HttpResponse(null, { status: 401 });
  });
  
const testCreateUser = http.post(`${API_URL_USERS}`, async({ request }) => {
    const { nickname, password, email,phoneNumber } = (await request.json()) as any;
    const isDuplicate = USER_DB.users.some(user => user.nickname === nickname)
    
    if (isDuplicate){
      return new HttpResponse(
        JSON.stringify({ message: '이미 존재하는 아이디입니다. 다른 아이디를 입력해주세요.' }),
        { 
          status: 401,
          headers: { 'Content-Type': 'application/json' }
        }
      );
    }
    const newUser = {
      id:USER_DB.users.length +1,
      nickname: `${nickname}`,
      password: `${password}`,
      phoneNumber:`${phoneNumber}`,
      email: `${email}`,
      bio: '기본 자기소개입니다.',
      location: '서울, 대한민국',
      role: 'user',
      avatar: '👨‍💻',
      createdAt: dateFormatter(),
      updatedAt: dateFormatter(),
      isLoggedin:false,
      isDeleted:false,
      Refresh:'',
      accessToken:''
    }

    USER_DB.users.push(newUser);
    return HttpResponse.json(newUser, { status: 200 });
    
});

const testDeleteUser = http.delete(`${API_URL_USERS}/:id`, ({ params }) => {
  const { id } = params;
  
  // 1. 유저 찾기
  const idx = USER_DB.users.findIndex(u => u.id === Number(id));

  // 2. 유저가 존재할 경우 (idx가 -1이 아닐 때)
  if (idx !== -1) {
    // 삭제 플래그 업데이트
    USER_DB.users[idx].isDeleted = true;

    // 수정된 유저 객체 반환
    return HttpResponse.json(USER_DB.users[idx], { status: 200 });
  }

  // 3. 유저가 존재하지 않을 경우 404 반환
  return HttpResponse.json({ message: "User not found" }, { status: 404 });
});


const testProfile = http.get(`${API_URL_PROFILE}/:id`, ({ params }) => {
  const { id } = params;
  const user = USER_DB.users.find((u) => u.id === Number(id));
  
  if (user) {
    return HttpResponse.json(
      {
        id: 1,
        nickname: user.nickname,
        email: user.email,
        bio: user.bio,
        location: user.location,
        role: user.role,
        avatar: user.avatar,
        createdAt:user.createdAt ,
        updatedAt:user.updatedAt ,
        isLoggedin:user.isLoggedin ,
        isDeleted:user.isDeleted ,
        Refresh:'',
        accessToken:''
      },
      { status: 200 },
    );
  }

  return new HttpResponse(
    JSON.stringify({ message: "유저가 존재하지 않습니다." }),
    {
      status: 401,
      headers: { "Content-Type": "application/json" },
    },
  );
});

export const handlers = [
  testCreateUser,
  testUpdateUser,
  testDeleteUser,
  testLogin,
  testLogOut,
  testProfile,
  testGetPostDetail,
  testGetPosts,
  testCreatePost,
  testDeletePost,
  testUpdatePost,
  testCreateComment,
  testUpdateComment,
  testDeleteComment,
  testViewCount
];
