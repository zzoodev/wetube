import Mongoose from "mongoose";
import bcrypt from "bcrypt";

const userSchema = new Mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  location: String,
});

userSchema.pre("save", async function () {
  this.password = await bcrypt.hash(this.password, 5);
});

const userModel = Mongoose.model("userModel", userSchema);

export default userModel;
