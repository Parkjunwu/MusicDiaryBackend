import { Resolver, Resolvers } from "../../types";
import { protectResolver } from "../../user/user.utils";

const editBoardCommentOfCommentFn: Resolver = async(_,{id,payload},{client,logInUserId}) => {
  const boardCommentOfComment = await client.boardCommentOfComment.findUnique({
    where:{
      id,
    },
    select:{
      userId:true,
    },
  });

  if (!boardCommentOfComment) {
    return { ok:false, error:"commentOfComment not found" };
  } else if (boardCommentOfComment.userId !== logInUserId) {
    return { ok:false, error:"Not authorized" };
  }

  await client.boardCommentOfComment.update({
    where:{
      id,
    },
    data:{
      payload,
    },
    select:{
      id:true,
    },
  });

  return {ok:true};
};

const resolver:Resolvers = {
  Mutation :{
    editBoardCommentOfComment:protectResolver(editBoardCommentOfCommentFn),
  },
};

export default resolver;