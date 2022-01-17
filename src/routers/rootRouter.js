import Express from "express";
import {
  getJoin,
  postJoin,
  getLogin,
  postLogin,
} from "../controllers/userController";
import { home, searchVideo } from "../controllers/videoController";
import { loggedInOnlyMiddleware, publicOnlyMiddleware } from "../middlewares";

const rootRouter = Express.Router();

rootRouter.get("/", home);
rootRouter
  .route("/login")
  .all(publicOnlyMiddleware)
  .get(getLogin)
  .post(postLogin);
rootRouter.get("/search", searchVideo);
rootRouter.route("/join").all(publicOnlyMiddleware).get(getJoin).post(postJoin);
export default rootRouter;
