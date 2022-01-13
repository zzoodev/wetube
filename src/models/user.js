import Mongoose from "mongoose";
import bcrypt from "bcrypt";

const userSchema = new Mongoose.Schema({
  name: String,
  socialOnly: { type: Boolean, default: false },
  avartaUrl: String,
  email: { type: String, required: true, unique: true },
  username: { type: String, required: true, unique: true },
  password: String,
  location: String,
});

userSchema.pre("save", async function () {
  this.password = await bcrypt.hash(this.password, 5);
});

const userModel = Mongoose.model("userModel", userSchema);

export default userModel;
