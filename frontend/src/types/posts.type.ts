export default interface Post {
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
  authorAvatar: string;
  content: string;
  createdAt: string;
  likes: number;
}