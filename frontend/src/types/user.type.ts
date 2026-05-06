export interface User {
  userId: string;
  email: string;
  nickName: string;
  role: "USER" | "ADMIN";
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface SignupRequest {
  email: string;
  password: string;
  nickName: string;
  phoneNumber: string;
}

export interface UpdateUserRequest {
  email?: string;
  nickName?: string;
  password?: string;
  phoneNumber?: string;
  bio?: string;
}

export interface DeleteUserRequest {
  password: string;
}

export interface MyInfo {
  userId: string;
  email: string;
  nickName: string;
  phoneNumber: string;
  role: "USER" | "ADMIN";
  bio: string | null;
  boards: MyBoard[];
  comments: MyComment[];
}

export interface MyBoard {
  boardId: string;
  title: string;
  content: string;
  category: string;
  viewCount: number;
  likeCount: number;
  tags: string[];
  createdAt: string;
  modifiedAt: string;
}

export interface MyComment {
  commentId: string;
  content: string;
  commentPath: string;
  boardId: string;
  userId: string;
  nickName: string;
  likeCount: number;
  isDeleted: boolean;
  isLiked: boolean;
  createdAt: string;
  modifiedAt: string;
}

export interface StudyRanking {
  userId: string;
  nickName: string;
  studyTime: number;
  rank: number;
}

export interface StudyDaily {
  date: string;
  studyTime: number;
}
