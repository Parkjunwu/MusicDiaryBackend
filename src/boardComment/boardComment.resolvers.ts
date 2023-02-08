import { Resolver, Resolvers } from "../types"

// userId 가 typeDefs 에 없는데 받아지네?!
const isMineFn:Resolver = ({userId},_,{logInUserId}) => userId === logInUserId;

const totalLikesFn:Resolver = ({id},_,{client}) => client.boardCommentLike.count({
  where:{
    boardCommentId:id,
  },
});

const totalCommentOfCommentsFn:Resolver = ({id},_,{client}) => client.boardCommentOfComment.count({
  where:{
    boardCommentId:id,
  },
});

const isLikedFn:Resolver = async({id},_,{client,logInUserId}) => {
  if(!logInUserId) return null;
  const result = await client.boardCommentLike.findFirst({
    where:{
      boardCommentId:id,
      userId:logInUserId
    },
    select:{
      id:true,
    },
  });
  return Boolean(result);
};

const resolver:Resolvers = {
  BoardComment:{
    isMine:isMineFn,
    totalLikes:totalLikesFn,
    totalCommentOfComments:totalCommentOfCommentsFn,
    isLiked:isLikedFn
  },
};

export default resolver;