import { Router } from "express";
import { signUp } from "../controllers/register_controller.js";

const userRouter = Router();

userRouter.post("/signup", signUp);

export default userRouter;
