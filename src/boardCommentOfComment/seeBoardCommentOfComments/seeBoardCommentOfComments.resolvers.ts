import paginationErrorCheckNeedLogicAndQueryName from "../../paginationErrorCheckNeedLogicAndQueryName";
import { Resolver, Resolvers } from "../../types";
import { notGetBlockUsersLogicNeedLoggedInUserId } from "../../user/user.utils";

const logicSeeBoardCommentOfComments: Resolver = async(_,{boardCommentId,cursorId,isGetAllCommentOfComments},{client,logInUserId}) => {

  const take = 5;


  const commentOfComments = await client.boardCommentOfComment.findMany({
    where: {
      boardCommentId,
      // 로그인한 유저인 경우 차단 유저 제외
      ...(logInUserId && {
        user: notGetBlockUsersLogicNeedLoggedInUserId(logInUserId),
      }),
    },
    // 얘는 과거부터 가져오도록
    // orderBy: {
    //   createdAt:"desc",
    // },
    // take,
    // isGetAllCommentOfComments 있으면 cursorId 부터 끝까지 다받음
    ...(!isGetAllCommentOfComments && { take }),
    ...(cursorId && { cursor: { id: cursorId }, skip: 1 }),
    include: {
      user: {
        select: {
          id: true,
          userName: true,
          avatar: true,
        },
      },
    },
  });

  const commentOfCommentsCount = commentOfComments.length;

  // 메세지 받은 개수가 한번에 가져올 갯수랑 달라. 그럼 마지막이라는 뜻. 다만 딱 한번에 가져올 갯수랑 맞아 떨어지면 다음에 가져올 게 없지만 그래도 있는 걸로 나옴.
  const isHaveHaveNextPage = isGetAllCommentOfComments ? false : commentOfCommentsCount === take;

  if( isHaveHaveNextPage ){
    const cursorId = commentOfComments[commentOfCommentsCount-1].id;
    return {
      cursorId,
      hasNextPage: true,
      commentOfComments,
    };
  } else {
    return {
      hasNextPage: false,
      commentOfComments,
    };
  }
};

const seeBoardCommentOfCommentsFn: Resolver = async(_,props,ctx) => {
  return paginationErrorCheckNeedLogicAndQueryName(
    await logicSeeBoardCommentOfComments(_,props,ctx,null),
    "seeBoardCommentOfComments"
  );
};

const resolver: Resolvers = {
  // SeeBoardCommentOfCommentsResponse:{
  //   // 프론트엔드에서 subscription mutation 데이터 받기 위함... 데이터 형식을 프론트엔드에서 못바꿔서..
  //   isNotFetchMore: () => false,
  //   // fetchedTime: () => new Date().getTime()+"",
  // },
  Query: {
    seeBoardCommentOfComments: seeBoardCommentOfCommentsFn,
  },
};

export default resolver;