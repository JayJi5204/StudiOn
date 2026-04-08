export interface IUser {
    userId: number;
    nickName: string;
    email: string;
    password: string;
    phoneNumber: string;
    profileAvatar: string;
    role: string;
    studyTime: Number;
    bio: string;
    createdAt: string;
    isLoggedIn: boolean;
    isDeleted: boolean;
}