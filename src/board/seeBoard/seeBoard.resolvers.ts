import { Resolver, Resolvers } from "../../types";

const seeBoardFn: Resolver = async(_,{id},{client,}) => {

  // 얘도 차단 걸를라면 걸러
  const board = await client.board.findUnique({
    where: {
      id,
    },
    select: {
      id: true,
      body: true,
      file: true,
      // userId 를 받아야 얘로 isMine 받음.
      userId: true,
      title: true,
    },
    // 유저 정보 include ? route 로 받음.
    // include:{
    //   user:{
    //     select:{
    //       id:true,
    //       userName:true,
    //       avatar:true,
    //     },
    //   },
    // },
  });
  return board;
};

const resolver: Resolvers = {
  Query:  {
    seeBoard: seeBoardFn,
  },
};

export default resolver;