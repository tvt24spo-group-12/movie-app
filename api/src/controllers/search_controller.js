import { getAll, getByName } from "../models/movie_model.js";

export async function searchMoviesByName(req, res, next) {
  try {
    const movie = await getByName(req.params.name);
    if (!movie) {
      return res.status(404).json({ error: "Movie not found" });
    }
    res.json(movie);
  } catch (err) {
    next(err);
  }
}

