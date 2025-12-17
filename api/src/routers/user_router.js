import { Router } from "express";
import { deleteUserAccount } from "../controllers/delete_controller.js";
import {
  signUp,
  login,
  refreshAccessToken,
  logout,
  getUserInfoById,
  changePassword
} from "../controllers/user_controller.js";
import { authenticateToken } from "../middleware/auth.js";
import {
  getCurrentUserRatings,
  getUserRatings,
} from "../controllers/rating_controller.js";
import {
  getProfilePictureById,
  uploadProfilePicture,
} from "../controllers/profilePicture_controller.js";
//import { signUp, login } from "../controllers/user_controller.js";
import {
  addFavorite,
  getAllFavorite,
  removeFavorite,
  getFavoriteById,
  getFavoritesByUserIdPublic,
} from "../controllers/favoriteMovies_controller.js";
const userRouter = Router();

userRouter.post("/signup", signUp);
userRouter.post("/signin", login);
userRouter.delete("/delete/:user_id", authenticateToken, deleteUserAccount);
userRouter.post("/refresh", refreshAccessToken);
userRouter.post("/logout", logout);
userRouter.post("/changePassword", authenticateToken, changePassword);

userRouter.delete("/delete/:user_id", deleteUserAccount);

userRouter.post("/favoriteMovies/:movieId", authenticateToken, addFavorite);
userRouter.delete(
  "/favoriteMovies/:movieId",
  authenticateToken,
  removeFavorite,
);
userRouter.get("/favoriteMovies", authenticateToken, getAllFavorite);
userRouter.get("/favoriteMovies/:movieId", authenticateToken, getFavoriteById);

// Public sharing endpoint - placed before param routes to avoid conflicts
userRouter.get("/:userId/favoriteMovies", getFavoritesByUserIdPublic);

userRouter.get(
  "/profilePicture/:userId",
  authenticateToken,
  getProfilePictureById,
);
userRouter.post(
  "/profilePicture/:userId",
  authenticateToken,
  uploadProfilePicture,
);

userRouter.get("/ratings", authenticateToken, getCurrentUserRatings);
userRouter.get("/:userId/ratings", getUserRatings);
userRouter.get("/:userId", getUserInfoById);

export default userRouter;

