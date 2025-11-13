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

export async function findUserByEmail(email) {
  return await pool.query("SELECT * FROM users WHERE email = $1", [email]);
}
export async function findUserByUsername(username) {
  return await pool.query(
    "SELECT * FROM users WHERE username = $1",
    [username]
  );
}
