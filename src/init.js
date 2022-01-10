import "./db";
import "./models/video";
import app from "./server";

const PORT = 4000;
const openServer = () => {
  console.log(`✅ Server listening on port http://localhost:${PORT} 🚀`);
};

app.listen(PORT, openServer);
