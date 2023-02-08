import { Resolvers } from "../../types";

const resolvers: Resolvers = {
  Query: {
    seeProfile: async(_, { id }, { client,logInUserId }) => {
      const user = await client.user.findUnique({
        where: {
          id,
        },
        select: {
          id: true,
          userName: true,
          avatar: true,
        },
        // board 받아서 캐시 바꿔줘도 되겠네
      });

      if(user) {
        return { user, isMe: id === logInUserId };
      } else {
        return { error: "존재하지 않는 유저입니다." };
      }
    }
  },
};

export default resolvers;
