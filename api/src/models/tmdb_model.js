import { formatMovie } from "../utils/formatMovie.js";
const TMDB_ACCESS_TOKEN = process.env.TMDB_ACCESS_TOKEN;
const TMDB_BASE_URL = "https://api.themoviedb.org/3";
let _cachedTmdbGenres = null;

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
  const results = data.results || [];
  const detailedMovies = await Promise.all(
    results.map(async (movie) => {
      const detailUrl = `${TMDB_BASE_URL}/movie/${movie.id}?language=en-US`;

      const detailRes = await fetch(detailUrl, {
        method: "GET",
        headers: {
          accept: "application/json",
          Authorization: `Bearer ${TMDB_ACCESS_TOKEN}`,
        },
      });

      if (!detailRes.ok) return null;

      const detailData = await detailRes.json();
      return formatMovie(detailData);
    }),
  );
  return detailedMovies.filter(Boolean);
}

async function getTmdbGenreMap() {
  if (_cachedTmdbGenres) return _cachedTmdbGenres;

  const url = `${TMDB_BASE_URL}/genre/movie/list?language=en-US`;
  const response = await fetch(url, {
    method: "GET",
    headers: {
      accept: "application/json",
      Authorization: `Bearer ${TMDB_ACCESS_TOKEN}`,
    },
  });
  if (!response.ok) {
    _cachedTmdbGenres = {};
    return _cachedTmdbGenres;
  }
  const data = await response.json();
  _cachedTmdbGenres = (data.genres || []).reduce((acc, g) => {
    acc[g.name.toLowerCase()] = g.id;
    return acc;
  }, {});
  return _cachedTmdbGenres;
}

export async function searchTMDBByFilters(filters = {}) {
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
    page = 1,
  } = filters;

  const params = new URLSearchParams({
    include_adult: "false",
    language: "en-US",
    page: String(page || 1),
  });

  if (genre) {
    const parts = genre
      .split(",")
      .map((p) => p.trim())
      .filter(Boolean);

    const numeric = parts.filter((p) => /^\d+$/.test(p));
    const names = parts.filter((p) => !/^\d+$/.test(p));

    const ids = [...numeric];

    if (names.length) {
      const map = await getTmdbGenreMap();
      for (const n of names) {
        const id = map[n.toLowerCase()];
        if (id) ids.push(String(id));
      }
    }

    if (ids.length) params.set("with_genres", ids.join(","));
  }

  if (year) params.set("primary_release_year", String(year));
  if (release_from) params.set("primary_release_date.gte", release_from);
  if (release_to) params.set("primary_release_date.lte", release_to);

  if (min_rating != null) params.set("vote_average.gte", String(min_rating));
  if (max_rating != null) params.set("vote_average.lte", String(max_rating));

  if (runtime_min != null) params.set("with_runtime.gte", String(runtime_min));
  if (runtime_max != null) params.set("with_runtime.lte", String(runtime_max));

  const sortMap = {
    release_date: "primary_release_date",
    rating: "vote_average",
    title: "title",
    popularity: "popularity",
  };
  const sortField = sortMap[sort] || sortMap.rating;
  const sortDir = order === "asc" ? "asc" : "desc";
  params.set("sort_by", `${sortField}.${sortDir}`);

  const url = `${TMDB_BASE_URL}/discover/movie?${params.toString()}`;
  const res = await fetch(url, {
    method: "GET",
    headers: {
      accept: "application/json",
      Authorization: `Bearer ${TMDB_ACCESS_TOKEN}`,
    },
  });

  if (!res.ok) throw new Error(`TMDB discover failed: ${res.status}`);

  const data = await res.json();
  const results = data.results || [];
  const detailedMovies = await Promise.all(
    results.map(async (movie) => {
      const detailUrl = `${TMDB_BASE_URL}/movie/${movie.id}?language=en-US`;

      const detailRes = await fetch(detailUrl, {
        method: "GET",
        headers: {
          accept: "application/json",
          Authorization: `Bearer ${TMDB_ACCESS_TOKEN}`,
        },
      });

      if (!detailRes.ok) return null;

      const detailData = await detailRes.json();
      return formatMovie(detailData);
    }),
  );
  return detailedMovies.filter(Boolean);
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

  const detailData = await response.json();
  return formatMovie(detailData);
}

export async function fetchNowPlaying() {
  const token = process.env.TMDB_ACCESS_TOKEN;

  let allResults = [];
  let page = 1;
  let totalPages = 1;

  // Fetch all pages
  do {
    const listUrl = `${TMDB_BASE_URL}/movie/now_playing?language=en-US&region=FI&page=${page}`;

    const listRes = await fetch(listUrl, {
      method: "GET",
      headers: {
        accept: "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    if (!listRes.ok) throw new Error("Failed to fetch");

    const listData = await listRes.json();

    totalPages = listData.total_pages;
    allResults.push(...(listData.results || []));

    page++;
  } while (page <= totalPages);

  const detailedMovies = await Promise.all(
    allResults.map(async (movie) => {
      const detailUrl = `${TMDB_BASE_URL}/movie/${movie.id}?language=en-US&append_to_response=credits`;

      const detailRes = await fetch(detailUrl, {
        method: "GET",
        headers: {
          accept: "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      if (!detailRes.ok) return null;

      const detailData = await detailRes.json();
      console.log(formatMovie(detailData));
      return formatMovie(detailData);
    })
  );

  return detailedMovies.filter(Boolean);
}

