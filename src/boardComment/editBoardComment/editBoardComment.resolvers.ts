import { Resolver, Resolvers } from "../../types";
import { protectResolver } from "../../user/user.utils";

const editBoardCommentFn: Resolver = async(_,{id,payload},{client,logInUserId}) => {
  const boardComment = await client.boardComment.findUnique({
    where:{
      id,
    },
    select:{
      userId:true,
    },
  });

  if (!boardComment) {
    return {ok:false, error:"comment not found"};
  } else if (boardComment.userId !== logInUserId) {
    return {ok:false, error:"Not authorized"};
  }

  await client.boardComment.update({
    where:{
      id
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
    editBoardComment:protectResolver(editBoardCommentFn),
  },
};

export default resolver;