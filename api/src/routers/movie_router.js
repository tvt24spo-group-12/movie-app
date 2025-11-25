import { Router } from "express";
import {
  getMovies,
  getTMDBDetailsById,
} from "../controllers/movie_controller.js";
import { searchMoviesByName } from "../controllers/search_controller.js";
import { getNowPlaying } from "../controllers/nowPlaying_controller.js";
import {
  addOrUpdateRating,
  getUserRatingForMovie,
  getMovieRatings,
  removeRating,
} from "../controllers/rating_controller.js";
import { authenticateToken } from "../middleware/auth.js";

const movieRouter = Router();

movieRouter.get("/", getMovies);
movieRouter.get("/details/:id", getTMDBDetailsById);
movieRouter.get("/search/:name?", searchMoviesByName);
movieRouter.get("/nowplaying", getNowPlaying);

movieRouter.post("/:movieId/rating", authenticateToken, addOrUpdateRating);
movieRouter.get("/:movieId/rating", authenticateToken, getUserRatingForMovie);
movieRouter.get("/:movieId/ratings", getMovieRatings);
movieRouter.delete("/:movieId/rating", authenticateToken, removeRating);

export default movieRouter;
