import { gql } from "apollo-server-express";

export default gql`
  type SearchBoardsResponse {
    cursorId: Int
    hasNextPage: Boolean
    boards: [Board!]
    error: String
  }
  type Query {
    searchBoards(
      keyword: String!,
      cursorId: Int
    ): SearchBoardsResponse!
  }
`