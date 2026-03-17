import axios from "axios";
import type { IUser } from "../types/user.type";


const BASE_API_URL = import.meta.env.VITE_REACT_APP_API_URL_USERS;

export const authService = {
    creatUser: async (
        username:string,
        email:string,
        password:string
    ):Promise<Partial<IUser>> => {
        const response = await axios.post(`${BASE_API_URL}/create`, {
            username,
            email,
            password,
        });
        return response.data;
    },

    //추후 수정
    getUsers: async () => {
        const response = await axios.get(`${BASE_API_URL}/get/all`);
        return response.data;
    },
    //추후 수정
    getUserById: async () => {
        const response = await axios.get(`${BASE_API_URL}/get`);
        return response.data;
    },

    login: async (
        email:string,
        password:string
    ):Promise<IUser> => {
        const response = await axios.post(`${BASE_API_URL}/login`, {
            email,
            password
        });
 
        return response.data;
    },

    logout: async(
        userinfo:IUser
    ):Promise<Partial<IUser>> => {
        const response = await axios.post(`${BASE_API_URL}/logout`, {
            ...userinfo,
            loggedin: false,
        });
        return response.data;
    },

    deleteUser: async (
        id:number,
    ):Promise<Partial<IUser>> => {
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