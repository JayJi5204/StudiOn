import axios from "axios";
import type { IUser } from "../types/user.type";


const BASE_API_URL = import.meta.env.VITE_REACT_APP_API_URL_USERS;

export const authService = {
    creatUser: async (
        username:string,
        email:string,
        password:string
    ) => {
        const response = await axios.post(`${BASE_API_URL}/create`, {
            username,
            email,
            password,
        });
        return response;
    },

    //추후 수정
    getUsers: async () => {
        const response = await axios.get(`${BASE_API_URL}/get/all`);
        return response;
    },
    //추후 수정
    getUserById: async () => {
        const response = await axios.get(`${BASE_API_URL}/get`);
        return response;
    },

    login: async (
        username:string,
        password:string
    ) => {
        const response = await axios.post(`${BASE_API_URL}/login`, {
            username,
            password
            });
            
        if (response.data.accessToken) {
            sessionStorage.setItem("user", JSON.stringify(response.data.userInfo));
            }
 
        return response;
    },

    logout: async(userinfo:IUser) => {
        const response = await axios.post(`${BASE_API_URL}/logout`, {
            ...userinfo,
            loggedin: false,
        });
        return response;
    },

    deleteUser: async (
        id:number,
    ):Promise<IUser> => {
        const response = await axios.delete(`${BASE_API_URL}/delete/${id}`);
        return response.data;
    },
    
    getCurrentUser: () => {
        // const userStr = localStorage.getItem("user");
        const userStr = sessionStorage.getItem("user");
        if (userStr) return JSON.parse(userStr);

        return null;
    }
};