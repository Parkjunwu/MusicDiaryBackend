import paginationErrorCheckNeedLogicAndQueryName from "../../paginationErrorCheckNeedLogicAndQueryName";
import { Resolver, Resolvers } from "../../types";
import { protectResolver } from "../user.utils";

const logicGetMyBoardList: Resolver = async(_,{cursorId},{client,logInUserId}) => {
  const take = 30;
  
  const boards = await client.board.findMany({
    where:{
      userId:logInUserId
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

const getMyBoardListFn = async(_, props, ctx) => {
  return paginationErrorCheckNeedLogicAndQueryName(
    await logicGetMyBoardList(_,props,ctx,null),
    "getMyBoardList"
  );
}

const resolver: Resolvers = {
  // GetMyBoardListResponse:{
  //   isNotFetchMore:() => false,
  // },
  Query: {
    getMyBoardList:protectResolver(getMyBoardListFn),
  },
};

export default resolver;