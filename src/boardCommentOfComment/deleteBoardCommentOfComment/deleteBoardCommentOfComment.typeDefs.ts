import { gql } from "apollo-server-express";

export default gql`
  type Mutation {
    deleteBoardCommentOfComment(
      id: Int!
    ): MutationResponse!
  }
`