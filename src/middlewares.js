import multer from "multer";
import multerS3 from "multer-s3";
import aws from "aws-sdk";

const s3 = new aws.S3({
  credentials: {
    accessKeyId: process.env.AWS_ID,
    secretAccessKey: process.env.AWS_SECRET,
  },
});

const isHeroku = process.env.NODE_ENV === "production";

const s3ImgUploader = multerS3({
  s3: s3,
  bucket: "wetubexe/images",
  acl: "public-read",
});
const s3VideoUploader = multerS3({
  s3: s3,
  bucket: "wetubexe/videos",
  acl: "public-read",
});

export const localsMiddleware = (req, res, next) => {
  res.locals.siteName = "Wetube";
  res.locals.loggedIn = Boolean(req.session.loggedIn);
  res.locals.loggedInUser = req.session.user || {};
  res.locals.isHeroku = isHeroku;
  next();
};

export const loggedInOnlyMiddleware = (req, res, next) => {
  if (res.locals.loggedIn) {
    return next();
  } else {
    req.flash("error", "Not authorized");
    return res.redirect("/login");
  }
};

export const publicOnlyMiddleware = (req, res, next) => {
  if (!res.locals.loggedIn) {
    return next();
  } else {
    req.flash("error", "Not authorized");
    return res.redirect("/");
  }
};

export const avatarUrlUpload = multer({
  dest: "uploads/avatars/",
  limits: 10000000,
  storage: isHeroku ? s3ImgUploader : undefined,
});
export const videoUrlUpload = multer({
  dest: "uploads/videos/",
  limits: 90000000,
  storage: isHeroku ? s3VideoUploader : undefined,
});
