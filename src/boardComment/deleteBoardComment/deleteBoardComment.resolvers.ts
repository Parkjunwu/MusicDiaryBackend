import { Resolver, Resolvers } from "../../types";
import { protectResolver } from "../../user/user.utils";

const deleteBoardCommentFn:Resolver = async(_,{id},{logInUserId,client}) => {
  const boardComment = await client.boardComment.findUnique({
    where:{
      id,
    },
    select:{
      userId:true,
    },
  });

  if(!boardComment) {
    return { ok:false, error:"comment not found"};
  } else if (boardComment.userId !== logInUserId) {
    return { ok:false, error:"Not authorized"};
  }

  await client.boardComment.delete({
    where:{
      id,
    },
    select:{
      id:true,
    },
  });

  return {ok:true};
};

const resolver:Resolvers = {
  Mutation: {
    deleteBoardComment:protectResolver(deleteBoardCommentFn),
  },
};

export default resolver;