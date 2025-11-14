import { getByName } from "../models/movie_model.js";
import { searchTMDBByName, getMovieDetailsByID } from "../models/tmdb_model.js";

export async function searchMoviesByName(req, res, next) {
  try {
    const dbRes = await getByName(req.params.name);

    const tmdbRes = await searchTMDBByName(req.params.name);
    const tmdbDetails = await Promise.all(
      tmdbRes.map(async (movie) => {
        const details = await getMovieDetailsByID(movie.id);
        return {
          movie_id: details.id,
          title: details.title,
          release_date: details.release_date,
          overview: details.overview,
          genres: (details.genres || []).map((g) => g.name.toLowerCase()),
          rating: details.vote_average,
          votes: details.vote_count,
          runtime: details.runtime,
          poster_path: details.poster_path
            ? `https://image.tmdb.org/t/p/w500${details.poster_path}`
            : null,
        };
      }),
    );

    const movies = [...(dbRes || []), ...tmdbDetails];

    if (!movies || movies.length === 0) {
      return res.status(404).json({ error: "Movie not found" });
    }

    // Get filters from query params
    const {
      genre, // comma-separated genre names
      year, // YYYY
      release_from, // date YYYY-MM-DD
      release_to, // date YYYY-MM-DD
      min_rating, // 0-10
      max_rating, // 0-10
      runtime_min, // runtime in minutes
      runtime_max, // runtime in minutes
      sort = "rating", // release_date/rating/title
      order = "desc", // desc/asc
    } = req.query;

    let filtered = movies.filter((movie) => {
      // Genre filter
      if (genre) {
        const genreFilters = genre
          .split(",")
          .map((g) => g.trim().toLowerCase());
        if (!movie.genres?.some((g) => genreFilters.includes(g))) return false;
      }

      // Year filter
      if (year && movie.release_date) {
        const y = new Date(movie.release_date).getFullYear();
        if (y !== Number(year)) return false;
      }

      // Release date range filter
      if (release_from && new Date(movie.release_date) < new Date(release_from))
        return false;
      if (release_to && new Date(movie.release_date) > new Date(release_to))
        return false;

      // Rating filter
      if (min_rating && movie.rating < Number(min_rating)) return false;
      if (max_rating && movie.rating > Number(max_rating)) return false;

      // Runtime filter
      if (runtime_min && movie.runtime < Number(runtime_min)) return false;
      if (runtime_max && movie.runtime > Number(runtime_max)) return false;

      return true;
    });

    // Sort
    if (sort) {
      const dir = order === "asc" ? 1 : -1;
      filtered.sort((a, b) => {
        if (sort === "release_date") {
          return (
            (new Date(a.release_date || 0) - new Date(b.release_date || 0)) *
            dir
          );
        } else if (sort === "rating") {
          return ((a.rating || 0) - (b.rating || 0)) * dir;
        } else if (sort === "title") {
          return a.title.localeCompare(b.title) * dir;
        }
        return 0;
      });
    }

    res.json(filtered);
  } catch (err) {
    next(err);
  }
}
