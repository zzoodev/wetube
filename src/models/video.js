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
});

const videoModel = Mongoose.model("video", videoSchema);

export default videoModel;
