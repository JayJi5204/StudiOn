import { http, HttpResponse } from "msw";
import { USER_DB } from "../DB/userDB";
const API_URL_PROFILE = import.meta.env.VITE_REACT_APP_AUTH_API_URL_PROFILE

export const testProfile = http.get(`${API_URL_PROFILE}/:id`, ({ params }) => {
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