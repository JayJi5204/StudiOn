export interface ICommentResponse {
  commentId: string;
  userId: string;
  nickName: string;
  content: string;
  commentPath: string;
  likeCount: number;
  createdAt: string;
  modifiedAt: string;
  isDeleted: boolean;
}

export interface IUpdateCommentResponse {
  commentId: string;
  content: string;
  commentPath: string;
  boardId: string;
  userId: string;
  nickName: string;
  modifiedAt: string;
}