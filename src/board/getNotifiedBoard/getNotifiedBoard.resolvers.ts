import { Resolver, Resolvers } from "../../types";

const getNotifiedBoardFn: Resolver = async(_,{boardId},{client,}) => {
  const board = await client.board.findUnique({
    where: {
      id:boardId,
    },
    // 거의 다받음
    select: {
      id: true,
      title: true,
      body: true,
      file: true,
      // userId 를 받아야 얘로 isMine 받음. 얘도 있어야 하나?
      userId: true,
      createdAt: true,
      // 유저 정보 받는거 말고 seeBoard 랑 똑같음, 에러도 반환
      user:{
        select:{
          id:true,
          userName:true,
          avatar:true,
        },
      },
    },
    // include:{
    //   user:{
    //     select:{
    //       id:true,
    //       userName:true,
    //       avatar:true,
    //     },
    //   },
    // }
  });
  
  
  if(!board) {
    return { error: "해당 게시물이 존재하지 않습니다." };
  } else {
    return { board };
  }
};

const resolver: Resolvers = {
  Query: {
    getNotifiedBoard: getNotifiedBoardFn,
  },
};

export default resolver;