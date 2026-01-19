/*
    * Once MSW is intergrated into your Vitest setup, it will control the network as defined in your handlers
    * @vitest-environment node
*/

import {test,expect} from 'vitest'

test('signin Test with user', async () => {

    const url = import.meta.env.VITE_REACT_APP_AUTH_API_URL_SIGNIN;

    const response = await fetch(url, {
        method: 'POST', // 핸들러가 http.post 이므로 반드시 POST
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            username: 'testuser',
            password: 'password123@',
        }),
    });

    const data = await response.json();

    expect(response.status).toBe(200);
    expect(data).toEqual({
        id: 1,
        username: 'testuser',
        accessToken: 'mocked-jwt-token-xyz'
    });
});