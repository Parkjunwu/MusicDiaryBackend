import { Resolver, Resolvers } from "../../types";
import { protectResolver } from "../user.utils";

// 아직 차단했다고 뭐를 막는건 구현 안했음. 글고 지금은 id 만 넣고 relation 으로 구현 안함.
const unblockUserFn: Resolver = async(_,{id}:{id:number},{client,logInUserId}) => {
  // 유저 존재 하는지
  const isUser = await client.user.findUnique({
    where:{
      id,
    },
    select:{
      id:true,
    },
  });
  
  // 해당 유저가 없을 때.
  if(!isUser) {
    return {ok:false, error:"해당 유저가 존재하지 않습니다."};
  }
  
  // 차단 목록에 넣음
  await client.user.update({
    where:{
      id:logInUserId,
    },
    data:{
      blockUsers:{
        disconnect:{
          id,
        },
      },
    },
    select:{
      id:true,
    },
  });
  
  // const isRoomHave = await findRoomId(logInUserId,id);

  // if(isRoomHave) {
  //   await client.userOnRoom.update({
  //     where:{
  //       userId_roomId:{
  //         userId:logInUserId,
  //         roomId:isRoomHave.id,
  //       },
  //     },
  //     data:{
  //       isBlockOpponent:false,
  //       blockCancelTime:new Date(),
  //     },
  //   });
  // }

  return {ok:true};
};

const resolver: Resolvers = {
  Mutation: {
    unblockUser: protectResolver(unblockUserFn),
  },
};

export default resolver;