import { useEffect, useState } from "react";
import { getNowPlaying } from "../api/moviesInTheaters";
import MovieCarousel from "./MovieCarousel";
import "../style/intheaters.css";
import { useSidebar } from "../context/sidebar";

export default function InTheaters() {
  const { sidebar } = useSidebar();
  const [movies, setMovies] = useState([]);

  // Fetch movies
  useEffect(() => {
    async function fetchNowPlaying() {
      try {
        const nowPlaying = await getNowPlaying();
        setMovies(nowPlaying);
      } catch (err) {
        console.error("Failed to fetch now playing movies:", err);
      }
    }
    fetchNowPlaying();
  }, []);

  return (
    <>
      <MovieCarousel sidebar={sidebar} caption="Now Playing" movies={movies} />
    </>
  );
}
