import { pushNotificationBoard } from "../../pushNotificationAndPublish";
import { Resolver, Resolvers } from "../../types";
import { protectResolver } from "../../user/user.utils";

const toggleBoardLikeFn:Resolver = async(_,{id},{client,logInUserId}) => {
  const board = await client.board.findUnique({
    where:{
      id
    },
    select:{
      id:true,
    },
  });
  if(!board) return {ok:false,error:"board not found"}
  const likeWhere = {
    boardId_userId:{
      boardId:id,
      userId:logInUserId,
    },
  };
  const like = await client.boardLike.findUnique({
    where:likeWhere,
    select:{
      id:true,
    },
  });
  if(like) {
    await client.boardLike.delete({where:likeWhere});
  } else {
    const result = await client.boardLike.create({
      data:{
        userId:logInUserId,
        boardId:id,
        // user:{
        //   connect:{
        //     id:loggedInUser.id
        //   }
        // },
        // board:{
        //   connect:{
        //     id
        //     // id:board.id
        //   }
        // }
      },
      select:{
        board:{
          select:{
            userId:true,
            id:true,
          }
        }
      }
    });

    // subscription, push notification 은 일단 나중에

    const subscribeUserId = result.board.userId;
    const boardId = id;
    // 좋아요 완료 후 notification, subscription
    // 좋아요 한 사람이 본인이면 안보냄.
    if(logInUserId !== subscribeUserId) {
      await pushNotificationBoard(client, "MY_BOARD_GET_LIKE", subscribeUserId, { boardId });
    }
  }

  return { ok:true };
}

const resolver:Resolvers = {
  Mutation:{
    toggleBoardLike:protectResolver(toggleBoardLikeFn),
  },
};

export default resolver;