export interface IUser {
    id: number;
    username: string;
    password: string;
    confirmPassword?: string;
    phoneNumber:string;
    studyTime:Number;
    email: string;
    bio: string;
    location: string;
    joinDate: string;
    role: string;
    avatar: string;
    loggedin: boolean;
    rememberMe: boolean;
    agreeTerms: boolean;
    agreePrivacy: boolean;
    JWT:string;
    Refresh:string;
    isDeleted:boolean;
    accessToken:string;
}
