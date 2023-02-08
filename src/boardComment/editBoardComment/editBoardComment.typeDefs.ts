import { gql } from "apollo-server-express";

export default gql`
  type Mutation {
    editBoardComment(
      id: Int!
      payload: String!
    ): MutationResponse!
  }
`