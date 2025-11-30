const API_BASE_URL = process.env.REACT_APP_API_URL || "http://localhost:3001";

const TMDB_IMAGE_BASE = "https://image.tmdb.org/t/p/w500";

// muunna raw API data (our DB + TMDb) yhteen muotoon, jonka UI ymmärtää.
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
    backdrop: movie.backdrop_path ? movie.backdrop_path : "",
    genres: Array.isArray(movie.genres) ? movie.genres : [],
    rating: movie.vote_average ?? null,
    votes: movie.vote_count ?? null,
    releaseYear: movie.release_date
      ? new Date(movie.release_date).getFullYear()
      : (movie.year ?? null),
    runtime: movie.runtime ?? null,
  };
}

// kutsu backendin detail endpointin täyttääkseen kentät, jotka TMDb haku jättää poissa (runtime, genres, etc.)
export async function fetchMovieDetails(id) {
  const res = await fetch(`${API_BASE_URL}/movie/details/${id}`);
  if (!res.ok) throw new Error(`Failed to load movie ${id} details`);
  return normalizeMovie(await res.json());
}

// hae elokuvat backendin kautta, ja täydennä osittainiset tulokset tietojen haulla.
export async function searchMovies(query, filters = {}) {
  const trimmed = query.trim();

  // Rakenna query string filttereille
  const params = new URLSearchParams();
  Object.entries(filters).forEach(([key, value]) => {
    if (value !== "" && value != null) {
      params.append(key, value);
    }
  });

  const queryString = params.toString();
  const searchPath = trimmed
    ? `${API_BASE_URL}/movie/search/${encodeURIComponent(trimmed)}${queryString ? `?${queryString}` : ""}`
    : `${API_BASE_URL}/movie/search/${queryString ? `?${queryString}` : ""}`;

  const res = await fetch(searchPath);

  if (res.status === 404) return [];
  if (!res.ok) {
    const message = await res.text();
    throw new Error(`Search failed: ${res.status} ${message}`);
  }

  const basicMovies = (await res.json()).map(normalizeMovie);

  // hae tietoja vain tarvittaessa.
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
        // jos tietoja ei löydy, palauta osittainen tulos.
        return movie;
      }
    }),
  );

  return enriched;
}
