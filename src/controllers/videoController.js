import videoModel from "../models/video";
import userModel from "../models/user";
import commentModel from "../models/comment";
import { async } from "regenerator-runtime";

export const home = async (req, res) => {
  try {
    const videos = await videoModel.find({}).populate("owner");
    return res.render("home", { pageTitle: "Home", videos });
  } catch {
    return res.send("Server Error");
  }
};

export const watch = async (req, res) => {
  const { id } = req.params;
  const video = await videoModel
    .findById(id)
    .populate("owner")
    .populate("comments");
  if (!video) {
    return res.status(404).render("404", { pageTitle: "Video not found" });
  }
  return res.render("watch", {
    pageTitle: video.title,
    video,
  });
};

export const getEdit = async (req, res) => {
  const { id } = req.params;
  const { _id } = req.session.user;
  const video = await videoModel.findById(id);
  if (String(video.owner) !== String(_id)) {
    req.flash("error", "Not authorized");
    return res.status(403).redirect("/");
  }
  if (!video) {
    return res.status(404).render("404", { pageTitle: "Video not found." });
  }
  return res.render("edit-video", {
    pageTitle: `Editing ${video.title}`,
    video,
  });
};

export const postEdit = async (req, res) => {
  const { id } = req.params;
  const { _id } = req.session.user;
  const { title, description, hashtags } = req.body;
  const video = await videoModel.exists({ _id: id });
  if (String(video.owner) !== String(_id)) {
    return res.status(403).redirect("/");
  }
  if (!video) {
    return res.status(404).render("404", { pageTitle: "Video not found" });
  }
  await videoModel.findByIdAndUpdate(id, {
    title,
    description,
    hashtags: videoModel.formatHashtags(hashtags),
  });
  return res.redirect(`/videos/${id}`);
};

export const getUpload = (req, res) => {
  return res.render("upload", { pageTitle: "Uploading Video" });
};

export const postUpload = async (req, res) => {
  const {
    user: { _id },
  } = req.session;
  const { title, description, hashtags } = req.body;
  const { video, thumb } = req.files;
  const isHeroku = process.env.NODE_ENV === "production";
  try {
    const newVideo = await videoModel.create({
      title,
      description,
      videoUrl: isHeroku ? video[0].location : video[0].path,
      thumbUrl: isHeroku ? thumb[0].location : thumb[0].path,
      owner: _id,
      hashtags: videoModel.formatHashtags(hashtags),
    });
    const user = await userModel.findById(_id);
    user.videos.push(newVideo._id);
    user.save();
    res.redirect("/");
  } catch (error) {
    console.log(error);
    return res.render("upload", {
      pageTitle: "Uploading Video",
      errorMessage: error._message,
    });
  }
};

export const deleteVideo = async (req, res) => {
  const { _id } = req.session.user;
  const { id } = req.params;
  const video = await videoModel.findById(id);
  if (String(video.owner) !== String(_id)) {
    req.flash("error", "Not authorized");
    return res.status(403).redirect("/");
  }
  if (!video) {
    return res.status(404).render("404", { pageTitle: "Video not found" });
  }
  await videoModel.findByIdAndDelete(id);
  return res.redirect("/");
};

export const searchVideo = async (req, res) => {
  const { keyword } = req.query;
  let videos = [];
  if (keyword) {
    videos = await videoModel
      .find({
        title: {
          $regex: new RegExp(keyword, "i"),
        },
      })
      .populate("owner");
    return res.render("search", { pageTitle: "Search", videos });
  }
  return res.render("search", { pageTitle: "search", videos });
};

export const registerView = async (req, res) => {
  const { id } = req.params;
  const video = await videoModel.findById(id);
  if (!video) {
    res.sendStatus(400);
  }
  video.meta.views = video.meta.views + 1;
  video.save();
  res.sendStatus(200);
};

export const createComment = async (req, res) => {
  const {
    params: { id },
    body: { text },
    session: { user },
  } = req;

  const video = await videoModel.findById(id);
  const loggedInUser = await userModel.findById(user._id);
  if (!video) {
    return res.sendStatus(404);
  }
  const comment = await commentModel.create({
    text,
    video: id,
    owner: user._id,
  });
  video.comments.push(comment._id);
  loggedInUser.comments.push(comment._id);
  video.save();
  loggedInUser.save();
  return res.status(201).json({ newCommentId: comment._id });
};

export const xComment = async (req, res) => {
  const {
    body: { commentId, videoId },
    session: { user },
  } = req;
  const video = await videoModel.findById(videoId);
  const comment = await commentModel.findById(commentId);
  const loggedInUser = await userModel.findById(user._id);
  if (!comment) {
    req.flash("error", "Not authorized");
    return res.sendStatus(404);
  }
  if (String(comment.owner._id) !== String(user._id)) {
    req.flash("error", "Not authorized");
    return res.sendStatus(404);
  }
  video.comments.splice(video.comments.indexOf(commentId), 1);
  loggedInUser.comments.splice(loggedInUser.comments.indexOf(commentId), 1);
  await video.save();
  await loggedInUser.save();
  await commentModel.findByIdAndDelete(commentId);
  return await res.status(200).json({ removedCommentId: commentId });
};
