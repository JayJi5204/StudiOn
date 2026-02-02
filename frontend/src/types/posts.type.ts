export default interface Post {
  id: number;
  title: string;
  content: string;
  author: string;
  category: string;
  createdAt: string;
  views: number;
  likes: number;
  comments: number;
  tags: string[];
  isPopular: boolean;
}