import Express from "express";
import {
  getJoin,
  postJoin,
  getLogin,
  postLogin,
} from "../controllers/userController";
import { home, searchVideo } from "../controllers/videoController";

const rootRouter = Express.Router();

rootRouter.get("/", home);
rootRouter.route("/login").get(getLogin).post(postLogin);
rootRouter.get("/search", searchVideo);
rootRouter.route("/join").get(getJoin).post(postJoin);
export default rootRouter;
