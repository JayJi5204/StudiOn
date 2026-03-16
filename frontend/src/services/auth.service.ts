import axios from "axios";
import type { IUser } from "../types/user.type";


const API_URL_SIGNIN = import.meta.env.VITE_REACT_APP_AUTH_API_URL_SIGNIN;
const API_URL_SIGNUP = import.meta.env.VITE_REACT_APP_AUTH_API_URL_SIGNUP;

export const authService = {
    creatUser: async (username:string,email:string,password:string) => {
        const response = await axios.post(API_URL_SIGNUP, {
            username,
            email,
            password,
        });
        return response;
    },

    //추후 수정
    getUser: async () => {
        const response = await axios.get(API_URL_SIGNIN);
        return response;
    },
    //추후 수정
    getUserById: async () => {
        const response = await axios.get(API_URL_SIGNIN);
        return response;
    },

    login: async (username:string,password:string) => {
        const response = await axios.post(API_URL_SIGNIN, {
            username,
            password
            });
            
        if (response.data.accessToken) {
            sessionStorage.setItem("user", JSON.stringify(response.data.userInfo));
            }
 
        return response;
    },

    logout: async(userinfo:IUser) => {
        const response = await axios.post(import.meta.env.VITE_REACT_APP_AUTH_API_URL_LOGOUT, {
            ...userinfo,
            loggedin: false,
        });
        return response;
    },

    getCurrentUser: () => {
        // const userStr = localStorage.getItem("user");
        const userStr = sessionStorage.getItem("user");
        if (userStr) return JSON.parse(userStr);

        return null;
    }
};