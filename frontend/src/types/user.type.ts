export default interface IUser {
    id: number;
    username: string;
    password: string;
    confirmPassword?: string;
    rememberMe?: boolean;
    agreeTerms?: boolean;
    agreePrivacy?: boolean;
    email: string;
    bio: string;
    location: string;
    joinDate: string;
    role: string;
    avatar: string;
    loggedin: boolean;
}

