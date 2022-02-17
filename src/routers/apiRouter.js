import express from "express";
import {
  registerView,
  createComment,
  xComment,
} from "../controllers/videoController";

const apiRouter = express.Router();

apiRouter.post("/videos/:id([0-9a-f]{24})/view", registerView);
apiRouter.post("/videos/:id([0-9a-f]{24})/comment", createComment);
apiRouter.delete("/:id([0-9a-f]{24})/remove", xComment);
export default apiRouter;
