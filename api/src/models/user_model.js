import pool from "../database.js";
import { hash as bcryptHash } from "bcrypt";

export async function createUser(email, username, plainPassword) {
  const hashed = await new Promise((resolve, reject) =>
    bcryptHash(plainPassword, 10, (err, hashedPw) =>
      err ? reject(err) : resolve(hashedPw),
    ),
  );

  return await pool.query(
    "INSERT INTO users (email, username, password) VALUES ($1, $2, $3) RETURNING *",
    [email, username, hashed],
  );
}

export async function changeUserPassword(user_id, newPassword) {
  const hashed = await new Promise((resolve, reject) =>
    bcryptHash(newPassword, 10, (err, hashedPw) =>
      err ? reject(err) : resolve(hashedPw),
    ),
  );
  return await pool.query(
    "UPDATE users SET password = $1 WHERE user_id = $2 RETURNING *",
    [hashed, user_id]
  );
}  

export async function findUserByEmail(email) {
  return await pool.query("SELECT * FROM users WHERE email = $1", [email]);
}
export async function findUserByUsername(username) {
  return await pool.query("SELECT * FROM users WHERE username = $1", [
    username,
  ]);
}

export async function findUserById(user_id) {
  return await pool.query(
    "SELECT * FROM users WHERE user_id = $1",
    [user_id]
  );
}

export async function saveRefreshToken(username, refreshToken) {
  return await pool.query(
    "UPDATE users SET refresh_token = $1 WHERE username = $2 RETURNING user_id",
    [refreshToken, username],
  );
}

export async function getUserByRefreshToken(refreshToken) {
  const result = await pool.query(
    "SELECT user_id, email, username FROM users WHERE refresh_token = $1",
    [refreshToken],
  );
  return result.rows.length > 0 ? result.rows[0] : null;
}

export async function clearRefreshToken(username) {
  const result = await pool.query(
    "UPDATE users SET refresh_token = NULL WHERE username = $1 RETURNING username",
    [username],
  );
  return result.rows[0];
}

export async function getUserById(id) {
  const result = await pool.query(
    "SELECT username FROM users WHERE user_id = $1",
    [id],
  );
  return result.rows[0];
}

