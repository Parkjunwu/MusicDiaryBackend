import { gql } from "apollo-server-express";

export default gql`
  type Mutation {
    editBoardCommentOfComment(
      id: Int!
      payload: String!
    ): MutationResponse!
  }
`