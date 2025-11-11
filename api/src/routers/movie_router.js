import { Router } from "express";
import {
  getMovies,
  getMovie,
  addMovie,
  updateMovie,
  deleteMovie,
} from "../controllers/movie_controller.js";

const bookRouter = Router();

bookRouter.get("/", getMovies);
bookRouter.get("/:id", getMovie);
bookRouter.post("/", addMovie);
bookRouter.put("/:id", updateMovie);
bookRouter.delete("/:id", deleteMovie);

export default movieRouter;
