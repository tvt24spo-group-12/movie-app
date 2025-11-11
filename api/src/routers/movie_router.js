import { Router } from "express";
import {
  getMovies,
  getTMDBDetailsById,
} from "../controllers/movie_controller.js";
import { searchMoviesByName } from "../controllers/search_controller.js";

const movieRouter = Router();

movieRouter.get("/", getMovies);
movieRouter.get("/details/:id", getTMDBDetailsById);
movieRouter.get("/search/:name", searchMoviesByName);

export default movieRouter;
