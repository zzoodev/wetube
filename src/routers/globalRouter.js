import Express from "express";
import { join, login, logout } from "../controllers/userController";
import { home, searchVideo } from "../controllers/videoController";

const globalRouter = Express.Router();

globalRouter.get("/", home);
globalRouter.get("/join", join);
globalRouter.get("/login", login);
globalRouter.get("/logout", logout);
globalRouter.get("/search", searchVideo);
export default globalRouter;
