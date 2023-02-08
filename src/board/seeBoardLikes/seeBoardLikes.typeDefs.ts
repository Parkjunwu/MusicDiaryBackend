import { gql } from "apollo-server-express";

export default gql`
  type SeeLikesResponse implements CursorPagination {
    cursorId: Int
    hasNextPage: Boolean
    likeUsers: [User!]
    error: String
  }
  type Query {
    seeBoardLikes(
      id: Int!,
      cursorId:  Int
    ): SeeLikesResponse!
  }
`