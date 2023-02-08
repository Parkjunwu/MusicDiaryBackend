import { gql } from "apollo-server-express";

export default gql`
  type Mutation {
    accuseBoard(
      id: Int!
      reason: Int!
      detail: String
    ): MutationResponse!
  }
`