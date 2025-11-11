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

  return await response.json();
}
