import { pushNotificationBoard } from "../../pushNotificationAndPublish";
import { Resolver, Resolvers } from "../../types";
import { protectResolver } from "../../user/user.utils";

const toggleBoardCommentLikeFn:Resolver = async(_,{id},{client,logInUserId}) => {
  // 코멘트 있는지.
  const boardComment = await client.boardComment.findUnique({
    where:{
      id
    },
    select:{
      id:true,
    },
  });

  if(!boardComment) return {ok:false,error:"comment not found"};

  const likeWhere = {
    boardCommentId_userId:{
      boardCommentId:id,
      userId:logInUserId,
    },
  };

  const like = await client.boardCommentLike.findUnique({
    where:likeWhere,
    select:{
      id:true,
    },
  });

  if(like) {
    await client.boardCommentLike.delete({
      where:likeWhere,
    });
  } else {
    const result = await client.boardCommentLike.create({
      data:{
        userId:logInUserId,
        boardCommentId:id,
        // user:{
        //   connect:{
        //     id:logInUserId
        //   }
        // },
        // comment:{
        //   connect:{
        //     id
        //     // id:comment.id
        //   }
        // }
      },
      select:{
        boardComment:{
          select:{
            userId:true,
            boardId:true,
          },
        },
      },
    });

    // const loggedInUserId = loggedInUser.id;
    const subscribeUserId = result.boardComment.userId;
    const boardId = result.boardComment.boardId;
    const commentId = id;

    // 좋아요 완료 후 notification, subscription
    // 좋아요 한 사람이 본인이면 안보냄.
    if(logInUserId !== subscribeUserId) {
      await pushNotificationBoard(client, "MY_BOARD_COMMENT_GET_LIKE", subscribeUserId, {boardId, commentId});
    }
  }
  
  return { ok:true };
};

const resolver:Resolvers = {
  Mutation:{
    toggleBoardCommentLike:protectResolver(toggleBoardCommentLikeFn),
  },
};

export default resolver;