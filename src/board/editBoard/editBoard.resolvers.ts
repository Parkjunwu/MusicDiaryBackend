import { async_deletePhotoS3, async_uploadPhotoS3, async_uploadThumbNailS3, S3_FOLDER_NAME } from "../../shared/AWS";
import { Resolver, Resolvers } from "../../types";
import { protectResolver } from "../../user/user.utils";

const editBoardFn: Resolver = async(_, {id, title, body, addFileArr, addFileIndexArr, deleteFileArr, wholeFileArr, changeThumbNail, addThumbNailArr, }, {client, logInUserId}) => {

  // editBoard 랑 거의 똑같음
  const oldBoard = await client.board.findFirst({
    where:{
      id,
      userId:logInUserId,
    },
    select:{
      // id:true,
      thumbNail:true,
    },
  });


  if(!oldBoard) return {ok:false,error:"Can't edit another user's Board"}


  // 일단 받은 배열 wholeFileArr 에 결과를 집어넣음
  if(wholeFileArr?.length > 10) {
    return {ok:false, error:"한 게시물 당 10개 이상의 사진을 올릴 수 없습니다."}
  }

  if(wholeFileArr && !addFileArr && !addFileIndexArr && !deleteFileArr) {
    // wholeFileArr 가 왔는데 addFileArr, addFileIndexArr, deleteFileArr 가 같이 안오면 에러. 이상한 접근.
    console.log("editBoard // wholeFileArr doesn't get with addFileArr, addFileIndexArr")
    return {ok:false, error:"알 수 없는 접근입니다. 계속해서 같은 문제 발생 시 문의 주시면 감사드리겠습니다."}
  }

  if(addFileArr?.length !== addFileIndexArr?.length) {
    // addFileArr, addFileIndexArr 하나만 왔거나 addFileArr, addFileIndexArr length 가 안맞으면 이상한 접근.
    console.log("editBoard // addFileArr, addFileIndexArr 하나만 왔거나 addFileArr, addFileIndexArr length 가 안맞으면 이상한 접근.")
    return {ok:false, error:"알 수 없는 접근입니다. 계속해서 같은 문제 발생 시 문의 주시면 감사드리겠습니다."}
  }

  // if(deletePrevThumbNail) {
  //   const prevThumbNail = oldBoard.thumbNail;
  //   if(prevThumbNail === null) {
  //     console.error("썸넬을 지우라고 했는데 썸넬이 없음. 해킹 가능성 있음")
  //     return {ok:false,error:"이전 사진들 목록과 다릅니다. 계속해서 같은 문제 발생 시 문의 주시면 감사드리겠습니다."}
  //   }
  //   try {
  //     await async_deletePhotoS3(prevThumbNail)
  //   } catch (e) {
  //     return {ok:false, error:"Delete file Error"}
  //   }
  // }
  const noWholeFile = !wholeFileArr || wholeFileArr.length === 0;
  const noAddThumbNail = !addThumbNailArr || addThumbNailArr.length === 0;
  if((noWholeFile && !noAddThumbNail)) {
    console.error("editBoard // get addThumbNailArr without wholeFileArr. Hacking suspected.");
    return {ok:false, error:"알 수 없는 접근입니다. 계속해서 같은 문제 발생 시 문의 주시면 감사드리겠습니다."};
  }

  // // 지금은 이미지만 쓸거라서 이거 넣음
  // if(addFileArr?.some(file=>file.file?.mimetype !== "image/jpeg")) {
  //   console.log("mimetype : "+ JSON.stringify(addFileArr?.map(file=>file.file?.mimetype)))
  //   console.error("editBoard // addFileArr get something not image or [Upload] getting error. Hacking possibility.");
  //   // return { ok:false, error:"잘못된 형식입니다." };
  //   return { ok:false, error:"사진 업로드에 실패하였습니다." };
  // }


    // deleteFileArr, wholeFileArr 왔을 때 검증. 이전 사진 목록과 대조.
  if (deleteFileArr || wholeFileArr) {
    // 이전 사진 목록
    const prevBoard = await client.board.findUnique({
      where:{
        id
      },
      select:{
        file:true
      }
    });
    
    const prevJsonFileArr = prevBoard.file;
    let prevFileArr = [];
    if(prevJsonFileArr && typeof prevJsonFileArr === 'object' && Array.isArray(prevJsonFileArr)) {
      prevFileArr = prevJsonFileArr;
    }
    
    // 전체 목록이 이전에 있는 목록이랑 다른지. 그것도 확인
    if (wholeFileArr) {
      try {
        wholeFileArr.map((url:string) => {
          // 추가할 곳은 넘어감
          if(url === "") return;
          const isInPrevFile = prevFileArr.includes(url);
          // 없으면 에러 메세지 출력하고 에러 메세지 전송.
          if(!isInPrevFile){
            throw Error("editBoard // 전체 사진 목록에 이전 사진 목록에 없는 사진이 있음. 해킹 가능성 있음.")
          }
        })
      } catch (e) {
        console.log(e);
        return { ok:false, error:"이전 사진들 목록과 다릅니다. 계속해서 같은 문제 발생 시 문의 주시면 감사드리겠습니다."}
      }
    }

    if (deleteFileArr){
      // 여기서 하나라도 다른게 있으면 아예 삭제를 안하거나, 아니면 있는 애들은 지우고 없는 거만 오류 출력하거나.
      // 캐시를 쓰면 실제 데이터와 로컬 데이터가 달라질 수 있어서 문제가 있을 거 같긴 한데, 그래도 아예 안하게 하는게 낫겠지?
      try {
        deleteFileArr.map((url:string) => {
          const isInPrevFile = prevFileArr.includes(url);
          // 없으면 에러 메세지 출력하고 에러 메세지 전송.
          if(!isInPrevFile){
            throw Error("editBoard // 지울 사진이 이전 사진 목록에 없음. 해킹 가능성 있음.")
          }
        })
      } catch (e) {
        console.log(e);
        return { ok:false, error:"이전 사진들 목록과 다릅니다. 계속해서 같은 문제 발생 시 문의 주시면 감사드리겠습니다."}
      }

      // S3 삭제
      try {
        await Promise.all(
          deleteFileArr.map((async(deleteFileUrl:string) => {
            await async_deletePhotoS3(deleteFileUrl)
          }))
        )
      } catch (e) {
        return {ok:false, error:"Delete file Error"}
      }
    } 
  }

  const dateForUnique = Date.now();

  if(addFileArr){
    try {
      await Promise.all(
        addFileArr.map(async (fileObj,index) => {
          if(logInUserId){
            const url = await async_uploadPhotoS3(fileObj, logInUserId, dateForUnique, S3_FOLDER_NAME)
            // return  url 
            // wholeFileArr 의 index 에 url 을 넣음
            wholeFileArr[addFileIndexArr[index]] = url;
          }
        })
      )
    } catch (e) {
      return returnUploadFailNeedWhichAndError("image/video",e);
    }
  }

  //  근데 만약 사진은 지웠는데 올리는데서 오류났어, 그러면 다시 복구하는 코드도 작성해야 하지 않나??

  let firstThumbNail: string;
  if(addThumbNailArr){
    try {
      await Promise.all(
        addThumbNailArr.map(async (fileObj,index) => {
          const url = await async_uploadThumbNailS3(fileObj, logInUserId, dateForUnique);
          if(index === 0) { firstThumbNail = url; }
        })
      );
    } catch (e) {
      return returnUploadFailNeedWhichAndError("thumbNail",e);
    }
  }

  let newThumbNail: string|undefined|null = undefined;
  
  if (changeThumbNail === null) {
    // 그냥 이전 ThumbNail null 로. 이건 파일 목록이 없어야 되는건데 이것도 확인할까?
    const prevThumbNail = oldBoard.thumbNail;
    if(prevThumbNail === null) {
      console.error("get thumbNail change but not have prev thumbNail. Hacking suspected");
      return {ok:false,error:"이전 사진들 목록과 다릅니다. 계속해서 같은 문제 발생 시 문의 주시면 감사드리겠습니다."}
    }
    newThumbNail = null;
  } else if (changeThumbNail === true) {
    // wholeFileArr 0번째를 썸넬로. m3u8 이면 url 뽑아서 걔로 넣음.
    // 뭐 체크해줘야 할거 같은데 위에서 해주면 될라나?
    const isVideo = wholeFileArr[0].split("/").includes("video");
    // firstThumbNail 있는지 체크 해야하나?
    newThumbNail = isVideo ? firstThumbNail : wholeFileArr[0];
  }
  
  const isThumbNailChanged = newThumbNail !== undefined;
  
  await client.board.update({
    where:{
      id
    },
    data:{
      ...( title && { title }),
      ...( body && { body }),
      // gettingThumbNail 있으면 새 썸넬, 없고 deleteThumbNailFieldData true 면 null 
      ...( isThumbNailChanged && { thumbNail: newThumbNail }),
      ...( wholeFileArr && { file:wholeFileArr }),
    },
    select:{
      id:true,
    },
  });
  // 결과 Board 도 보내줘야 할거 같은데..
  return { ok:true };
};

const resolver: Resolvers = {
  Mutation: {
    editBoard: protectResolver(editBoardFn),
  },
};

export default resolver;


const returnUploadFailNeedWhichAndError = (which:string,error:any) => {
  console.log(error);
  console.log(`editBoard // S3 ${which} upload error`);
  return { ok:false, error:"업로드에 실패하였습니다. 계속해서 같은 문제 발생 시 문의 주시면 감사드리겠습니다." };
};