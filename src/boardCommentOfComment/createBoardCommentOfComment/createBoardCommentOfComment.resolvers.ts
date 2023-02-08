import { pushNotificationBoard } from "../../pushNotificationAndPublish";
import { Resolver, Resolvers } from "../../types";
import { protectResolver } from "../../user/user.utils";

const createBoardCommentOfCommentFn:Resolver = async(_,{boardCommentId,payload},{client,logInUserId}) => {
  if(!payload) return { ok:false,error:"Please write your comment" };

  const okAndBoardOwnerId = await client.boardComment.findUnique({
    where:{
      id:boardCommentId,
    },
    select:{
      userId:true,
    },
  });

  if(!okAndBoardOwnerId) return {ok:false,error:"No board is searched"};

  const newBoardCommentOfComment = await client.boardCommentOfComment.create({
    data:{
      payload,
      user:{
        connect:{
          id:logInUserId,
        },
      },
      boardComment:{
        connect:{
          id:boardCommentId,
        },
      },
    },
    select:{
      id:true,
      boardComment:{
        select:{
          userId:true,
          boardId:true,
        },
      },
    },
  });

  // const loggedInUserId = loggedInUser.id;
  const subscribeUserId = newBoardCommentOfComment.boardComment.userId;
  const boardId = newBoardCommentOfComment.boardComment.boardId;
  const commentOfCommentId = newBoardCommentOfComment.id;

  // 댓글 작성 후 notification, subscription
  // 댓글이 유저 본인꺼면 안보냄.
  if(logInUserId !== okAndBoardOwnerId.userId) {
    await pushNotificationBoard(client, "MY_BOARD_COMMENT_GET_COMMENT", subscribeUserId, {boardId, commentId:boardCommentId, commentOfCommentId});
  }

  return { ok:true, id:newBoardCommentOfComment.id };
};

const resolver:Resolvers = {
  Mutation:{
    createBoardCommentOfComment:protectResolver(createBoardCommentOfCommentFn),
  },
};

export default resolver;