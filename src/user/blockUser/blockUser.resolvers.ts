import { Resolver, Resolvers } from "../../types";
import { protectResolver } from "../user.utils";


const blockUserFn: Resolver = async(_,{id}:{id:number},{client,logInUserId}) => {
  // 유저 존재 하는지
  const isUser = await client.user.findUnique({
    where:{
      id,
    },
    select:{
      id:true,
    },
  });
  
  // 해당 id 유저가 없을 때.
  if(!isUser) {
    return {ok:false, error:"해당 유저가 존재하지 않습니다."}
  }

  // 차단 목록에 넣음.
  await client.user.update({
    where:{
      id:logInUserId,
    },
    data:{
      blockUsers:{
        connect:{
          id,
        },
      },
    },
    select:{
      id:true,
    }
  });

  // // 채팅방 있으면 안받도록
  // const ifHaveRoomThenReturnRoomId = await findRoomId(logInUserId,id);

  // // 이전에 안읽은 메세지 갯수
  // let beforeUnreadTotal:number;
  
  // if(ifHaveRoomThenReturnRoomId){
  //   beforeUnreadTotal = await client.message.count({
  //     where:{
  //       roomId:ifHaveRoomThenReturnRoomId.id,
  //       user:{
  //         id:{
  //           not:logInUserId
  //         }
  //       },
  //       read:false
  //     }
  //   });
  // } else {
  //   beforeUnreadTotal = 0;
  // }

  // if(ifHaveRoomThenReturnRoomId) {
  //   await client.userOnRoom.update({
  //     where:{
  //       userId_roomId:{
  //         userId:logInUserId,
  //         roomId:ifHaveRoomThenReturnRoomId.id
  //       }
  //     },
  //     data:{
  //       isBlockOpponent:true,
  //       blockTime:new Date()
  //     },
  //   });
  // }

  return { ok:true };
};

const resolver:Resolvers = {
  Mutation: {
    blockUser:protectResolver(blockUserFn),
  },
};

export default resolver;