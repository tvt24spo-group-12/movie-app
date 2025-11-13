import { useEffect, useState, useRef } from "react";
import { getNowPlaying } from "../api/moviesInTheaters";
import MovieCardMin from "./MovieCardMin";
import "../style/intheaters.css";

export default function InTheaters() {
  const [movies, setMovies] = useState([]);
  const [startIndex, setStartIndex] = useState(0);
  const [moviesPerPage, setMoviesPerPage] = useState(1);
  const containerRef = useRef(null);

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

  useEffect(() => {
    const updateMoviesPerPage = () => {
      if (!containerRef.current) return;
      const containerWidth = containerRef.current.offsetWidth;
      const gap = 20;
      const cardWidth = 248;
      const perPage = Math.floor(containerWidth / (cardWidth + gap));
      setMoviesPerPage(perPage || 1);
    };
    updateMoviesPerPage();
    window.addEventListener("resize", updateMoviesPerPage);
    return () => window.removeEventListener("resize", updateMoviesPerPage);
  }, []);

  const handleNext = () => {
    if (startIndex + moviesPerPage < movies.length) {
      setStartIndex((prev) => prev + moviesPerPage);
      console.log(startIndex);
    }
  };

  const handlePrev = () => {
    if (startIndex > 0) {
      setStartIndex((prev) => prev - moviesPerPage);

      console.log(startIndex);
    }
  };

  const slideDistance = 248 + 20; // card width + gap

  return (
    <>
      <h1 className="nowPlayingh1">Now Playing</h1>
      <div className="movie-nav">
        <button onClick={handlePrev} disabled={startIndex < moviesPerPage}>
          &lt;
        </button>
        <button
          onClick={handleNext}
          disabled={startIndex + moviesPerPage >= movies.length}
        >
          &gt;
        </button>
      </div>
      <article className="movie-card movieContainer" ref={containerRef}>
        <div
          className="movie-slider"
          style={{
            transform: `translateX(-${startIndex * slideDistance}px)`,
          }}
        >
          {movies.map((movie) => (
            <MovieCardMin key={movie.id} movie={movie} />
          ))}
        </div>
      </article>
    </>
  );
}
