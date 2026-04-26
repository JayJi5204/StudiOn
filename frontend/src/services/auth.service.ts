import axios from "axios";
import type { IUser } from "../types/user.type";
const BASE_API_URL = import.meta.env.VITE_REACT_APP_API_URL_USERS;

export const authService = {
    creatUser: async (
        nickName:string,
        email:string,
        password:string,
        phoneNumber:string
    ):Promise<Partial<IUser>> => {
        const response = await axios.post(`${BASE_API_URL}/create`, {
            nickName,
            email,
            password,
            phoneNumber,
        });
        return response.data;
    },

    //추후 수정
    getUsers: async () => {
        const response = await axios.get(`${BASE_API_URL}`);
        return response.data;
    },

    //추후 수정
    getUserById: async (id:number) => {
        const response = await axios.get(`${BASE_API_URL}/${id}`);
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

    logout: async (): Promise<IUser> => {        
        const response = await axios.post(
            `${BASE_API_URL}/logout`,
            {},
            {
                withCredentials: true,
            }
        );
        return response.data;
    },
    
    updateUser: async (
        id:string,
        userInfo:IUser
    ):Promise<Partial<IUser>> => {
        const response = await axios.patch(`${BASE_API_URL}/${id}`,userInfo)
        return response.data;
    },

    deleteUser: async (
        id:string,
    ) => {
        const response = await axios.delete(`${BASE_API_URL}/${id}`);
        return response.data;
    },
};