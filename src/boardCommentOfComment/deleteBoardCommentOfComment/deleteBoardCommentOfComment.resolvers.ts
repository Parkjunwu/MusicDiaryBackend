import { Resolver, Resolvers } from "../../types";
import { protectResolver } from "../../user/user.utils";

const deleteBoardCommentOfCommentFn:Resolver = async(_,{id},{logInUserId,client}) => {
  const boardCommentOfComment = await client.boardCommentOfComment.findUnique({
    where:{
      id,
    },
    select:{
      userId:true,
    },
  });

  if(!boardCommentOfComment) {
    return { ok:false, error:"commentOfComment not found" };
  } else if (boardCommentOfComment.userId !== logInUserId) {
    return { ok:false, error:"Not authorized" };
  }

  await client.boardCommentOfComment.delete({
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
    deleteBoardCommentOfComment:protectResolver(deleteBoardCommentOfCommentFn),
  },
};

export default resolver;