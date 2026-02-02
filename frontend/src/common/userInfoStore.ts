import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type IUser from '../types/user.type';

const initialUserInfo = {
    id: 0,
    username: '',
    email: '',
    bio: '',
    location: '',
    joinDate: '',
    role: '',
    avatar: '',
    loggedin: false,
};

interface UserInfoState {
    userInfo: IUser;
    setUserInfo: (newUserInfo: IUser) => void;
    updateUserInfo: (key: keyof IUser, value: any) => void;
    updateAvatar: (newAvatar: string) => void;
}


const useUserInfoStore = create<UserInfoState>()(
    persist(
        (set) => ({
            userInfo: initialUserInfo,
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