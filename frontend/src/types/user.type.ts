export interface IUser {
    userId: string;
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