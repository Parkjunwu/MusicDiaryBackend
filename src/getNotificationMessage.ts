
const messageList = {
  MUSIC_SELECTED: "회원님의 일기에 노래가 지정되었습니다.",
  MUSIC_CHANGED: "회원님이 요청하신 일기의 노래가 변경되었습니다.",
  MY_BOARD_COMMENT_GET_COMMENT: "회원님의 댓글에 댓글을 남겼습니다.",
  MY_BOARD_COMMENT_GET_LIKE: "회원님의 댓글을 좋아합니다.",
  MY_BOARD_COMMENT_OF_COMMENT_GET_LIKE: "회원님의 댓글을 좋아합니다.",
  MY_BOARD_GET_COMMENT: "회원님의 게시글에 댓글을 남겼습니다.",
  MY_BOARD_GET_LIKE: "회원님의 게시글를 좋아합니다.",
  // MY_COMMENT_GET_LIKE: "회원님의 댓글을 좋아합니다.",
  // MY_COMMENT_OF_COMMENT_GET_LIKE: "회원님의 댓글을 좋아합니다.",
  // MY_POST_GET_COMMENT: "회원님의 게시물에 댓글을 남겼습니다.",
  // MY_POST_GET_LIKE: "회원님의 게시물을 좋아합니다.",
  // FOLLOWING_WRITE_BOARD: "새로운 게시글을 작성하였습니다.",
};

const getNotificationMessage = (which:string) => messageList[which] ?? console.error("getNotificationMessage // invalid which");

export default getNotificationMessage;