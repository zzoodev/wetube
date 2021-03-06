import "regenerator-runtime";
import "dotenv/config";
import "./db";
import "./models/video";
import "./models/user";
import "./models/comment";
import app from "./server";

const PORT = process.env.PORT || 4000;
const openServer = () => {
  console.log(`✅ Server listening on port http://localhost:${PORT} 🚀`);
};

app.listen(PORT, openServer);
