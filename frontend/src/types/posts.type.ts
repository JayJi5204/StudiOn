export interface Posts {
  posts: Post[];
}

export interface Post {
  id: number;
  title: string;
  content: string;
  author: string;
  authorId: number;
  authorAvatar: string;
  category: string;
  createdAt: string;
  views: number;
  likes: number;
  isPopular: boolean;
  comments: Comment[];
  tags: string[];
}

interface Comment {
  id: number;
  author: string;
  authorId: number;
  authorAvatar: string;
  content: string;
  createdAt: string;
  likes: number;
}