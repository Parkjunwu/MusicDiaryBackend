import { gql } from "apollo-server-express";

export default gql`
  type SeeNewBoardListResponse {
    cursorId: Int
    hasNextPage: Boolean
    boards: [Board!]
    error: String
  }
  type Query {
    seeNewBoardList(
      cursorId: Int
    ): SeeNewBoardListResponse!
  }
`;