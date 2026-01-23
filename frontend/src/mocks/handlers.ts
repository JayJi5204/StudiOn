import { http, HttpResponse } from 'msw';

const API_URL_SIGNIN = import.meta.env.VITE_REACT_APP_AUTH_API_URL_SIGNIN
const API_URL_SIGNUP = import.meta.env.VITE_REACT_APP_AUTH_API_URL_SIGNUP
let DB = new Array();

const testSignin = http.post(API_URL_SIGNIN, async ({ request }) => {
    const { username, password } = (await request.json()) as any;
    const user = DB.find(u => u.username === username && u.password == password)
    console.log(username,password,user,DB)
    if (user) {
      return HttpResponse.json({
        id: user.id,
        username: user.username,
        password: user.password,
        accessToken: 'mocked-jwt-token-xyz', // signin 함수에서 체크하는 키
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

const testSignup = http.post(API_URL_SIGNUP, async({ request}) => {
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

    const newUser = {
      id:DB.length +1,
      username: `${username}`,
      password: `${password}`,
      email: `${email}`
    }
    DB.push(newUser);
    console.log(username,password,email,DB)
    return HttpResponse.json(newUser, { status: 200 });
    
});

export const handlers = [
  testSignin,
  testSignup
];