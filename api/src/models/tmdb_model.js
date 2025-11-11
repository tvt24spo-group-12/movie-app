const TMDB_ACCESS_TOKEN = process.env.TMDB_ACCESS_TOKEN;
const TMDB_BASE_URL = "https://api.themoviedb.org/3";

export async function searchTMDBByName(name) {
  const url = `${TMDB_BASE_URL}/search/movie?query=${encodeURIComponent(
    name,
  )}&include_adult=false&language=en-US&page=1`;

  const response = await fetch(url, {
    method: "GET",
    headers: {
      accept: "application/json",
      Authorization: `Bearer ${TMDB_ACCESS_TOKEN}`,
    },
  });

  if (!response.ok) {
    throw new Error(`TMDB request failed: ${response.status}`);
  }

  const data = await response.json();
  return data.results || [];
}

export async function getMovieDetailsByID(movie_id) {
  const url = `${TMDB_BASE_URL}/movie/${movie_id}?language=en-US`;

  const response = await fetch(url, {
    method: "GET",
    headers: {
      accept: "application/json",
      Authorization: `Bearer ${TMDB_ACCESS_TOKEN}`,
    },
  });

  if (!response.ok) {
    let text = "";
    try {
      text = await response.text();
    } catch (e) {}
    throw new Error(
      `TMDB request failed: ${response.status} ${response.statusText} — ${text}`,
    );
  }

  const data = await response.json();

  return {
    movie_id: data.id,
    title: data.title,
    original_title: data.original_title,
    overview: data.overview,
    release_date: data.release_date,
    runtime: data.runtime,
    genres: (data.genres || []).map((g) => g.name),
    vote_average: data.vote_average,
    vote_count: data.vote_count,
    poster_path: data.poster_path
      ? `https://image.tmdb.org/t/p/w500${data.poster_path}`
      : null,
    backdrop_path: data.backdrop_path
      ? `https://image.tmdb.org/t/p/original${data.backdrop_path}`
      : null,
    raw: data,
  };
}
