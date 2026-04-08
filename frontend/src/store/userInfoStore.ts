import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { IUser } from '../types/user.type';

const initialUserInfo = {
    userId:0,
    nickName:'',
    password:'',
    phoneNumber:'',
    studyTime:0,
    email:'',
    bio:'',
    role:'',
    profileAvatar:'',
    createdAt: '',
    modifiedAt: '',
    isLoggedIn:false,
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