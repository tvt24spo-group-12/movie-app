import { useEffect, useState } from "react";
import { getTrending } from "../api/movies";
import MovieCarousel from "./MovieCarousel";
import "../style/intheaters.css";
import { useSidebar } from "../context/sidebar";

export default function TrendingCarousel() {
  const { sidebar } = useSidebar();
  const [movies, setMovies] = useState([]);

  // Fetch movies
  useEffect(() => {
    async function fetchNowPlaying() {
      try {
        const trending = await getTrending();
        setMovies(trending);
      } catch (err) {
        console.error("Failed to fetch now playing movies:", err);
      }
    }
    fetchNowPlaying();
  }, []);

  return (
    <>
      <MovieCarousel sidebar={sidebar} caption="Trending" movies={movies} />
    </>
  );
}
