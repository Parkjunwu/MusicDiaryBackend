import { gql } from "apollo-server-express";

export default gql`
  type Mutation {
    deleteBoard(
      id: Int!  
    ): MutationResponse!
  }
`;