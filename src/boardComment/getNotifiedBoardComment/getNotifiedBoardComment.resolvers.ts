import { Resolver, Resolvers } from "../../types";

// 일단 쓰진 않음. 걍 push noti 에서 commentId 받아서 seeComments로 받음.

const getNotifiedBoardCommentFn: Resolver = async(_,{boardCommentId,boardId},{client,}) => {
  // const boardComment = await client.boardComment.findUnique({
  //   where: {
  //     id: boardCommentId
  //   },
  //   include: {
  //     user: {
  //       select: {
  //         id: true,
  //         userName: true,
  //         avatar: true,
  //       }
  //     }
  //   }
  // });
  const boardComment = await client.boardComment.findUnique({
    where: {
      id: boardCommentId,
    },
    select: {
      id: true,
    },
  });

  if(!boardComment) {
    return { error:  "해당 댓글이 존재하지 않습니다." };
  }

  const totalComments = await client.boardComment.count({
    where: {
      boardId,
    },
  });

  const beforeComments = await client.boardComment.count({
    where: {
      boardId,
      // createAt 말고 id 가 작은 걸로 함.
      id: {
        lt: boardCommentId,
      },
    },
  });

  const offset = beforeComments - beforeComments%10;

  return { totalComments,offset };
  //  else {
  //   return { boardComment };
  // }
};

const resolver: Resolvers = {
  Query: {
    getNotifiedBoardComment: getNotifiedBoardCommentFn,
  },
};

export default resolver;