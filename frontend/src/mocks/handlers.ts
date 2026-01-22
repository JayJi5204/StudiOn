import { http, HttpResponse } from 'msw';

const API_URL_SIGNIN = import.meta.env.VITE_REACT_APP_AUTH_API_URL_SIGNIN
const testSignin = http.post(API_URL_SIGNIN, async ({ request }) => {
    const { username, password } = (await request.json()) as any;

    if (username === 'testuser' && password === 'password123@') {
      return HttpResponse.json({
        id: 1,
        username: 'testuser',
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

export const handlers = [
  testSignin,
];