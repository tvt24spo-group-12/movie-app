import { Router } from "express";
import { signUp } from "../controllers/register_controller.js";
import { deleteUserAccount } from "../controllers/delete_controller.js";

const userRouter = Router();

userRouter.post("/signup", signUp);
userRouter.delete("/delete/:user_id", deleteUserAccount);

export default userRouter;