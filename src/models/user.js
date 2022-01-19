import Mongoose from "mongoose";
import bcrypt from "bcrypt";

const userSchema = new Mongoose.Schema({
  name: String,
  socialOnly: { type: Boolean, default: false },
  avatarUrl: String,
  email: { type: String, required: true, unique: true },
  username: { type: String, required: true, unique: true },
  password: String,
  location: String,
  videos: [
    {
      type: Mongoose.Schema.Types.ObjectId,
      ref: "video",
    },
  ],
});

userSchema.pre("save", async function () {
  if (this.isModified("password")) {
    this.password = await bcrypt.hash(this.password, 5);
  }
});

const userModel = Mongoose.model("userModel", userSchema);

export default userModel;
