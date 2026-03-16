import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { IUser } from '../types/user.type';

const initialUserInfo = {
    id:0,
    username:'',
    password:'',
    confirmPassword:'',
    phoneNumber:'',
    studyTime:0,
    email:'',
    bio:'',
    location:'',
    joinDate:'',
    role:'',
    avatar:'',
    loggedin:false,
    rememberMe: false,
    agreeTerms:false,
    agreePrivacy: false,
    JWT:'',
    Refresh:'',
    isDeleted:false,
};

type UserInfoState = {
    userInfo: IUser;
}

type UserInfoAction = {
    getUserInfo: () => IUser;
    setUserInfo: (newUserInfo: IUser) => void;
    updateUserInfo: (key: keyof IUser, value: IUser[keyof IUser]) => void;
    updateAvatar: (newAvatar: string) => void;
};

const useUserInfoStore = create<UserInfoState & UserInfoAction>()(
    persist(
        (set,get) => ({
            userInfo: initialUserInfo,
            getUserInfo: () => get().userInfo,
            setUserInfo: (newUserInfo) => set({ userInfo: newUserInfo }),
            updateUserInfo: (key, value) => set((state) => ({
                userInfo: { ...state.userInfo, [key]: value }
            })),
            updateAvatar: (newAvatar) => set((state) => ({
                userInfo: { ...state.userInfo, avatar: newAvatar }
            })),
        }),
        {
            name: 'user-auth-storage', // localStorage에 저장될 key 이름
        }
    )
);

export default useUserInfoStore;