import MovieReviews from "./reviews/MovieReviews";
import { useEffect, useState } from "react";
import { fetchMovieDetails } from "../api/movies";

function MoviePage({ movie_id }) {
  const [movie, setMovie] = useState({
    title: "",
    poster: "",
    releaseYear: null,
    runtime: null,
    rating: null,
    overview: "",
    genres: [],
    votes: null,
  });
  const [status, setStatus] = useState("idle"); // idle | loading | success | error
  const [error, setError] = useState("");

  useEffect(() => {
    if (!movie_id) {
      setStatus("error");
      setError("Movie ID is missing.");
      return;
    }

    async function loadMovie() {
      try {
        setStatus("loading");
        setError("");

        const result = await fetchMovieDetails(movie_id);

        setMovie(result);
        setStatus("success");
      } catch (err) {
        setError(err.message);
        setStatus("error");
      }
    }

    loadMovie();
  }, [movie_id]);

  if (status === "loading") {
    return <p>Loading movie details...</p>;
  }

  if (status === "error") {
    return <p className="error-message">Error loading movie: {error}</p>;
  }

  if (status === "success" && !movie.title) {
    return <p>Movie not found.</p>;
  }

  return (
    <>
      <article className="movie-card">
        <div className="movie-card__poster">
          {movie.poster ? (
            <img src={movie.poster} alt={`${movie.title} poster`} />
          ) : (
            // placeholder, kun ei ole posteriä
            <div className="movie-card__poster-placeholder">
              <span>No poster</span>
            </div>
          )}
        </div>

        <div className="movie-card__content">
          <div className="movie-card__meta">
            {movie.releaseYear && <span>{movie.releaseYear} | </span>}
            {movie.runtime && <span>{movie.runtime} min | </span>}
            {movie.rating != null && (
              <span>⭐ {Number(movie.rating).toFixed(1)}</span>
            )}
          </div>

          <h3 className="movie-card__title">{movie.title}</h3>

          {movie.genres?.length > 0 && (
            <div className="movie-card__genres">{movie.genres.join(" • ")}</div>
          )}

          <p className="movie-card__overview">
            {movie.overview || "No description available yet."}
          </p>

          {movie.votes != null && (
            <div className="movie-card__footer">
              <span className="movie-card__votes">
                {movie.votes.toLocaleString()} votes
              </span>
            </div>
          )}
        </div>
      </article>
      <MovieReviews movie_id={movie_id} />
    </>
  );
}

export default MoviePage;

