import { Resolver, Resolvers } from "../../types";
import { protectResolver } from "../../user/user.utils";
import sendEmailAccuseInfoToOperator from "./sendEmailAccuseInfoToOperator";

const accuseBoardFn:Resolver = async(_,{id,reason,detail},{logInUserId,client}) => {
  const board = await client.board.findUnique({
    where: {
      id,
    },
    select: {
      userId: true,
    },
  });

  if(!board) {
    return { ok:false, error:"board not found" };
  }
  
  const alreadyAccused = await client.boardAccused.findUnique({
    where: {
      boardId_userId: {
        boardId: id,
        userId: logInUserId,
      },
    },
    select: {
      id: true,
    },
  });

  if(alreadyAccused){
    return { ok:true };
  }

  await client.boardAccused.create({
    data: {
      Board: {
        connect: {
          id,
        },
      },
      userId: logInUserId,
      reason,
      ...(detail && { detail }),
    },
  });

  const numberOfAccused = await client.boardAccused.count({
    where:{
      boardId:id,
    },
  });

  // 운영자에게 이메일 보냄
  sendEmailAccuseInfoToOperator("게시물",id,numberOfAccused,reason,detail,logInUserId);

  return { ok:true };
};

const resolver: Resolvers = {
  Mutation: {
    accuseBoard: protectResolver(accuseBoardFn),
  },
};

export default resolver;