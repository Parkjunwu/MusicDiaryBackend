import { gql } from "apollo-server-express";

export default gql`
  type CreateBoardCommentResponse {
    ok: Boolean!
    error: String
    totalCommentsNumber: Int
    offsetComments: [BoardComment!]
  }
  type Mutation {
    createBoardComment(
      payload: String!
      boardId: Int!
    ): CreateBoardCommentResponse!
  }
`