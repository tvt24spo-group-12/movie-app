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
