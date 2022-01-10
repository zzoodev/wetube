import videoModel from "../models/video";

export const home = async (req, res) => {
  try {
    const videos = await videoModel.find({});
    return res.render("home", { pageTitle: "Home", videos });
  } catch {
    return res.send("Server Error");
  }
};
export const watch = async (req, res) => {
  const { id } = req.params;
  const video = await videoModel.findById(id);
  return res.render("watch", {
    pageTitle: video.title,
    video,
  });
};
export const getEdit = async (req, res) => {
  const { id } = req.params;
  const video = await videoModel.findById(id);
  return res.render("edit", {
    pageTitle: `Editing ${video.title}`,
    video,
  });
};
export const postEdit = (req, res) => {
  const { id } = req.params;
  const { title } = req.body;
  return res.redirect(`/videos`);
};
export const getUpload = (req, res) => {
  return res.render("upload", { pageTitle: "Uploading Video" });
};
export const postUpload = async (req, res) => {
  const { title, description, hashtags } = req.body;
  try {
    const video = new videoModel({
      title,
      description,
      hashtags: hashtags.split(",").map((word) => `#${word}`),
    });
    await video.save();
    res.redirect("/");
  } catch (error) {
    console.log(error._message);
    return res.render("upload", {
      pageTitle: "Uploading Video",
      errorMessage: error._message,
    });
  }
};
