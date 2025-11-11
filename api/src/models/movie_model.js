import pool from "../database.js";

export async function getAll() {
  const result = await pool.query("SELECT * FROM movies");
  return result.rows;
}

export async function getOne(id) {
  const result = await pool.query("SELECT * FROM movies WHERE id = $1", [id]);
  return result.rows.length > 0 ? result.rows[0] : null;
}

export async function addOne(movie) {
  const result = await pool.query(
    "INSERT INTO movies (name,media_type,moviePicture,in_theaters) VALUES($1,$2,$3,$4,$5)",
    [movie.name, movie.media_type, movie.movie_picture, in_theaters],
  );
  return result.rows;
}

export async function updateOne(id, movie) {
  console.log("update:" + id);
  const result = await pool.query(
    "UPDATE movies SET name=$1, author=$2, isbn=$3",
    [movie.name, movie.author, movie.isbn],
  );
  return result.rows;
}

export async function deleteOne(id) {
  console.log("delete:" + id);
  const result = await pool.query("DELETE FROM movies WHERE id = $1", [id]);
  return result.rows;
}
