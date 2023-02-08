import { gql } from "apollo-server-express";

export default gql`
  # ToggleLikeResult 은toggleCommentLike 에 있음
  type Mutation {
    toggleBoardCommentLike(
      id: Int!
    ): MutationResponse!
  }
`