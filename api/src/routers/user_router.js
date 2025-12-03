import { Router } from "express";
import { deleteUserAccount } from "../controllers/delete_controller.js";
import { signUp, login, refreshAccessToken, logout } from "../controllers/user_controller.js";
import { authenticateToken } from "../middleware/auth.js";
import { getCurrentUserRatings, getUserRatings } from "../controllers/rating_controller.js";
import {getProfilePictureById} from '../controllers/profilePicture_controller.js'
//import { signUp, login } from "../controllers/user_controller.js";
import { addFavorite, getAllFavorite, removeFavorite, getFavoriteById } from "../controllers/favoriteMovies_controller.js";
const userRouter = Router();

userRouter.post("/signup", signUp);
userRouter.post("/signin", login);
userRouter.delete("/delete/:user_id",authenticateToken, deleteUserAccount);
userRouter.post("/refresh", refreshAccessToken);
userRouter.post("/logout", logout);

userRouter.delete("/delete/:user_id", deleteUserAccount);
userRouter.post("/favoriteMovies/:movieId", authenticateToken, addFavorite)
userRouter.delete("/favoriteMovies/:movieId", authenticateToken, removeFavorite)
userRouter.get("/favoriteMovies", authenticateToken,getAllFavorite)
userRouter.get("/favoriteMovies/:movieId", authenticateToken,getFavoriteById)

userRouter.get("/profilePicture/:userId",authenticateToken, getProfilePictureById)

userRouter.get("/ratings", authenticateToken, getCurrentUserRatings);
userRouter.get("/:userId/ratings", getUserRatings);

export default userRouter;