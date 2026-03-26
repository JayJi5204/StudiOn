export interface IUser {
    id: number;
    nickname: string;
    password: string;
    phoneNumber:string;
    studyTime:Number;
    email: string;
    bio: string;
    location: string;
    role: string;
    avatar: string;
    createdAt: string;
    updatedAt: string;
    isLoggedin:boolean;
    isDeleted:boolean;
    Refresh:string;
    accessToken:string;
}

