import { http, HttpResponse } from "msw";
import { dateFormatter } from "../../utils/date";
import { USER_DB } from "../DB/userDB";

const API_URL_USERS = import.meta.env.VITE_REACT_APP_API_URL_USERS;

export const testLogOut = http.post(`${API_URL_USERS}/auth/:id`, async ({params}) => {
  const { id } = params;
  const user = USER_DB.users.find(u => u.id === Number(id));
 
  return HttpResponse.json({
        ...user,
        isLoggedin: false,
      }, { status: 200 });
});

export const testLogin = http.post(`${API_URL_USERS}/auth`, async ({ request }) => {
    const { email, password } = await (request.json()) as any
    const user = USER_DB.users.find(u => u.email === email && u.password == password);
    if (user && !user.isDeleted) {
      return HttpResponse.json({
        ...user,
        isLoggedin:true,
        accessToken: 'mocked-jwt-token-xyz'
      }, { status: 200 });
    }
    
    return new HttpResponse(null, { status: 401 });
  });
  

export const testCreateUser = http.post(`${API_URL_USERS}`, async({ request }) => {
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

export const testUpdateUser = http.patch(`${API_URL_USERS}/:id`, async ({ params, request }) => {
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

export const testDeleteUser = http.delete(`${API_URL_USERS}/:id`, ({ params }) => {
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
