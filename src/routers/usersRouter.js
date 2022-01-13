import Express from "express";
import {
  edit,
  deleteProfile,
  myProfile,
  githubLogin,
  githubLoginFinish,
  logout,
} from "../controllers/userController";

const usersRouter = Express.Router();

usersRouter.get("/delete", deleteProfile);
usersRouter.get("/github/start", githubLogin);
usersRouter.get("/github/finish", githubLoginFinish);
usersRouter.get("/logout", logout);
usersRouter.get("/edit", edit);
usersRouter.get("/:id(\\d+)", myProfile);
export default usersRouter;
