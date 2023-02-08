import { gql } from "apollo-server-express";

export default gql`
  type BoardCommentOfComment {
    id: Int!
    user: User!
    boardComment: BoardComment!
    payload: String!
    createdAt: String!
    updatedAt: String!
    isMine: Boolean!
    totalLikes: Int!
    isLiked: Boolean
  }
`