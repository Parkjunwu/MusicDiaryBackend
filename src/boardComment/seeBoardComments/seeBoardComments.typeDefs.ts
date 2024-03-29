// import { gql } from "apollo-server-express";

// export default gql`
//   type SeeBoardCommentsResponse implements CursorPagination {
//     cursorId:Int
//     hasNextPage:Boolean
//     comments:[BoardComment]
//     error:String
//     # 프론트엔드에서 subscription 데이터 받기 위함... 다른 방법이 안떠오름.
//     isNotFetchMore:Boolean!
//   }
//   type Query {
//     seeBoardComments(
//       boardId:Int!,
//       cursorId:Int,
//       isNotification:Boolean,
//     ):SeeBoardCommentsResponse!
//   }
// `;
import { gql } from "apollo-server-express";

export default gql`
  type Query {
    seeBoardComments(
      boardId: Int!,
      offset: Int!
    ): [BoardComment!]
  }
`;