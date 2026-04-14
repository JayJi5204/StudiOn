export interface IBoard {
  boardId: string;
  userId: string;
  title: string;
  content: string;
  category: string;
  viewCount: number;
  likeCount: number;
  tags: string[];
  modifiedAt: string;
  createdAt: string;
}

export interface IComment {
  commentId: number;
  userId: number;
  boardId: string;
  content: string;
  createdAt: string;
  modifiedAt: string;
  likeCount:number;
}


