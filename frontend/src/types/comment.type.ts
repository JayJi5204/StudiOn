export interface Comment {
  commentId: string;
  boardId: string;
  userId: string;
  nickName: string;
  content: string;
  likeCount: number;
  isLiked: boolean;
  parentPath: string | null;
  commentPath: string;
  isDeleted: boolean;
  createdAt: string;
  modifiedAt: string;
}

export interface CreateCommentRequest {
  boardId: string;
  content: string;
  parentPath?: string;
}

export interface UpdateCommentRequest {
  content: string;
}
