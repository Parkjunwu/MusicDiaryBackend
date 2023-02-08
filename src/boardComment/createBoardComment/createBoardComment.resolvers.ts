import { pushNotificationBoard } from "../../pushNotificationAndPublish";
import { Resolver, Resolvers } from "../../types";
import { protectResolver } from "../../user/user.utils";
import { getOffsetComments } from "../boardCommentUtils";

const createBoardCommentFn:Resolver = async(_,{boardId,payload},{client,logInUserId}) => {
  if(!payload) return {ok:false,error:"Please write your comment"};

  const okAndBoardOwnerId = await client.board.findUnique({
    where:{
      id:boardId,
    },
    select:{
      userId:true,
    },
  });

  if(!okAndBoardOwnerId) return {ok:false,error:"No photo on there"};

  const newBoardComment = await client.boardComment.create({
    data:{
      payload,
      user:{
        connect:{
          id:logInUserId,
        },
      },
      board:{
        connect:{
          id:boardId,
        },
      },
    },
    select:{
      id:true,
      board:{
        select:{
          userId:true,
        },
      },
    },
  });

  const subscribeUserId = newBoardComment.board.userId;
  const commentId = newBoardComment.id;

  // 댓글 작성 후 notification, subscription
  // 댓글이 유저 본인꺼면 안보냄.
  if(logInUserId !== okAndBoardOwnerId.userId) {
    await pushNotificationBoard(client, "MY_BOARD_GET_COMMENT", subscribeUserId, {boardId, commentId});
  }

  const totalCommentsNumber = await client.boardComment.count({
    where:{
      boardId,
    },
  });

  const offset = totalCommentsNumber - totalCommentsNumber%10;

  const offsetComments = await getOffsetComments(boardId,logInUserId,offset);

  // return { ok:true, id:newBoardComment.id };
  return { ok:true, totalCommentsNumber, offsetComments };
};

const resolver:Resolvers = {
  Mutation:{
    createBoardComment:protectResolver(createBoardCommentFn),
  },
};

export default resolver;