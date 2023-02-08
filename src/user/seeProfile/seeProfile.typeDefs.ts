import { gql } from "apollo-server";

export default gql`
  type SeeProfileResponse {
    user: User
    isMe: Boolean
    error: String
  }
  type Query {
    seeProfile(id:Int!): SeeProfileResponse!
  }
`;