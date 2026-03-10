import { http, HttpResponse } from 'msw';
import { USER_DB } from './userDB'
import { POSTS_DB } from './postDB';

const API_URL_SIGNIN = import.meta.env.VITE_REACT_APP_AUTH_API_URL_SIGNIN
const API_URL_SIGNUP = import.meta.env.VITE_REACT_APP_AUTH_API_URL_SIGNUP
const API_URL_PROFILE = import.meta.env.VITE_REACT_APP_AUTH_API_URL_PROFILE
const API_URL_COMMUNITY_BOARD = import.meta.env.VITE_REACT_APP_API_URL_COMMUNITY_BOARD
const API_URL_LOGOUT = import.meta.env.VITE_REACT_APP_AUTH_API_URL_LOGOUT

const testGetPostDetail = http.get(`${API_URL_COMMUNITY_BOARD}/:id`,({params}) => {
  const {id} = params;
  
  try {
    const post = POSTS_DB.posts.find(p=>p.id === Number(id));

    if(!post){
      return new HttpResponse(null,{status:404,statusText:"Post Not found"})
    }
    
    return HttpResponse.json(post,{status:200})

  } catch(error) {
    return HttpResponse.json({message:"서버 에러"},{status:200})
  }
});

const testDeletePosts = http.delete(`${API_URL_COMMUNITY_BOARD}/:id`,({params}) => {
    const {id} = params
    POSTS_DB.posts = POSTS_DB.posts.filter(post => post.id !== Number(id))
    return new HttpResponse(null, {status:204}); //204 No Content
});

const testGetPosts = http.get(API_URL_COMMUNITY_BOARD, ({ request }) => {
    // 1. URL 객체를 생성하여 쿼리 스트링을 파싱
    const url = new URL(request.url);
    const authorId = url.searchParams.get('authorId');
    
    console.log("실제 호출된 URL:", request.url);
    console.log("찾으려는 authorId:", authorId);

    try {
        // 2. authorId 쿼리가 있으면 필터링, 없으면 전체 목록 반환
        if (authorId) {
            const filtered_POSTS_DB = POSTS_DB.posts.filter(
                post => post.authorId === Number(authorId)
            );
            return HttpResponse.json(filtered_POSTS_DB, { status: 200 });
        }
        
        // 쿼리가 없으면 전체 DB 반환
        return HttpResponse.json(POSTS_DB, { status: 200 });

    } catch (error) {
        return HttpResponse.json({ message: "서버 에러" }, { status: 500 });
    }
});

const testCreatePost = http.post(API_URL_COMMUNITY_BOARD, async ({ request }) => {
  const newPost = (await request.json()) as any;
  console.log('받은 새 게시글 데이터:', newPost);
    const postWithId = {
      ...newPost,
      id: POSTS_DB.posts.length + 1,
      createdAt: new Date().toISOString().slice(0, 16).replace('T', ' '),
      views: 0,
      likes: 0,
      comments: 0,
      isPopular: false
    };
    POSTS_DB.posts.push(postWithId);
    return HttpResponse.json(postWithId, { status: 200 });
});

const testLogOut = http.post(API_URL_LOGOUT, async () => {
    return HttpResponse.json({ message: '로그아웃 성공' }, { status: 200 });
});

const testSignin = http.post(API_URL_SIGNIN, async ({ request }) => {
    const { username, password } = (await request.json()) as any;
    const user = USER_DB.users.find(u => u.username === username && u.password == password)
    
    if (user) {
      return HttpResponse.json({
        accessToken: 'mocked-jwt-token-xyz', // signin 함수에서 체크하는 키
        // 로그인 성공 시 유저 정보를 한꺼번에 응답!
        userInfo: user
      }, { status: 200 });
    }

    return new HttpResponse(
      JSON.stringify({ message: '아이디 또는 비밀번호가 틀렸습니다.' }),
      { 
        status: 401,
        headers: { 'Content-Type': 'application/json' }
      }
    );
  })

const testSignup = http.post(API_URL_SIGNUP, async({ request }) => {
    const { username, password, email,phoneNumber } = (await request.json()) as any;
    const isDuplicate = USER_DB.users.some(user => user.username === username)
    
    if (isDuplicate){
      return new HttpResponse(
        JSON.stringify({ message: '이미 존재하는 아이디입니다. 다른 아이디를 입력해주세요.' }),
        { 
          status: 401,
          headers: { 'Content-Type': 'application/json' }
        }
      );
    }
    let today = new Date();  
    let year = today.getFullYear();
    let month = today.getMonth() + 1;
    let date = today.getDate();

    const newUser = {
      id:USER_DB.users.length +1,
      username: `${username}`,
      password: `${password}`,
      phoneNumber:`${phoneNumber}`,
      email: `${email}`,
      bio: '기본 자기소개입니다.',
      location: '서울, 대한민국',
      loggedin: false,
      joinDate: `${year}년 ${month}월 ${date}일`,
      role: 'user',
      avatar: '👨‍💻'
    }

    USER_DB.users.push(newUser);
    console.log(username,password,email,USER_DB)
    return HttpResponse.json(newUser, { status: 200 });
    
});

const testProfile = http.get(`${API_URL_PROFILE}/:id`, ({params}) => {

  const {id} = params;

  //DB에서 유저 찾기 (없으면 기본 목데이터 반환)
  const user = USER_DB.users.find(u => u.id === Number(id))

  if (user) {
    return HttpResponse.json(
      {
        id: 1,
        username: user.username,
        email: user.email,
        bio: user.bio,
        location: user.location,
        joinDate: user.joinDate,
        role: user.role,
        avatar: user.avatar,
        loggedin: user.loggedin
      }, { status:200});
  }

  return new HttpResponse(
    JSON.stringify({ message: '유저가 존재하지 않습니다.' }),
    { 
      status: 401,
      headers: { 'Content-Type': 'application/json' }
    }
  );
}) 

export const handlers = [
  testSignin,
  testSignup,
  testLogOut,
  testProfile,
  testGetPostDetail,
  testGetPosts,
  testCreatePost,
  testDeletePosts,
];