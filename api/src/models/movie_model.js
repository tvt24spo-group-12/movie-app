import pool from "../database.js";

export async function getAll() {
  const result = await pool.query("SELECT * FROM movie");
  return result.rows;
}

export async function getOne(id) {
  const result = await pool.query("SELECT * FROM movie WHERE id = $1", [id]);
  return result.rows.length > 0 ? result.rows[0] : null;
}

export async function addOne(movie) {
  const result = await pool.query(
    "INSERT INTO movie (name,author,isbn) VALUES($1,$2,$3)",
    [movie.name, movie.author, movie.isbn],
  );
  return result.rows;
}

export async function updateOne(id, movie) {
  console.log("update:" + id);
  const result = await pool.query(
    "UPDATE movie SET name=$1, author=$2, isbn=$3",
    [movie.name, movie.author, movie.isbn],
  );
  return result.rows;
}

export async function deleteOne(id) {
  console.log("delete:" + id);
  const result = await pool.query("DELETE FROM movie WHERE id = $1", [id]);
  return result.rows;
}
