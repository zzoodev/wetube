import Express from "express";
import {
  getEdit,
  postEdit,
  deleteProfile,
  myProfile,
  githubLogin,
  githubLoginFinish,
  logout,
  getChangePassword,
  postChangePassword,
} from "../controllers/userController";
import { loggedInOnlyMiddleware, publicOnlyMiddleware } from "../middlewares";

const usersRouter = Express.Router();

usersRouter.get("/github/start", publicOnlyMiddleware, githubLogin);
usersRouter.get("/github/finish", publicOnlyMiddleware, githubLoginFinish);
usersRouter.get("/logout", loggedInOnlyMiddleware, logout);
usersRouter
  .route("/edit")
  .all(loggedInOnlyMiddleware)
  .get(getEdit)
  .post(postEdit);
usersRouter
  .route("/changePassword")
  .all(loggedInOnlyMiddleware)
  .get(getChangePassword)
  .post(postChangePassword);
usersRouter.get("/:id(\\d+)", myProfile);
usersRouter.get("/delete", deleteProfile);
export default usersRouter;
