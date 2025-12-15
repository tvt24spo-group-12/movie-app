import { useEffect, useState } from "react";
import { getUpcoming } from "../api/movies";
import MovieCarousel from "./MovieCarousel";
import "../style/intheaters.css";
import { useSidebar } from "../context/sidebar";

export default function UpcomingCarousel() {
  const { sidebar } = useSidebar();
  const [movies, setMovies] = useState([]);

  // Fetch movies
  useEffect(() => {
    async function fetchNowPlaying() {
      try {
        const upcoming = await getUpcoming();
        setMovies(upcoming);
      } catch (err) {
        console.error("Failed to fetch now playing movies:", err);
      }
    }
    fetchNowPlaying();
  }, []);

  return (
    <>
      <MovieCarousel sidebar={sidebar} caption="Upcoming" movies={movies} />
    </>
  );
}
