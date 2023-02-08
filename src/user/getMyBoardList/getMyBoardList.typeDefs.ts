import { gql } from "apollo-server-express";

export default gql`
  type GetMyBoardListResponse {
    cursorId: Int
    hasNextPage: Boolean
    boards: [Board]
    error: String
  }
  type Query {
    getMyBoardList(cursorId: Int): GetMyBoardListResponse!
  }
`;