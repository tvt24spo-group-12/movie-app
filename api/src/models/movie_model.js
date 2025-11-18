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
