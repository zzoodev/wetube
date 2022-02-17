import Mongoose from "mongoose";

const commentSchema = new Mongoose.Schema({
  text: { type: String, required: true },
  video: {
    type: Mongoose.Schema.Types.ObjectId,
    required: true,
    ref: "videoModel",
  },
  owner: {
    type: Mongoose.Schema.Types.ObjectId,
    required: true,
    ref: "userModel",
  },
  createdAt: { type: Date, required: true, default: Date.now },
});

const commentModel = Mongoose.model("comment", commentSchema);
export default commentModel;
