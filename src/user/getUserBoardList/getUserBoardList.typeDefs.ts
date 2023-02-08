import { gql } from "apollo-server-express";

export default gql`
  type GetUserBoardListResponse {
    cursorId: Int
    hasNextPage: Boolean
    boards: [Board]
    error: String
  }
  type Query {
    getUserBoardList(userId: Int!,cursorId: Int): GetUserBoardListResponse!
  }
`;