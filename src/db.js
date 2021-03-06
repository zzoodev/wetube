import Mongoose from "mongoose";

Mongoose.connect(process.env.DB_URL, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const db = Mongoose.connection;

const handleError = (error) => {
  console.log("❌ DB Error", error);
};
const handleOpen = () => {
  console.log("✅ Connected to DB");
};

db.on("error", handleError);
db.once("open", handleOpen);
