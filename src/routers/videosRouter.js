import Express, { application } from "express";
import {
  watch,
  getEdit,
  postEdit,
  getUpload,
  postUpload,
  deleteVideo,
} from "../controllers/videoController";

const videosRouter = Express.Router();

// /videos
videosRouter.get("/:id([0-9a-f]{24})", watch);
videosRouter.route("/:id([0-9a-f]{24})/edit").get(getEdit).post(postEdit);
videosRouter.get("/:id([0-9a-f]{24})/delete", deleteVideo);
videosRouter.route("/upload").get(getUpload).post(postUpload);

export default videosRouter;
