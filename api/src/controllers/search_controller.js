import { getAll, getByName } from "../models/movie_model.js";

export async function searchMoviesByName(req, res, next) {
  try {
    const movies = await getByName(req.params.name);
    if (!movies || movies.length === 0) {
      return res.status(404).json({ error: "Movie not found" });
    }
    res.json(movies);
  } catch (err) {
    next(err);
  }
}
