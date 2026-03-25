export interface IPosts {
  posts: IPost[];
}

export interface IPost {
  id: number;
  title: string;
  content: string;
  author: string;
  authorId: number;
  authorAvatar: string;
  category: string;
  createdAt: string;
  updatedAt: string;
  views: number;
  likes: number;
  comments: IComment[];
  tags: string[];
}

export interface IComments {
  comments:IComment[]
}

export interface IComment {
  id: number;
  author: string;
  authorId: number;
  authorAvatar: string;
  content: string;
  createdAt: string;
  updatedAt: string;
  likes: number;
}