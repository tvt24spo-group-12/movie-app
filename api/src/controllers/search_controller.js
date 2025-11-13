import { getByName } from "../models/movie_model.js";
import { searchTMDBByName } from "../models/tmdb_model.js";

export async function searchMoviesByName(req, res, next) {
  try {
    const dbRes = await getByName(req.params.name);
    const tmdbRes = await searchTMDBByName(req.params.name);
    const movies = [
      ...(dbRes || []),
      ...(tmdbRes || []).map((movie) => ({
        movie_id: movie.id,
        title: movie.title,
        release_date: movie.release_date,
        overview: movie.overview,
        genres: movie.genres,
        rating: movie.rating,
        votes: movie.rating,
        runtime: movie.runtime,
        poster_path: movie.poster_path
          ? `https://image.tmdb.org/t/p/w500${movie.poster_path}`
          : null,
      })),
    ];
    if (!movies || movies.length === 0) {
      return res.status(404).json({ error: "Movie not found" });
    }
    res.json(movies);
  } catch (err) {
    next(err);
  }
}
