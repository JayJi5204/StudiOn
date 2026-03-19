export interface IUser {
    id: number;
    username: string;
    password: string;
    phoneNumber:string;
    studyTime:Number;
    email: string;
    bio: string;
    location: string;
    joinDate: string;
    role: string;
    avatar: string;
    isLoggedin:boolean;
    rememberMe: boolean;
    agreeTerms: boolean;
    agreePrivacy: boolean;
    isDeleted:boolean;
    Refresh:string;
    accessToken:string;
}

