import { http, HttpResponse } from "msw";
import { POSTS_DB } from "../DB/postDB";
import type { IComment } from "../../types/posts.type";

const API_URL_COMMUNITY_BOARD = import.meta.env.VITE_REACT_APP_URL_BOARD

export const testDeleteComment = http.delete(
  `${API_URL_COMMUNITY_BOARD}/posts/:postId/comments/:commentId`, 
  ({ params }) => {
    const { postId, commentId } = params;
    const postIdx = POSTS_DB.posts.findIndex(post => post.id === Number(postId));

    if (postIdx !== -1) {
      
      POSTS_DB.posts[postIdx].comments = POSTS_DB.posts[postIdx].comments.filter(
        (comment) => comment.id !== Number(commentId)
      );
      
      console.log(`게시글 ${postId}번의 ${commentId}번 댓글 삭제 완료`);
      return HttpResponse.json({ message: "삭제 성공" }, { status: 200 });
    }

    // 게시글을 못 찾았을 경우 에러 응답
    return new HttpResponse(null, { status: 404 });
  }
);

export const testUpdateComment = http.put(`${API_URL_COMMUNITY_BOARD}/posts/:id/comments`,async ({params,request})=>{
    const {id} = params
    const editComment = await request.json() as IComment;
    const idx = POSTS_DB.posts.findIndex(post => post.id === Number(id))
    if (idx === -1) {
        return HttpResponse.json(null,{status:404,statusText:"Post Not found"});
    }
    
    POSTS_DB.posts[idx].comments[editComment.id] = editComment

    return HttpResponse.json(editComment, { status: 200 });
  }
);

export const testCreateComment = http.post(
  `${API_URL_COMMUNITY_BOARD}/posts/:id/comments`,
  async ({ params, request }) => {
    const { id } = params;
    const newComment = (await request.json()) as Comment;
    
    const idx = POSTS_DB.posts.findIndex((post) => post.id === Number(id));
    if (idx === -1) {
      return HttpResponse.json(null, {
        status: 404,
        statusText: "Post Not found",
      });
    }

    POSTS_DB.posts[idx].comments.push(newComment);

    return HttpResponse.json(newComment, { status: 200 });
  },
);