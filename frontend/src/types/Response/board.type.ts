export type Category = 'COMMUNITY' | 'QUESTION' | 'NOTICE' | "ALL";

export interface IPageResponse {
  boardId: number;
  nickName: string;
  title: string;
  content: string;
  tags: string[];
  category: Category;
  commentCount: number;
  viewCount: number;
  likeCount: number;
  createdAt: string;
}

export interface IPage<T> {
  content: T[];
  totalElements: number;
  totalPages: number;
  size: number;
  number: number;
  first: boolean;
  last: boolean;
}

export interface IBoardDetailResponse {
  boardId: string;
  userId: string;
  nickName: string;
  title: string;
  category: string;
  content: string;
  comment: IBoardComment[];
  tags: string[];
  viewCount: number;
  likeCount: number;
  isLiked: boolean;
  createdAt: string;
  modifiedAt: string;
}

export interface IBoardComment {
  // profileAvatar: response.profileAvatar,
  commentId: string;
  userId: string;
  nickName: string;
  content: string;
  commentPath: string;     
  parentPath: string | null;
  likeCount: number;
  isLiked: boolean;
  isDeleted: boolean;
  createdAt: string;
  modifiedAt: string;
}

export interface IUpdateBoardResponse {
  boardId: string,
  nickName: string,
  userId: string,
  title: string,
  content: string,
  category: string,
  viewCount: number,
  likeCount: number,
  tags: string[],
  modifiedAt: string,
  createdAt: string
}

export interface IUserComment {
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

export interface IUserDetailResponse {
  email: string;
  nickName: string;
  boards: IPageResponse[];
  comments: IUserComment[];
}