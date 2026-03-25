import { testCreateUser,testUpdateUser,testDeleteUser,testLogin,testLogOut } from "./handler/testAuth";
import { testProfile } from "./handler/testProfile";
import { testCreatePost,testDeletePost,testUpdatePost,testViewCount,testGetPostDetail,testGetPosts } from "./handler/testPost";
import { testCreateComment,testUpdateComment,testDeleteComment } from "./handler/testComment";

export const handlers = [
  testCreateUser,
  testUpdateUser,
  testDeleteUser,
  testLogin,
  testLogOut,
  testProfile,
  testGetPostDetail,
  testGetPosts,
  testCreatePost,
  testDeletePost,
  testUpdatePost,
  testCreateComment,
  testUpdateComment,
  testDeleteComment,
  testViewCount
];
