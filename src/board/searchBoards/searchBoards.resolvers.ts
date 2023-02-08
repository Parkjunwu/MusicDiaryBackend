import paginationErrorCheckNeedLogicAndQueryName from "../../paginationErrorCheckNeedLogicAndQueryName";
import { Resolver, Resolvers } from "../../types";
import { notGetBlockUsersLogicNeedLoggedInUserId } from "../../user/user.utils";

const logicSearchBoards: Resolver = async(_,{keyword,cursorId},{client,logInUserId}) => {

  const take = 10;

  const boards = await client.board.findMany({
    where: {
      // title 로 찾음
      title: {
        contains: keyword,
      },
      // 차단 유저 제외
      ...(logInUserId && {
        user: notGetBlockUsersLogicNeedLoggedInUserId(logInUserId),
      }),
    },
    select:{
      id:true,
      user:{
        select:{
          id:true,
          userName:true,
          avatar:true,
        }
      },
      title:true,
      createdAt:true,
      thumbNail:true,
    },
    orderBy: {
      // createdAt: "desc"
      id: "desc",
    },
    take,
    ...(cursorId && {cursor: {id:cursorId}, skip:1}),
  });

  const boardsCount = boards.length;

  // 메세지 받은 개수가 한번에 가져올 갯수랑 달라. 그럼 마지막이라는 뜻. 다만 딱 한번에 가져올 갯수랑 맞아 떨어지면 다음에 가져올 게 없지만 그래도 있는 걸로 나옴.
  const isHaveHaveNextPage = boardsCount === take;

  if( isHaveHaveNextPage ){
    const cursorId = boards[boardsCount-1].id;
    return {
      cursorId,
      hasNextPage: true,
      boards,
    };
  } else {
    return {
      hasNextPage: false,
      boards,
    };
  }
};

const searchBoardsFn: Resolver = async(_,props,ctx) => {
  return paginationErrorCheckNeedLogicAndQueryName(
    await logicSearchBoards(_,props,ctx,null),
    "searchBoards"
  );
};

const resolver: Resolvers = {
  Query: {
    searchBoards: searchBoardsFn,
  },
};

export default resolver;