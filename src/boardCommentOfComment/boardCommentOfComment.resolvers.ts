import { Resolver, Resolvers } from "../types"

const isMineFn: Resolver = ({userId},_,{logInUserId}) => userId === logInUserId;

const totalLikesFn: Resolver = ({id},_,{client}) => client.boardCommentOfCommentLike.count({
  where: {
    boardCommentOfCommentId: id,
  },
});

const isLikedFn: Resolver = async({id},_,{client,logInUserId}) => {
  if(!logInUserId) return null;
  const result = await client.boardCommentOfCommentLike.findFirst({
    where: {
      boardCommentOfCommentId: id,
      userId: logInUserId,
    },
    select: {
      id: true,
    },
  });
  return Boolean(result);
};

const resolver: Resolvers = {
  BoardCommentOfComment: {
    isMine: isMineFn,
    totalLikes: totalLikesFn,
    isLiked: isLikedFn,
  },
};

export default resolver;