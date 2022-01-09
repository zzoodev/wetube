let videos = [
  {
    title: "first movie",
    rating: 3,
    createdAt: "3 minutes ago",
    views: 1,
    id: 1,
  },
  {
    title: "second movie",
    rating: 5,
    createdAt: "35 minutes ago",
    views: 314,
    id: 2,
  },
  {
    title: "third movie",
    rating: 4,
    createdAt: "58 minutes ago",
    views: 558,
    id: 3,
  },
];
export const home = (req, res) => {
  res.render("home", { pageTitle: "Home", videos });
};
export const watch = (req, res) => {
  const { id } = req.params;
  const video = videos[id - 1];
  return res.render("watch", {
    pageTitle: `Watching ${video.title}`,
    video,
  });
};
export const getEdit = (req, res) => {
  const { id } = req.params;
  const video = videos[id - 1];
  return res.render("edit", {
    pageTitle: `Editing ${video.title}`,
    video,
  });
};
export const postEdit = (req, res) => {
  const { id } = req.params;
  const { title } = req.body;
  videos[id - 1].title = title;
  return res.redirect(`/videos/${id}`);
};
export const getUpload = (req, res) => {
  return res.render("upload", { pageTitle: "Uploading Video" });
};
export const postUpload = (req, res) => {
  // here i will add a video to videos array
  const { title } = req.body;
  const newVideo = {
    title: title,
    rating: 0,
    createdAt: "just now",
    views: 0,
    id: videos.length + 1,
  };
  videos.push(newVideo);
  res.redirect("/");
};
