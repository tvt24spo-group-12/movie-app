import pool from "../database.js";

export async function getAll() {
  const result = await pool.query("SELECT * FROM movies");
  return result.rows;
}

export async function getByName(name) {
  const searchPattern = `%${name.trim()}%`;
  const result = await pool.query("SELECT * FROM movies WHERE title ILIKE $1", [
    searchPattern,
  ]);
  return result.rows;
}

export async function getById(id) {
  const result = await pool.query("SELECT * FROM movies WHERE movie_id = $1", [
    id,
  ]);
  return result.rows;
}

export async function saveMovie(movieData) {
  const {
    movie_id,
    title,
    original_title,
    overview,
    genres,
    status,
    release_date,
    in_theaters,
    poster_path,
    backdrop_path,
    vote_count,
    vote_average,
    runtime,
  } = movieData;

  // Ensure integer fields have valid values
  const safeVoteCount =
    vote_count !== undefined && vote_count !== null ? vote_count : 0;
  const safeVoteAverage =
    vote_average !== undefined && vote_average !== null ? vote_average : 0;
  const safeRuntime =
    runtime !== undefined && runtime !== null ? runtime : null;

  const result = await pool.query(
    `INSERT INTO movies 
      (movie_id, title, original_title, overview, genres, status, release_date, 
       in_theaters, poster_path, backdrop_path, vote_count, vote_average, runtime)
     VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13)
     ON CONFLICT (movie_id) 
     DO UPDATE SET
       title = EXCLUDED.title,
       original_title = EXCLUDED.original_title,
       overview = EXCLUDED.overview,
       genres = EXCLUDED.genres,
       status = EXCLUDED.status,
       release_date = EXCLUDED.release_date,
       in_theaters = EXCLUDED.in_theaters,
       poster_path = EXCLUDED.poster_path,
       backdrop_path = EXCLUDED.backdrop_path,
       vote_count = EXCLUDED.vote_count,
       vote_average = EXCLUDED.vote_average,
       runtime = EXCLUDED.runtime
     RETURNING *`,
    [
      movie_id,
      title,
      original_title,
      overview,
      genres,
      status,
      release_date,
      in_theaters,
      poster_path,
      backdrop_path,
      safeVoteCount,
      safeVoteAverage,
      safeRuntime,
    ],
  );
  return result.rows[0];
}

export async function discoverMovies(filters) {
  const conditions = [];
  const values = [];

  if (filters.genre) {
    const genres = filters.genre.split(",").map((g) => g.trim().toLowerCase());

    // Check if any genre.name matches
    conditions.push(
      `EXISTS (
        SELECT 1
        FROM unnest(genres) AS g
        WHERE LOWER(g.name) = ANY($${values.length + 1}::text[])
      )`,
    );
    values.push(genres);
  }

  if (filters.year) {
    conditions.push(`EXTRACT(YEAR FROM release_date) = $${values.length + 1}`);
    values.push(filters.year);
  }

  if (filters.release_from) {
    conditions.push(`release_date >= $${values.length + 1}`);
    values.push(filters.release_from);
  }

  if (filters.release_to) {
    conditions.push(`release_date <= $${values.length + 1}`);
    values.push(filters.release_to);
  }

  if (filters.min_rating) {
    conditions.push(`vote_average >= $${values.length + 1}`);
    values.push(filters.min_rating);
  }

  if (filters.max_rating) {
    conditions.push(`vote_average <= $${values.length + 1}`);
    values.push(filters.max_rating);
  }

  if (filters.runtime_min) {
    conditions.push(`runtime >= $${values.length + 1}`);
    values.push(filters.runtime_min);
  }

  if (filters.runtime_max) {
    conditions.push(`runtime <= $${values.length + 1}`);
    values.push(filters.runtime_max);
  }

  let query = "SELECT * FROM movies";
  if (conditions.length) query += " WHERE " + conditions.join(" AND ");

  const result = await pool.query(query, values);
  return result.rows;
}
