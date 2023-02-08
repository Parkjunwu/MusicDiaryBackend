import client from "../client";
import { notGetBlockUsersLogicNeedLoggedInUserId } from "../user/user.utils";

const take = 10;

export const getOffsetComments = async(
  boardId:number,
  loggedInUserId:number,
  offset:number
) => await client.boardComment.findMany({
    where: {
      boardId,
      // 로그인한 유저인 경우 차단 유저 제외
      ...(loggedInUserId && {
        user: notGetBlockUsersLogicNeedLoggedInUserId(loggedInUserId),
      }),
    },
    // orderBy: {
    //   createdAt: "desc",
    // },
    take,
    skip: offset,
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