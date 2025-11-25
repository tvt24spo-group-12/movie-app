import {
  createOrUpdateRating,
  getRatingByUserAndMovie,
  getRatingsByUser,
  getPublicRatingsByMovie,
  deleteRating,
  getMovieAverageRating,
} from "../models/rating_model.js";
import { saveMovie } from "../models/movie_model.js";
import { getMovieDetailsByID } from "../models/tmdb_model.js";

/**
 * POST /movie/:movieId/rating - Create or update a movie rating
 * GET /movie/:movieId/rating - Get current user's rating for a movie
 * GET /movie/:movieId/ratings - Get all public ratings for a movie along with average rating and count
 * DELETE /movie/:movieId/rating - Delete a rating
 * GET /user/ratings - Get current user's ratings
 * GET /user/:userId/ratings - Get specified user's ratings
 */

// Create or update a movie rating
export async function addOrUpdateRating(req, res, next) {
  try {
    const userId = req.user.user_id; // From auth middleware
    const movieId = parseInt(req.params.movieId, 10);
    const { score, review, public: isPublic } = req.body;

    // Validate movieId
    if (isNaN(movieId)) {
      return res.status(400).json({ error: "Invalid movie ID" });
    }

    // Validate score (1-5)
    if (!score || score < 1 || score > 5) {
      return res.status(400).json({ error: "Score must be between 1 and 5" });
    }

    // Try to save the movie first if it doesn't exist
    try {
      const tmdbData = await getMovieDetailsByID(movieId);
      
      // Use the raw TMDB data
      const rawData = tmdbData.raw || tmdbData;
      
      const movieToSave = {
        movie_id: rawData.id,
        title: rawData.title,
        original_title: rawData.original_title || rawData.title,
        overview: rawData.overview || null,
        genres: rawData.genres ? rawData.genres.map(g => `(${g.id},"${g.name}")`) : null,
        status: rawData.status || null,
        release_date: rawData.release_date || null,
        in_theaters: false,
        poster_path: rawData.poster_path || null,
        backdrop_path: rawData.backdrop_path || null,
        vote_count: rawData.vote_count || 0,
        vote_average: rawData.vote_average || 0,
        runtime: rawData.runtime || null,
      };

      await saveMovie(movieToSave);
    } catch (movieErr) {
      // If movie save fails, continue anyway (movie might already exist)
      console.log("Could not save movie to database:", movieErr.message);
    }

    const rating = await createOrUpdateRating(
      userId,
      movieId,
      score,
      review || null,
      isPublic || false
    );

    res.status(201).json({
      message: "Rating saved successfully",
      rating: {
        vote_id: rating.vote_id,
        movie_id: rating.movie_id,
        score: rating.score,
        review: rating.review,
        public: rating.public,
        created_at: rating.created_at,
        updated_at: rating.updated_at,
      },
    });
  } catch (err) {
    next(err);
  }
}

// Get current user's rating for a movie
export async function getUserRatingForMovie(req, res, next) {
  try {
    const userId = req.user.user_id;
    const movieId = parseInt(req.params.movieId, 10);

    if (isNaN(movieId)) {
      return res.status(400).json({ error: "Invalid movie ID" });
    }

    const rating = await getRatingByUserAndMovie(userId, movieId);

    if (!rating) {
      return res.status(404).json({ error: "Rating not found" });
    }

    res.json({ rating });
  } catch (err) {
    next(err);
  }
}

// Get all public ratings for a movie along with average rating and count
export async function getMovieRatings(req, res, next) {
  try {
    const movieId = parseInt(req.params.movieId, 10);

    if (isNaN(movieId)) {
      return res.status(400).json({ error: "Invalid movie ID" });
    }

    const ratings = await getPublicRatingsByMovie(movieId);
    const stats = await getMovieAverageRating(movieId);

    res.json({
      movie_id: movieId,
      average_rating: stats.average_rating || 0,
      rating_count: parseInt(stats.rating_count, 10),
      ratings,
    });
  } catch (err) {
    next(err);
  }
}

// Delete a rating
export async function removeRating(req, res, next) {
  try {
    const userId = req.user.user_id;
    const movieId = parseInt(req.params.movieId, 10);

    if (isNaN(movieId)) {
      return res.status(400).json({ error: "Invalid movie ID" });
    }

    const deleted = await deleteRating(userId, movieId);

    if (!deleted) {
      return res.status(404).json({ error: "Rating not found" });
    }

    res.json({
      message: "Rating deleted successfully",
      deleted_vote_id: deleted.vote_id,
    });
  } catch (err) {
    next(err);
  }
}

// Get current user's ratings
export async function getCurrentUserRatings(req, res, next) {
  try {
    const userId = req.user.user_id;
    const ratings = await getRatingsByUser(userId);

    res.json({
      user_id: userId,
      rating_count: ratings.length,
      ratings,
    });
  } catch (err) {
    next(err);
  }
}


export async function getUserRatings(req, res, next) {
  try {
    const userId = parseInt(req.params.userId, 10);

    if (isNaN(userId)) {
      return res.status(400).json({ error: "Invalid user ID" });
    }

    const ratings = await getRatingsByUser(userId);

    res.json({
      user_id: userId,
      rating_count: ratings.length,
      ratings,
    });
  } catch (err) {
    next(err);
  }
}
