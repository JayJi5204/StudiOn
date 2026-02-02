import { http, HttpResponse } from 'msw';

const API_URL_SIGNIN = import.meta.env.VITE_REACT_APP_AUTH_API_URL_SIGNIN
const API_URL_SIGNUP = import.meta.env.VITE_REACT_APP_AUTH_API_URL_SIGNUP
const API_URL_PROFILE = import.meta.env.VITE_REACT_APP_AUTH_API_URL_PROFILE

let DB = new Array();
let POSTS_DB = [
    {
        id: 1,
        title: 'React 스터디 3개월 하고 나니 확실히 달라진 점',
        content: '안녕하세요! 지난 3개월간 React 스터디를 진행하면서 느낀 점들을 공유하고 싶어서 글을 작성합니다. 처음에는 useState조차 헷갈렸는데...',
        author: '개발새싹',
        authorAvatar: '🌱',
        category: '스터디 후기',
        createdAt: '2024-10-18 14:30',
        views: 342,
        likes: 28,
        comments: 15,
        tags: ['React', '후기', '성장'],
        isPopular: true
    },
    {
        id: 2,
        title: 'TOEIC 900점 달성! 3개월 공부법 공유합니다',
        content: '드디어 목표했던 900점을 달성했습니다! 스터디 덕분에 꾸준히 할 수 있었어요. 제가 실천했던 방법들을 공유해봅니다...',
        author: '영어마스터',
        authorAvatar: '📚',
        category: '정보공유',
        createdAt: '2024-10-18 13:15',
        views: 521,
        likes: 45,
        comments: 23,
        tags: ['TOEIC', '영어', '합격후기'],
        isPopular: true
    },
    {
        id: 3,
        title: '온라인 스터디 처음인데 어떻게 시작하면 좋을까요?',
        content: '안녕하세요, 온라인 스터디가 처음이라 궁금한 점이 많아서 질문 드립니다. 줌으로 하는 게 좋을까요, 아니면 다른 플랫폼이 있을까요?',
        author: '스터디초보',
        authorAvatar: '🤔',
        category: '질문답변',
        createdAt: '2024-10-18 12:00',
        views: 156,
        likes: 12,
        comments: 18,
        tags: ['질문', '온라인스터디', '초보'],
        isPopular: false
    },
    {
        id: 4,
        title: '정보처리기사 실기 합격! 공부 자료 공유합니다',
        content: '정보처리기사 실기 시험에 합격했습니다! 제가 공부하면서 정리한 자료와 팁들을 공유하고자 합니다. 많은 도움이 되셨으면 좋겠습니다.',
        author: 'IT개발자',
        authorAvatar: '💻',
        category: '정보공유',
        createdAt: '2024-10-18 11:20',
        views: 289,
        likes: 34,
        comments: 8,
        tags: ['정보처리기사', '합격', '자료공유'],
        isPopular: false
    },
    {
        id: 5,
        title: '독서 토론 스터디 정말 재미있어요!',
        content: '매주 일요일마다 하는 독서 토론 스터디에 참여한 지 2달이 되었는데요, 정말 만족스럽습니다. 다양한 관점을 들을 수 있어서 좋아요.',
        author: '책읽는사람',
        authorAvatar: '📖',
        category: '자유토론',
        createdAt: '2024-10-18 10:45',
        views: 198,
        likes: 19,
        comments: 11,
        tags: ['독서', '토론', '추천'],
        isPopular: false
    },
    {
        id: 6,
        title: '스터디 중간에 포기하고 싶을 때 극복하는 방법',
        content: '스터디를 하다 보면 중간에 지치거나 포기하고 싶을 때가 있죠. 저도 그랬는데, 이렇게 극복했습니다...',
        author: '끈기왕',
        authorAvatar: '💪',
        category: '자유토론',
        createdAt: '2024-10-18 09:30',
        views: 412,
        likes: 56,
        comments: 27,
        tags: ['동기부여', '꿀팁', '멘탈관리'],
        isPopular: true
    }
];
const testGetPosts = http.get(import.meta.env.VITE_REACT_APP_API_URL_FREEBULLETINBOARD, () => {
    return HttpResponse.json(POSTS_DB, { status: 200 });
});

const testCreatePost = http.post(import.meta.env.VITE_REACT_APP_API_URL_FREEBULLETINBOARD, async ({ request }) => {
  const newPost = (await request.json()) as any;
  console.log('받은 새 게시글 데이터:', newPost);
    const postWithId = {
      ...newPost,
      id: POSTS_DB.length + 1,
      createdAt: new Date().toISOString().slice(0, 16).replace('T', ' '),
      views: 0,
      likes: 0,
      comments: 0,
      isPopular: false
    };
    POSTS_DB.push(postWithId);
    return HttpResponse.json(postWithId, { status: 200 });
});

const testLogOut = http.post(import.meta.env.VITE_REACT_APP_AUTH_API_URL_LOGOUT, async () => {
    return HttpResponse.json({ message: '로그아웃 성공' }, { status: 200 });
});

const testSignin = http.post(API_URL_SIGNIN, async ({ request }) => {
    const { username, password } = (await request.json()) as any;
    const user = DB.find(u => u.username === username && u.password == password)
    
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
    const { username, password, email } = (await request.json()) as any;
    const isDuplicate = DB.some(user => user.username === username)
    
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
      id:DB.length +1,
      username: `${username}`,
      password: `${password}`,
      email: `${email}`,
      bio: '기본 자기소개입니다.',
      location: '서울, 대한민국',
      loggedin: false,
      joinDate: `${year}년 ${month}월 ${date}일`,
      role: '일반',
      avatar: '👨‍💻'
    }

    DB.push(newUser);
    console.log(username,password,email,DB)
    return HttpResponse.json(newUser, { status: 200 });
    
});

const testProfile = http.get(`${API_URL_PROFILE}/:id`, ({params}) => {

  const {id} = params;

  //DB에서 유저 찾기 (없으면 기본 목데이터 반환)
  const user = DB.find(u => u.id === Number(id))

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
        loggedin: user.loggedin,
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
  testGetPosts,
  testCreatePost
];