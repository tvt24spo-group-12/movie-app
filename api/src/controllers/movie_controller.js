import { getAll } from "../models/movie_model.js";

export async function getMovies(req, res, next) {
  try {
    const movies = await getAll();
    res.json(movies);
  } catch (err) {
    next(err);
  }
}

