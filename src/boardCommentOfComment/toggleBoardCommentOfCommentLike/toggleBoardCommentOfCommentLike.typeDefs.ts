import { gql } from "apollo-server-express";

export default gql`
  # type ToggleBoardCommentOfCommentLikeResult {
  #   ok: Boolean!
  #   error: String
  # }
  type Mutation {
    toggleBoardCommentOfCommentLike(
      id: Int!
    ): MutationResponse!
  }
`