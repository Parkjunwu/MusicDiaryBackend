import { pushNotificationBoard } from "../../pushNotificationAndPublish";
import { Resolver, Resolvers } from "../../types";
import { protectResolver } from "../../user/user.utils";

const toggleBoardCommentOfCommentLikeFn:Resolver = async(_,{id},{client,logInUserId}) => {
  // 코멘트 있는지.
  const boardCommentOfComment = await client.boardCommentOfComment.findUnique({
    where:{
      id
    },
    select:{
      id:true,
    },
  });

  if(!boardCommentOfComment) return {ok:false,error:"commentOfComment not found"};
  
  const likeWhere = {
    boardCommentOfCommentId_userId:{
      boardCommentOfCommentId:id,
      userId:logInUserId,
    },
  };

  const like = await client.boardCommentOfCommentLike.findUnique({
    where:likeWhere,
    select:{
      id:true,
    },
  });

  if(like) {
    await client.boardCommentOfCommentLike.delete({where:likeWhere});
  } else {
    const result = await client.boardCommentOfCommentLike.create({
      data:{
        userId:logInUserId,
        boardCommentOfCommentId:id,
      },
      select:{
        boardCommentOfComment:{
          select:{
            userId:true,
            boardComment:{
              select:{
                boardId:true,
              },
            },
            boardCommentId:true,
          },
        },
      },
    });

    // const loggedInUserId = loggedInUser.id;
    const subscribeUserId = result.boardCommentOfComment.userId;
    const boardId = result.boardCommentOfComment.boardComment.boardId;
    const commentId = result.boardCommentOfComment.boardCommentId;
    const commentOfCommentId = id;

    // 좋아요 완료 후 notification, subscription
    // 좋아요 한 사람이 본인이면 안보냄.
    if(logInUserId !== subscribeUserId) {
      await pushNotificationBoard(client, "MY_BOARD_COMMENT_OF_COMMENT_GET_LIKE", subscribeUserId,{boardId, commentId, commentOfCommentId});
    }
  };

  
  return { ok:true };
};

const resolver:Resolvers = {
  Mutation:{
    toggleBoardCommentOfCommentLike:protectResolver(toggleBoardCommentOfCommentLikeFn),
  },
};

export default resolver;