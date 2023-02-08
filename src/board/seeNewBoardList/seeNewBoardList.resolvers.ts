import paginationErrorCheckNeedLogicAndQueryName from "../../paginationErrorCheckNeedLogicAndQueryName";
import { Resolver, Resolvers } from "../../types";
import { notGetBlockUsersLogicNeedLoggedInUserId } from "../../user/user.utils";

const logicSeeNewBoardList:Resolver = async(_,{cursorId},{client,logInUserId}) => {

  // 한번에 가져올 포스트 갯수
  const take = 10;

  const boards = await client.board.findMany({
    // 로그인한 유저인 경우 차단 유저 제외
    ...(logInUserId && {
      where: {
        user: notGetBlockUsersLogicNeedLoggedInUserId(logInUserId),
        // 신고 게시물 제외? 확인 필요. + 신고 몇개 이상 게시물도 안보이게
        accused: {
          none: {
            userId: logInUserId,
          },
        },
      },
    }),
    orderBy:{
      // createdAt:"desc",
      id: "desc",
    },
    take,
    ...(cursorId && {cursor:{id:cursorId}, skip:1}),
    select:{
      id:true,
      user:{
        select:{
          id:true,
          userName:true,
          avatar:true,
        },
      },
      title:true,
      thumbNail:true,
      // body 를 두줄만 받게 프론트에서 얘도 따로 저장하는게 나을듯?
      // body 말고 좋아요랑 댓글 조회수 이런걸 넣자
      // body:true,
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

const seeNewBoardListFn: Resolver = async(_,args,context) => {
  return paginationErrorCheckNeedLogicAndQueryName(
    await logicSeeNewBoardList(_,args,context,null),
    "seeNewBoardList"
  );
};

const resolver: Resolvers = {
  Query: {
    seeNewBoardList: seeNewBoardListFn,
  },
};

export default resolver;