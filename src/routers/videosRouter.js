import Express, { application } from "express";
import {
  watch,
  getEdit,
  postEdit,
  getUpload,
  postUpload,
  deleteVideo,
} from "../controllers/videoController";
import { loggedInOnlyMiddleware } from "../middlewares";

const videosRouter = Express.Router();

// /videos
videosRouter.get("/:id([0-9a-f]{24})", watch);
videosRouter
  .route("/:id([0-9a-f]{24})/edit")
  .all(loggedInOnlyMiddleware)
  .get(getEdit)
  .post(postEdit);
videosRouter.get(
  "/:id([0-9a-f]{24})/delete",
  loggedInOnlyMiddleware,
  deleteVideo
);
videosRouter
  .route("/upload")
  .all(loggedInOnlyMiddleware)
  .get(getUpload)
  .post(postUpload);

export default videosRouter;
