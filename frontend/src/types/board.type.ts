export type BoardCategory = "COMMUNITY" | "NOTICE" | "QUESTION";

export interface Board {
  boardId: string;
  title: string;
  content: string;
  nickName: string;
  userId: string;
  boardCategory: BoardCategory;
  viewCount: number;
  likeCount: number;
  commentCount: number;
  tags: string[];
  createdAt: string;
  updatedAt: string;
}

export interface BoardDetail {
  boardId: string;
  nickName: string;
  title: string;
  userId: string;
  content: string;
  boardCategory: BoardCategory;
  viewCount: number;
  likeCount: number;
  isLiked: boolean;
  tags: string[];
  createdAt: string;
  modifiedAt: string;
  comment: CommentDto[];
}

export interface CommentDto {
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

export interface BoardListResponse {
  content: Board[];
  totalPages: number;
  totalElements: number;
  number: number;
  size: number;
}

export interface CreateBoardRequest {
  title: string;
  content: string;
  boardCategory: BoardCategory;
  tags?: string[];
}

export interface UpdateBoardRequest {
  title?: string;
  content?: string;
  boardCategory?: BoardCategory;
  tags?: string[];
}

export interface BoardRanking {
  boardId: string;
  title: string;
  nickName: string;
  userId: string;
  count: number;
  rank: number;
}
