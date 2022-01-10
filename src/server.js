import Express from "express";
import morgan from "morgan";
import globalRouter from "./routers/globalRouter";
import videosRouter from "./routers/videosRouter";
import usersRouter from "./routers/usersRouter";
import express from "express";

const app = Express();
const logger = morgan("dev");

app.use(logger);
app.set("view engine", "pug");
app.set("views", process.cwd() + "/src/views");
app.use(express.urlencoded({ extended: true }));
app.use("/", globalRouter);
app.use("/videos", videosRouter);
app.use("/users", usersRouter);

export default app;
