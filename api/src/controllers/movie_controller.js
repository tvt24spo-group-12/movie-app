import { getAll } from "../models/movie_model.js";
import {
  getMovieDetailsByID,
  fetchPopular,
  fetchTrending,
  fetchUpcoming,
} from "../models/tmdb_model.js";

export async function getMovies(req, res, next) {
  try {
    const movies = await getAll();
    res.json(movies);
  } catch (err) {
    next(err);
  }
}

export async function getTMDBDetailsById(req, res, next) {
  try {
    const data = await getMovieDetailsByID(req.params.id);

    res.json(data);
  } catch (err) {
    next(err);
  }
}

export async function getPopular(req, res) {
  try {
    const movies = await fetchPopular();
    res.json(movies);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch popular movies" });
  }
}

export async function getTrending(req, res) {
  try {
    const movies = await fetchTrending();
    res.json(movies);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch trending movies" });
  }
}

export async function getUpcoming(req, res) {
  try {
    const movies = await fetchUpcoming();
    res.json(movies);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch upcoming movies" });
  }
}
