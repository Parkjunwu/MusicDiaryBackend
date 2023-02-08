import { gql } from "apollo-server-express";

export default gql`
  # 업로드 타입 정의
  scalar Upload
  
  type MutationResponse {
    ok:Boolean!
    id:Int
    error:String
  }
  interface CursorPagination {
    cursorId:Int,
    hasNextPage:Boolean,
    error:String,
  }
`