import { GraphQLUpload } from "graphql-upload";
// import GraphQLUpload from "graphql-upload/GraphQLUpload.js";

const resolver = {
  //Upload 타입 정의
  Upload: GraphQLUpload,
};

export default resolver;