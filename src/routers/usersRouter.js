import Express from "express";
import { edit, deleteProfile, myProfile } from "../controllers/userController";

const usersRouter = Express.Router();

usersRouter.get("/delete", deleteProfile);
usersRouter.get("/edit", edit);
usersRouter.get("/:id(\\d+)", myProfile);

export default usersRouter;
