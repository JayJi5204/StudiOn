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
  comments: Comment[];
  tags: string[];
}

export interface Comments {
  comments:Comment[]
}

export interface Comment {
  id: number;
  author: string;
  authorId: number;
  authorAvatar: string;
  content: string;
  createdAt: string;
  updatedAt: string;
  likes: number;
}