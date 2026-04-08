export interface IBoards {
  boards: IBoard[];
}

export interface IBoard {
  boardId: number;
  title: string;
  content: string;
  userId: number;
  // profileAvatar: string;
  category: string;
  createdAt: string;
  modifiedAt: string;
  viewCount: number;
  likeCount: number;
  // comments: IComment[];
  tags: string[];
}

export interface IComments {
  comments:IComment[];
}

export interface IComment {
  commentId: number;
  // author: string;
  userId: number;
  // profileAvatar: string;
  boardId: number;
  content: string;
  createdAt: string;
  modifiedAt: string;
  // likes: number;
  likeCount:number;
}