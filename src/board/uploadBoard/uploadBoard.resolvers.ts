// import { pushNotificationUpload } from "../../pushNotificationAndPublish";
import { async_uploadPhotoS3, async_uploadThumbNailS3, S3_FOLDER_NAME } from "../../shared/AWS";
import { Resolver, Resolvers } from "../../types";
import { protectResolver } from "../../user/user.utils";

const uploadBoardFn: Resolver = async(_,{title,fileArr,body,thumbNailArr,isFirstVideo,},{client,logInUserId}) => {
  
  // uploadBoard 타입 체크랑 똑같음
  // isFirstVideo 넣어서 isFirstVideo true 인데 fileArr 없거나 thumbNailArr 없는 경우도
  const noFileArr = fileArr.length === 0;
  const noThumbNail = !thumbNailArr || thumbNailArr.length === 0;
  if((noFileArr && !noThumbNail)) {
    console.error("uploadBoard // get thumbNailArr without fileArr. Hacking possibility.");
    return { ok:false, error:"잘못된 형식입니다." };
  }
  if(isFirstVideo && noFileArr) {
    console.error("uploadBoard // get isFirstVideo true without fileArr. Hacking possibility.");
    return { ok:false, error:"잘못된 형식입니다." };
  }
  if(isFirstVideo && noThumbNail) {
    console.error("uploadBoard // get isFirstVideo true without thumbNailArr. Hacking possibility.");
    return { ok:false, error:"잘못된 형식입니다." };
  }

// console.log(JSON.stringify(fileArr.map(file=>file.file?.mimetype)))

  // // 지금은 이미지만 쓸거라서 이거 넣음
  // if(fileArr.some(file=>file.file?.mimetype !== "image/jpeg")) {
  //   console.error("uploadBoard // fileArr get something not image. Hacking possibility.");
  //   return { ok:false, error:"잘못된 형식입니다." };
  // }
  if(fileArr.length > 10) {
    return {ok:false, error:"10장 이상의 사진을 업로드 하실 수 없습니다."}
  }


  // 업로드할 url 배열
  let addFileUrlArr:Array<string>;
  // let thumbNailUrl:string|undefined;
  let addThumbNailUrlArr:Array<string>;
  try {
    //aws 업로드. url 받은 거 데이터베이스에도 씀. await Promise.all , map 같이 써야하는거 유의
    const dateForUnique = Date.now();
    addFileUrlArr = await Promise.all(
      fileArr.map(async (file:any) => {
        if(logInUserId){
          const url = await async_uploadPhotoS3(file,logInUserId,dateForUnique,S3_FOLDER_NAME);
          return url;
        }
      })
    );

    // if(thumbNail){
    //   thumbNailUrl = await async_uploadPhotoS3(thumbNail,logInUserId,dateForUnique,S3_FOLDER_NAME);
    // }
    if(thumbNailArr){
      addThumbNailUrlArr = await Promise.all(
        thumbNailArr.map(async (file:any) => {
          const url = await async_uploadThumbNailS3(file,logInUserId,dateForUnique);
          return url;
        })
      );
    }
  } catch (e) {
    console.log(e);
    console.log("uploadBoard // 파일 업로드 에러");
    return {ok:false, error:"파일 업로드에 실패하였습니다."}
  }
  
  // let hashTags = null;
  // if(body) {
  //   hashTags = processHashtags(body)
  // }
  // const isHaveFile = addFileUrlArr.length !== 0;

  const thumbNail = isFirstVideo ? addThumbNailUrlArr[0] : addFileUrlArr[0]; // 없으면 undefined 일듯? addFileUrlArr 가 어쨋든 [] 라도 있으니까.

  const result = await client.board.create({
    data:{
      user:{
        connect:{
          id:logInUserId,
        },
      },
      title,
      file: addFileUrlArr,
      body,
      // isFirstVideo: Boolean(isFirstVideo),
      // firstPhotoForVideo 있으면 얘고 아니면 첫번째 사진
      // firstPhoto: firstPhotoForVideo ?? addFileUrlArr[0],
      // ...(thumbNailUrl && {thumbNail: thumbNailUrl}),
      ...(thumbNail && { thumbNail }),
      // ...(hashTags && {BoardOnHashTag:{
      //   create:hashTags
      // }}),
    },
    // 굳이 다 받을 필요 없으니 얘를 써도 됨. 나머지는 프론트엔드에서 캐시로 구현. 귀찮으면 그냥 전체 다 받음.
    select:{
      id:true,
      createdAt:true,
    }
  });

  // 유저 총 게시물 갯수 여기서 늘려줘도 됨.

  // const boardId = result.id;

  // 완료 후 notification 전송 + subscription pubsub 전송
  // await pushNotificationUpload(client, boardId, "board");

  return { ok:true, uploadedBoard:result };
};

const resolver:Resolvers = {
  Mutation: {
    uploadBoard: protectResolver
    (uploadBoardFn),
  },
};

export default resolver;