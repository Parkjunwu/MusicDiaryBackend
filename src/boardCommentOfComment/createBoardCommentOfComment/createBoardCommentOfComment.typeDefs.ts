import { gql } from "apollo-server-express";

export default gql`
  type Mutation {
    createBoardCommentOfComment(
      payload: String!
      boardCommentId: Int!
    ): MutationResponse!
  }
`