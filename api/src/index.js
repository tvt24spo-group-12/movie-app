import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import "dotenv/config";

import movieRouter from "./routers/movie_router.js";
import userRouter from "./routers/user_router.js";
import groupRouter from "./routers/group_router.js";

const app = express();
const port = process.env.PORT;

app.use(cors({
  origin: process.env.FRONTEND_URL || "http://localhost:3000",
  credentials: true // Allow cookies
}));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser())


app.use("/movie", movieRouter);
app.use("/user", userRouter);
app.use("/group", groupRouter)

app.listen(port, () => {
  console.log(`Server is listening port ${port}`);
});
