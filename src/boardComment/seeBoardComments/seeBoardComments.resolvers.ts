// import paginationErrorCheckNeedLogicAndQueryName from "../../paginationErrorCheckNeedLogicAndQueryName";
// import { Resolver, Resolvers } from "../../types";
// import { notGetBlockUsersLogicNeedLoggedInUserId } from "../../user/user.utils";

// const logicSeeBoardComments: Resolver = async(_,{boardId,cursorId,isNotification},{client,loggedInUser}) => {

//   const take = 5;
  
//   const loggedInUserId = loggedInUser?.id;

//   const comments = await client.boardComment.findMany({
//     where: {
//       boardId,
//       // 로그인한 유저인 경우 차단 유저 제외
//       ...(loggedInUserId && {
//         user: notGetBlockUsersLogicNeedLoggedInUserId(loggedInUserId),
//       }),
//     },
//     orderBy: {
//       createdAt: "desc",
//     },
//     take,
//     ...(cursorId && { cursor: { id: cursorId }, skip: isNotification ? 0 : 1 }),
//     include: {
//       user: {
//         select: {
//           id: true,
//           userName: true,
//           avatar: true,
//         },
//       },
//     },
//   });

//   const commentsCount = comments.length;

//   // 메세지 받은 개수가 한번에 가져올 갯수랑 달라. 그럼 마지막이라는 뜻. 다만 딱 한번에 가져올 갯수랑 맞아 떨어지면 다음에 가져올 게 없지만 그래도 있는 걸로 나옴.
//   const isHaveHaveNextPage = commentsCount === take;

//   if( isHaveHaveNextPage ){
//     const cursorId = comments[commentsCount-1].id;
//     return {
//       cursorId,
//       hasNextPage: true,
//       comments,
//     };
//   } else {
//     return {
//       hasNextPage: false,
//       comments,
//     };
//   }
// };

// const seeBoardCommentsFn: Resolver = async(_,props,ctx) => {
//   return paginationErrorCheckNeedLogicAndQueryName(
//     await logicSeeBoardComments(_,props,ctx,null),
//     "seeBoardComments"
//   );
// };

// const resolver: Resolvers = {
//   SeeBoardCommentsResponse: {
//     // 프론트엔드에서 subscription mutation 데이터 받기 위함... 데이터 형식을 프론트엔드에서 못바꿔서..
//     isNotFetchMore: () => false,
//   },
//   Query: {
//     seeBoardComments: seeBoardCommentsFn,
//   },
// };

// export default resolver;


import { Resolver, Resolvers } from "../../types";
import { getOffsetComments } from "../boardCommentUtils";

const seeBoardCommentsFn: Resolver = async(_,{boardId,offset},{logInUserId}) => {

  // const take = 10;
  
  // const loggedInUserId = loggedInUser?.id;

  // const comments = await client.boardComment.findMany({
  //   where: {
  //     boardId,
  //     // 로그인한 유저인 경우 차단 유저 제외
  //     ...(loggedInUserId && {
  //       user: notGetBlockUsersLogicNeedLoggedInUserId(loggedInUserId),
  //     }),
  //   },
  //   // orderBy: {
  //   //   createdAt: "desc",
  //   // },
  //   take,
  //   skip: offset,
  //   include: {
  //     user: {
  //       select: {
  //         id: true,
  //         userName: true,
  //         avatar: true,
  //       },
  //     },
  //   },
  // });
  const comments = await getOffsetComments(boardId,logInUserId,offset);

  return comments;
};

const resolver: Resolvers = {
  Query: {
    seeBoardComments: seeBoardCommentsFn,
  },
};

export default resolver;