import { Router } from "express";
import { deleteUserAccount } from "../controllers/delete_controller.js";
import { signUp, login, refreshAccessToken, logout } from "../controllers/user_controller.js";
import { authenticateToken } from "../middleware/auth.js";
import { getCurrentUserRatings, getUserRatings } from "../controllers/rating_controller.js";

//import { signUp, login } from "../controllers/user_controller.js";
import { addFavorite } from "../controllers/favoriteMovies_controller.js";
const userRouter = Router();

userRouter.post("/signup", signUp);
userRouter.post("/signin", login);
userRouter.delete("/delete/:user_id",authenticateToken, deleteUserAccount);
userRouter.post("/refresh", refreshAccessToken);
userRouter.post("/logout", logout);

userRouter.delete("/delete/:user_id", deleteUserAccount);
userRouter.post("/favoriteMovies", addFavorite)
userRouter.get("/ratings", authenticateToken, getCurrentUserRatings);
userRouter.get("/:userId/ratings", getUserRatings);

export default userRouter;