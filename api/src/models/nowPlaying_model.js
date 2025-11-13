import { formatMovie } from "../utils/formatMovie.js";

export async function fetchNowPlaying() {
  const apiKey = process.env.TMDB_ACCESS_TOKEN;

  const listUrl = `https://api.themoviedb.org/3/movie/now_playing?api_key=${apiKey}&language=en-US`;

  const listRes = await fetch(listUrl);
  if (!listRes.ok) throw new Error("Failed to fetch now_playing list");

  const listData = await listRes.json();
  const results = listData.results || [];

  const detailedMovies = await Promise.all(
    results.map(async (movie) => {
      const detailUrl = `https://api.themoviedb.org/3/movie/${movie.id}?api_key=${apiKey}&language=en-US`;

      const detailRes = await fetch(detailUrl);
      if (!detailRes.ok) return null;

      const detailData = await detailRes.json();
      return formatMovie(detailData);
    })
  );

  return detailedMovies.filter(Boolean);
}