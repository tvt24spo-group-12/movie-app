import { useEffect, useMemo, useState } from "react";
import { getNowPlaying, getNowPlayingPoster } from "../api/moviesInTheaters";
import MovieCardMin from "./MovieCardMin";
import "../style/intheaters.css";

export default function InTheaters() {
  const [title, setTitle] = useState([]);
  const [movies, setMovies] = useState([]);
  const [startIndex, setStartIndex] = useState(0);
  const moviesPerPage = 6;

  useEffect(() => {
    async function fetchNowPlaying() {
      try {
        const nowPlaying = await getNowPlaying(); // returns normalized + enriched data
        setMovies(nowPlaying);
      } catch (err) {
        console.error("Failed to fetch now playing movies:", err);
      }
    }
    fetchNowPlaying();
  }, []);

  const results = useMemo(() => movies ?? [], [movies]);
  const endIndex = startIndex + moviesPerPage;
  const visibleMovies = results.slice(startIndex, endIndex);

  const handleNext = () => {
    if (endIndex < results.length) {
      setStartIndex((prev) => prev + moviesPerPage);
    }
  };

  const handlePrev = () => {
    if (startIndex > 0) {
      setStartIndex((prev) => prev - moviesPerPage);
    }
  };

  return (
    <>
      <h1 className="nowPlayingh1">Now Playing</h1>
      <div className="movie-nav">
        <button onClick={handlePrev} disabled={startIndex === 0}>
          ◀ Prev
        </button>
        <button onClick={handleNext} disabled={endIndex >= results.length}>
          Next ▶
        </button>
      </div>
      <article className="movie-card movieContainer">
        {results.slice(startIndex, endIndex).map((movie) => (
          <MovieCardMin key={movie.id} movie={movie} />
        ))}
      </article>
    </>
  );
}

