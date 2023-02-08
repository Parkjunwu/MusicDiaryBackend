import { Resolver, Resolvers } from "../types"

// // 얜 그냥 받는데에서 include 해서 쓰는게 더 낫지 않을까?
// const userFn:Resolver = ({userId},_,{client}) => client.user.findUnique({where:{id:userId}})

const likesFn:Resolver = ({id},_,{client}) => client.boardLike.count({where:{boardId:id}})

const isMineFn:Resolver = ({userId},_,{logInUserId}) => userId === logInUserId;

const commentNumberFn:Resolver = ({id},_,{client}) => client.boardComment.count({where:{
  boardId:id,
}});

const isLikedFn: Resolver = async({id},_,{logInUserId,client}) => {
  if(!logInUserId) return false;
  const ok = await client.boardLike.findUnique({
    where:{
      boardId_userId:{
        boardId:id,
        userId:logInUserId,
      },
    },
    select:{
      id:true,
    },
  });
  return Boolean(ok);
};

// 혹시 comment 도 받을거면 user include 까지 같이


const resolver: Resolvers = {
  Board:{
    // user:userFn,
    likes:likesFn,
    isMine:isMineFn,
    commentNumber:commentNumberFn,
    isLiked:isLikedFn,
  },
};

export default resolver;