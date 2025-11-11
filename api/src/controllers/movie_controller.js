import { getAll } from "../models/movie_model.js";
import { getMovieDetailsByID } from "../models/tmdb_model.js";

export async function getMovies(req, res, next) {
  try {
    const movies = await getAll();
    res.json(movies);
  } catch (err) {
    next(err);
  }
}

export async function getTMDBDetailsById(req, res, next) {
  try {
    const movie = await getMovieDetailsByID(req.params.id);
    res.json(movie);
  } catch (err) {
    next(err);
  }
}
