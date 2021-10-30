import Express from "express";
const PORT = 3333;
const app = Express();

const handleHome = (request, response) => {
  return response.send("i love u");
};
const handleLogin = (request, response) => {
  response.send("login here");
};
app.get("/", handleHome);
app.get("/login", handleLogin);

const handleListening = () =>
  console.log(`Server listening on port http://localhost:${PORT}`);
app.listen(PORT, handleListening);
