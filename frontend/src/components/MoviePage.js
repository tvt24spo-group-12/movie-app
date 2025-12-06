import MovieReviews from "./reviews/MovieReviews";
import MovieReviewAdd from "./reviews/MovieReviewAdd";
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
  const [addReviewOpen, setAddReviewOpen] = useState(false);
  const [reviewsVersion, setReviewsVersion] = useState(0);

  function openReviewForm() {
    setAddReviewOpen(true);
  }
  function closeReviewForm(refresh = false) {
    setAddReviewOpen(false);
    if (refresh) setReviewsVersion((v) => v + 1);
  }

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
      <div className="movie-backdrop-banner">
        {movie.backdrop ? (
          <img src={movie.backdrop} alt={`${movie.title} backdrop`} />
        ) : (
          <div className="movie-backdrop-banner__placeholder">
            <span>No backdrop</span>
          </div>
        )}
      </div>

      <article className="movie-page">
        <div className="movie-page__poster">
          {movie.poster ? (
            <img src={movie.poster} alt={`${movie.title} poster`} />
          ) : (
            <div className="movie-page__poster-placeholder">
              <span>No poster</span>
            </div>
          )}
        </div>

        <div className="movie-page__content">
          <div className="movie-page__meta">
            {movie.releaseYear && <span>{movie.releaseYear} | </span>}
            {movie.runtime && <span>{movie.runtime} min | </span>}
            {movie.rating != null && (
              <span>⭐ {Number(movie.rating).toFixed(1)}</span>
            )}
          </div>

          <h3 className="movie-page__title">{movie.title}</h3>

          {movie.genres?.length > 0 && (
            <div className="movie-page__genres">{movie.genres.join(" • ")}</div>
          )}

          <p className="movie-page__overview">
            {movie.overview || "No description available yet."}
          </p>

          {movie.votes != null && (
            <div className="movie-page__footer">
              <span className="movie-page__votes">
                {movie.votes.toLocaleString()} votes
              </span>
            </div>
          )}
        </div>

        <button className="review-form__button" onClick={openReviewForm}>
          Add/Edit review
        </button>
      </article>
      {addReviewOpen && (
        <MovieReviewAdd
          movieId={movie_id}
          onClose={() => closeReviewForm(true)}
        />
      )}
      <MovieReviews
        movie_id={movie_id}
        own={true}
        key={`own-${reviewsVersion}`}
      />
      <MovieReviews
        movie_id={movie_id}
        own={false}
        key={`all-${reviewsVersion}`}
      />
    </>
  );
}

export default MoviePage;
