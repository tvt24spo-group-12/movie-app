import { fetchNowPlaying } from "../models/tmdb_model.js";

export async function getNowPlaying(req, res) {
  try {
    const movies = await fetchNowPlaying();
    res.json(movies);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch full now playing movies" });
  }
}