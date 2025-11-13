// nowplaying.js
const API_BASE_URL = process.env.REACT_APP_API_URL || "http://localhost:3001";
const TMDB_IMAGE_BASE = "https://image.tmdb.org/t/p/w500";

function normalizeMovie(movie) {
  return {
    id: movie.movie_id ?? movie.id,
    title: movie.name ?? movie.title ?? "Untitled",
    overview: movie.overview ?? "",
    poster: movie.moviePicture
      ? movie.moviePicture
      : movie.poster_path
        ? `${TMDB_IMAGE_BASE}${movie.poster_path}`
        : null,
    genres: Array.isArray(movie.genres) ? movie.genres : [],
    rating: movie.vote_average ?? null,
    votes: movie.vote_count ?? null,
    releaseYear: movie.release_date
      ? new Date(movie.release_date).getFullYear()
      : (movie.year ?? null),
    runtime: movie.runtime ?? null,
  };
}

async function fetchMovieDetails(id) {
  const res = await fetch(`${API_BASE_URL}/movie/details/${id}`);
  if (!res.ok) throw new Error(`Failed to load movie ${id} details`);
  return normalizeMovie(await res.json());
}

export async function getNowPlaying() {
  const res = await fetch(`${API_BASE_URL}/movie/nowplaying`);
  if (res.status === 404) return [];
  if (!res.ok) {
    const text = await res.text().catch(() => "");
    throw new Error(`Failed to load now playing: ${res.status} ${text}`);
  }

  const raw = await res.json();
  const basicMovies = (Array.isArray(raw) ? raw : []).map(normalizeMovie);

  const enriched = await Promise.all(
    basicMovies.map(async (movie) => {
      const missing =
        !movie.overview ||
        !movie.poster ||
        movie.rating == null ||
        !movie.genres.length;
      if (!missing) return movie;
      try {
        const details = await fetchMovieDetails(movie.id);
        return {
          ...movie,
          ...details,
          genres: details.genres.length ? details.genres : movie.genres,
        };
      } catch {
        return movie;
      }
    }),
  );

  return enriched;
}
