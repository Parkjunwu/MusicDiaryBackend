import paginationErrorCheckNeedLogicAndQueryName from "../../paginationErrorCheckNeedLogicAndQueryName";
import { Resolver, Resolvers } from "../../types";

const logicGetUserBoardList: Resolver = async(_,{userId,cursorId},{client}) => {
  
  const take = 30;
  
  const boards = await client.board.findMany({
    where:{
      userId
    },
    orderBy:{
      // createdAt:"desc"
      id: "desc",
    },
    take,
    ...(cursorId && { skip:1 , cursor: { id: cursorId } }),
    select:{
      id:true,
      title:true,
      thumbNail:true,
      createdAt:true,
      // 이게 있어야 될라나?
      // userId:true,
    },
  });
  
  const boardsCount = boards.length;

  // 메세지 받은 개수가 한번에 가져올 갯수랑 달라. 그럼 마지막이라는 뜻. 다만 딱 한번에 가져올 갯수랑 맞아 떨어지면 다음에 가져올 게 없지만 그래도 있는 걸로 나옴.
  const isHaveHaveNextPage = boardsCount === take;

  if( isHaveHaveNextPage ){
    const cursorId = boards[boardsCount-1].id;
    return {
      cursorId,
      hasNextPage:true,
      boards,
    };
  } else {
    return {
      hasNextPage:false,
      boards,
    };
  }
};

const resolver:Resolvers = {
  Query: {
    getUserBoardList: async(_, props, ctx) => {
      return paginationErrorCheckNeedLogicAndQueryName(
        await logicGetUserBoardList(_,props,ctx,null),
        "getUserBoardList"
      );
    },
  },
};

export default resolver;