import pool from "../database.js";

export async function createOrUpdateRating(userId, movieId, score, review = null, isPublic = false) {
  const result = await pool.query(
    `INSERT INTO movie_votes (user_id, movie_id, score, review, public, created_at, updated_at)
     VALUES ($1, $2, $3, $4, $5, NOW(), NOW())
     ON CONFLICT (movie_id, user_id)
     DO UPDATE SET 
       score = EXCLUDED.score,
       review = EXCLUDED.review,
       public = EXCLUDED.public,
       updated_at = NOW()
     RETURNING *`,
    [userId, movieId, score, review, isPublic]
  );
  return result.rows[0];
}

export async function getRatingByUserAndMovie(userId, movieId) {
  const result = await pool.query(
    "SELECT * FROM movie_votes WHERE user_id = $1 AND movie_id = $2",
    [userId, movieId]
  );
  return result.rows[0] || null;
}

export async function getRatingsByUser(userId) {
  const result = await pool.query(
    `SELECT mv.*, m.title, m.poster_path, m.release_date
     FROM movie_votes mv
     LEFT JOIN movies m ON mv.movie_id = m.movie_id
     WHERE mv.user_id = $1
     ORDER BY mv.updated_at DESC`,
    [userId]
  );
  return result.rows;
}

export async function getPublicRatingsByMovie(movieId) {
  const result = await pool.query(
    `SELECT mv.vote_id, mv.movie_id, mv.score, mv.review, mv.created_at, mv.updated_at, 
            u.username, u.user_id
     FROM movie_votes mv
     JOIN users u ON mv.user_id = u.user_id
     WHERE mv.movie_id = $1 AND mv.public = true
     ORDER BY mv.updated_at DESC`,
    [movieId]
  );
  return result.rows;
}

export async function deleteRating(userId, movieId) {
  const result = await pool.query(
    "DELETE FROM movie_votes WHERE user_id = $1 AND movie_id = $2 RETURNING *",
    [userId, movieId]
  );
  return result.rows[0] || null;
}

export async function getMovieAverageRating(movieId) {
  const result = await pool.query(
    `SELECT 
       ROUND(AVG(score)::numeric, 1) as average_rating,
       COUNT(*) as rating_count
     FROM movie_votes
     WHERE movie_id = $1`,
    [movieId]
  );
  return result.rows[0];
}
