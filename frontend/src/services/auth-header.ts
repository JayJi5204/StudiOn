/*
헤더는 서버로부터 데이터를 되찾아 오는 역할을 한다.
보호되는 리소스에 접근할 경우, 
HTTP 요청은 인증 헤더가 필요하다.

1. 로컬스토리지에서 유저를 가져온다.
2. JWT 토큰과 함께 로그인된 유저가 있다면 HTTP 인증 헤더를 리턴한다.
3. 그렇지 않다면 빈 객체를 리턴한다.  

*/
export default function authHeader() {
    // const userStr = localStorage.getItem("user");
    const userStr = sessionStorage.getItem("user");
    let user = null;
    if (userStr) {
        user = JSON.parse(userStr);
    }

    if (user && user.accessToken) {
        return {Authorization: 'Bearer' + user.accessToken}; // for Spring Boot back-end
        // return { 'x-access-token': user.accessToken }; 
    }
    else{
        return {Authorization: ''}; // for Spring Boot back-end
         // return { 'x-access-token': null }; // for Node Express back-end
    }
}
