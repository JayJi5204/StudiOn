export type Category = 'COMMUNITY' | 'QUESTION' | 'NOTICE'; // 실제 카테고리에 맞게 수정

export interface IGetPageResponse {
  boardId: number;
  nickName: string;
  title: string;
  content: string;
  tags: string[];
  category: Category;
  viewCount: number;
  likeCount: number;
  createdAt: string;
}

export interface IPage<T> {
  content: T[];
  totalElements: number;
  totalPages: number;
  size: number;
  number: number;
  first: boolean;
  last: boolean;
}

export interface IGetBoardDetail {
  boardId: string;
  nickName: string;
  title: string;
  content: string;
  category: string;
  viewCount: number;
  likeCount: number;
  tags: string[];
  createdAt: string;
  modifiedAt: string;
  comment: IBoardComment[];
}

export interface IBoardComment {
  commentId: string;
  content: string;
  parentPath: string;
}

