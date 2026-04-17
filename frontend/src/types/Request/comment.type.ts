export interface ICommentRequest{
  boardId: string,
  content: string,
  parentPath: string | null;
}