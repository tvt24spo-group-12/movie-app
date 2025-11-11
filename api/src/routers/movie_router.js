import { Router } from "express";
import { searchMoviesByName } from "../controllers/search_controller.js";

const movieRouter = Router();

movieRouter.get("/search/:name", searchMoviesByName);

export default movieRouter;
