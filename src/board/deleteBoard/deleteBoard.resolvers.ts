import { Resolver, Resolvers } from "../../types";
import { protectResolver } from "../../user/user.utils";

const deleteBoardFn:Resolver = async(_,{id},{logInUserId,client}) => {
  const board = await client.board.findUnique({
    where:{
      id,
    },
    select:{
      userId:true,
    },
  });

  if(!board) {
    return { ok:false, error:"board not found"};
  } else if (board.userId !== logInUserId) {
    console.error("deleteBoard // 자기꺼 아닌 게시물 삭제 시도. 해킹 가능성 있음.");
    return { ok:false, error:"Not authorized" };
  }

  await client.board.delete({
    where:{
      id,
    },
  });

  return { ok: true };
};

const resolver:Resolvers = {
  Mutation: {
    deleteBoard:protectResolver(deleteBoardFn),
  },
};

export default resolver;