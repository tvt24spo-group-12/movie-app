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
    const data = await getMovieDetailsByID(req.params.id);

    const movie = {
      movie_id: data.id,
      name: data.title,
      original_title: data.original_title,
      overview: data.overview,
      release_date: data.release_date,
      runtime: data.runtime,
      genres: (data.genres || []).map((g) => g.name),
      vote_average: data.vote_average,
      vote_count: data.vote_count,
      moviePicture: data.poster_path
        ? `https://image.tmdb.org/t/p/w500${data.poster_path}`
        : null,
      backdrop_path: data.backdrop_path
        ? `https://image.tmdb.org/t/p/original${data.backdrop_path}`
        : null,
      raw: data,
    };

    res.json(movie);
  } catch (err) {
    next(err);
  }
}
