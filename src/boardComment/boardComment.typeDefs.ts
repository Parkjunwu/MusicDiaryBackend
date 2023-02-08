import { gql } from "apollo-server-express";

export default gql`
  type BoardComment {
    id:Int!
    user:User!
    board:Board!
    payload:String!
    createdAt:String!
    updatedAt:String!
    isMine:Boolean!
    totalLikes:Int!
    totalCommentOfComments:Int!
    isLiked:Boolean
  }
`