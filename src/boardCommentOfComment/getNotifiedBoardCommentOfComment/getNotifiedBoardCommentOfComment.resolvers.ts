import { Resolver, Resolvers } from "../../types";

const getNotifiedBoardCommentOfCommentFn: Resolver = async(_,{boardCommentOfCommentId},{client,}) => {
  const boardCommentOfComment = await client.boardCommentOfComment.findUnique({
    where: {
      id: boardCommentOfCommentId,
    },
    include: {
      user: {
        select: {
          id: true,
          userName: true,
          avatar: true,
        },
      },
    },
  });

  if(!boardCommentOfComment) {
    return { error: "해당 댓글이 존재하지 않습니다." };
  } else {
    return { boardCommentOfComment };
  }
};

const resolver: Resolvers = {
  Query: {
    getNotifiedBoardCommentOfComment:getNotifiedBoardCommentOfCommentFn,
  },
};

export default resolver;