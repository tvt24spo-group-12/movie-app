import { Router } from "express";
import { getMovies } from "../controllers/movie_controller.js";
import { searchMoviesByName } from "../controllers/search_controller.js";

const movieRouter = Router();

movieRouter.get("/", getMovies);
movieRouter.get("/search/:name", searchMoviesByName);

export default movieRouter;
