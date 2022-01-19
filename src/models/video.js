import Mongoose from "mongoose";

const videoSchema = Mongoose.Schema({
  title: { type: String, required: true, trim: true, maxlength: 20 },
  description: { type: String, required: true, trim: true, maxlength: 50 },
  createdAt: { type: Date, default: Date.now },
  hashtags: [{ type: String, required: true, trim: true }],
  meta: {
    views: { type: Number, default: 0 },
    rating: { type: Number, default: 0 },
  },
  videoUrl: { type: String, require: true },
  owner: {
    type: Mongoose.Schema.Types.ObjectId,
    required: true,
    ref: "userModel",
  },
});

videoSchema.static("formatHashtags", function (hashtags) {
  return hashtags
    .split(",")
    .map((word) => (word.startsWith("#") ? word : `#${word}`));
});

const videoModel = Mongoose.model("video", videoSchema);

export default videoModel;
