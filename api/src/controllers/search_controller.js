import { getByName, discoverMovies } from "../models/movie_model.js";
import { searchTMDBByName, searchTMDBByFilters } from "../models/tmdb_model.js";

export async function searchMoviesByName(req, res, next) {
  try {
    const name = (req.params.name || "").trim();

    const {
      genre,
      year,
      release_from,
      release_to,
      min_rating,
      max_rating,
      runtime_min,
      runtime_max,
      sort = "rating",
      order = "desc",
      page,
    } = req.query;

    const filters = {
      genre,
      year,
      release_from,
      release_to,
      min_rating,
      max_rating,
      runtime_min,
      runtime_max,
      sort,
      order,
      page,
    };

    if (!name) {
      const nonEmptyFilters = Object.entries(filters)
        .filter(([k]) => !["sort", "order", "page"].includes(k))
        .some(([, v]) => v != null && String(v).trim() !== "");

      if (!nonEmptyFilters) {
        return res.status(400).json({
          error: "At least one filter must be provided when no name is given",
        });
      }
    }

    // helper to extract genre names in lowercase
    const extractGenreNames = (movie) =>
      (movie.genres || [])
        .map((g) => {
          // DB genres are objects with a name
          if (typeof g === "object" && g.name) return g.name.toLowerCase();
          // TMDb genres are already strings
          if (typeof g === "string") return g.toLowerCase();
          return null;
        })
        .filter(Boolean);

    const applyFilters = (movies) =>
      movies.filter((movie) => {
        const movieGenres = extractGenreNames(movie);

        if (genre) {
          const filtersArr = genre
            .split(",")
            .map((g) => g.trim().toLowerCase())
            .filter(Boolean);

          if (!filtersArr.some((f) => movieGenres.includes(f))) return false;
        }

        if (year && movie.release_date) {
          if (new Date(movie.release_date).getFullYear() !== Number(year))
            return false;
        }

        if (release_from && movie.release_date) {
          if (new Date(movie.release_date) < new Date(release_from))
            return false;
        }
        if (release_to && movie.release_date) {
          if (new Date(movie.release_date) > new Date(release_to)) return false;
        }

        if (min_rating != null && String(min_rating) !== "") {
          if (
            movie.vote_average == null ||
            movie.vote_average < Number(min_rating)
          )
            return false;
        }
        if (max_rating != null && String(max_rating) !== "") {
          if (
            movie.vote_average == null ||
            movie.vote_average > Number(max_rating)
          )
            return false;
        }

        if (runtime_min != null && String(runtime_min) !== "") {
          if (movie.runtime == null || movie.runtime < Number(runtime_min))
            return false;
        }
        if (runtime_max != null && String(runtime_max) !== "") {
          if (movie.runtime == null || movie.runtime > Number(runtime_max))
            return false;
        }

        return true;
      });

    let dbMovies = [];
    let tmdbMovies = [];

    if (name) {
      dbMovies = (await getByName(name)) || [];
      tmdbMovies = await searchTMDBByName(name);
    } else {
      // Filter-only search
      dbMovies = await discoverMovies(filters);
      tmdbMovies = await searchTMDBByFilters(filters);
    }

    tmdbMovies = tmdbMovies.map((movie) => ({
      ...movie,
      genres: (movie.raw.genres || []).map((g) => g?.name).filter(Boolean),
    }));

    console.log(dbMovies);
    console.log(tmdbMovies);

    // Merge DB + TMDb results
    const merged = [...dbMovies, ...tmdbMovies];

    // Apply any remaining filters
    const filtered = applyFilters(merged);

    // Sorting
    const sortMap = {
      release_date: "release_date",
      rating: "vote_average",
      title: "title",
    };
    const sortField = sortMap[sort] || sortMap.rating;
    const dir = order === "asc" ? 1 : -1;

    const sorted = filtered.slice().sort((a, b) => {
      const va = a[sortField];
      const vb = b[sortField];
      if (sortField === "release_date")
        return (new Date(va) - new Date(vb)) * dir;
      if (sortField === "vote_average") return ((va || 0) - (vb || 0)) * dir;
      return String(va ?? "").localeCompare(String(vb ?? "")) * dir;
    });

    if (!sorted.length)
      return res.status(404).json({ error: "Movie not found" });
    res.json(sorted);
  } catch (err) {
    next(err);
  }
}
