import Mongoose from "mongoose";

Mongoose.connect("mongodb://127.0.0.1:27017/wetube");

const db = Mongoose.connection;

const handleError = (error) => {
  console.log("❌ DB Error", error);
};
const handleOpen = () => {
  console.log("✅ Connected to DB");
};

db.on("error", handleError);
db.once("open", handleOpen);
