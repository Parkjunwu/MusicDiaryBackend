import { gql } from "apollo-server-express";

export default gql`
  # type ToggleBoardLikeResult {
  #   ok:Boolean!
  #   error:String
  # }
  type Mutation {
    toggleBoardLike(
      id: Int!
    ): MutationResponse!
  }
`