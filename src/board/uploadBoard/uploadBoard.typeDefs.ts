import { gql } from "apollo-server-express";

export default gql`
  # 결과를 완료 + Board 로 해야 할듯
  type UploadBoardResponse {
    ok: Boolean!,
    error: String,
    uploadedBoard: Board
  }
  type Mutation {
    uploadBoard(
      title: String!,
      fileArr: [Upload!]!,
      body: [String!]!,
      # thumbNail: Upload,
      thumbNailArr:[Upload!], # 뒤에 ! 없음 # 비디오 빼서 지금 안씀.
      isFirstVideo:Boolean!, # 추가함
      # isFirstVideo: Boolean!,
      # firstVideoPhoto: Upload,
    ):  UploadBoardResponse!
  }
`;