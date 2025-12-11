import { useEffect, useState } from "react";
import { getPopular } from "../api/movies";
import MovieCarousel from "./MovieCarousel";
import "../style/intheaters.css";
import { useSidebar } from "../context/sidebar";

export default function PopularCarousel() {
  const { sidebar } = useSidebar();
  const [movies, setMovies] = useState([]);

  // Fetch movies
  useEffect(() => {
    async function fetchNowPlaying() {
      try {
        const popular = await getPopular();
        setMovies(popular);
      } catch (err) {
        console.error("Failed to fetch now playing movies:", err);
      }
    }
    fetchNowPlaying();
  }, []);

  return (
    <>
      <MovieCarousel sidebar={sidebar} caption="Popular" movies={movies} />
    </>
  );
}
