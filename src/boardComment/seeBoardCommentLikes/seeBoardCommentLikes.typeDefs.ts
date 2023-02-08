import { gql } from "apollo-server-express";

export default gql`
  # seeCommentLikes 에 SeeLikesResponse 있음. seeBoardLikes, seeCommentOfCommentLikes 에도 똑같이 씀
  type Query {
    seeBoardCommentLikes(
      boardCommentId: Int!,
      cursorId: Int
    ): SeeLikesResponse!
  }
`;