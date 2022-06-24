import { Router } from "express";
import { loginRequired } from "../middlewares/loginRequired";
import { likeController } from "../controllers/likeController";

const likeRouter = Router();

// 좋아요 정보를 담을 json 생성 (회원가입 시 자동 생성)
likeRouter.post("/likes", loginRequired, likeController.createLikeInfo);

// 해당 유저가 좋아요한 게시글 id 조회
likeRouter.get(
  "/likes/boards",
  loginRequired,
  likeController.getLikedBoardIdArray
);

// 해당 유저의 좋아요한 Map 정보 조회 (현재는 게시글 좋아요 기능만 있음)
// likeRouter.get("/likes/:category", loginRequired, likeController.getLikeInfo);

// 게시글 좋아요 상태 수정 (추가 혹은 취소)
likeRouter.put(
  "/likes/boards",
  loginRequired,
  likeController.editLikedBoardIdArray
);

// Map 좋아요 상태 수정 (추가 혹은 취소)
// likeRouter.put("/likes/:category", loginRequired, likeController.editLikeInfo);

export { likeRouter };
