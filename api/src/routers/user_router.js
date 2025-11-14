import { Router } from "express";
import { signUp, login } from "../controllers/user_controller.js";

const userRouter = Router();

userRouter.post("/signup", signUp);
userRouter.post("/signin", login);

export default userRouter;
