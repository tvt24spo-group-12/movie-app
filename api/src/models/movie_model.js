import pool from "../database.js";

export async function getAll() {
  const result = await pool.query("SELECT * FROM movies");
  return result.rows;
}

export async function getByName(name) {
  try {
    const result = await pool.query(
      "SELECT * FROM movies WHERE name = $1",
      [name], // $1 is replaced safely with 'name'
    );
    return result.rows;
  } catch (err) {
    console.error("Error fetching movie by name:", err);
    throw err;
  }
}
