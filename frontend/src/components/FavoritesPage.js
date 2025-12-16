import { useEffect, useState } from "react";
import { useAuth } from "../context/login";
import { getFavorites, removeFavorite } from "../api/favorites";
import { fetchMovieDetails } from "../api/movies";
import MovieCard from "../components/MovieCard";
import "../style/FavoritesPage.css";

const API = process.env.REACT_APP_API_URL || "http://localhost:3001";

export default function FavoritesPage() {
  const { user, authFetch } = useAuth();
  const [movies, setMovies] = useState([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleRemove = async (movieId) => {
    if (!user) {
      alert("Log in to remove favorites.");
      return;
    }
    const ok = window.confirm(
      "You sure you want to remove this movie from your favorites?",
    );

    if (!ok) {
      return;
    }
    try {
      await removeFavorite(movieId, authFetch);

      // poista myös statesta, niin UI päivittyy heti
      setMovies((prev) => prev.filter((m) => m.movie_id !== movieId));
    } catch (err) {
      console.error(err);
      alert("Failed to remove favorite.");
    }
  };

  async function loadFavorites() {
    if (!user) {
      setMovies([]);
      setError("Log in to view favorites.");
      return;
    }

    try {
      setLoading(true);
      setError("");

      const favorites = await getFavorites(authFetch);

      if (!Array.isArray(favorites) || favorites.length === 0) {
        setMovies([]);
        return;
      }

      const data = await Promise.all(
        favorites.map(async (fav) => {
          const movie = await fetchMovieDetails(fav.movie_id);

          return {
            ...movie,
            movie_id: fav.movie_id,
            favorite_id: fav.favorite_id,
          };
        }),
      );

      setMovies(data);

      console.log("Favorites movies:", data);
    } catch (err) {
      console.error(err);
      setError("Failed to load favorites.");
      setMovies([]);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    if (user) {
      loadFavorites();
    } else {
      setMovies([]);
    }
  }, [user]);

  return (
    <div className="favorites-page">
      <div className="favorites-header">
        <h2>Your Favorites</h2>
        <button className="btn-primary" onClick={loadFavorites}>
          Refresh Favorites
        </button>
      </div>

      {!user && <p className="favorites-message">Log in to view favorites.</p>}
      {loading && <p className="favorites-message">Loading...</p>}
      {error && <p className="favorites-error">{error}</p>}

      {!loading && user && movies.length === 0 && <p className="favorites-message">No favorites yet.</p>}

      <div className="favorites-container">
        <div className="favorites-grid">
          {movies.map((movie) => {
            const id = movie.movie_id || movie.id;

            return (
              <div key={movie.favorite_id || id} className="favorite-card-wrapper">
                <MovieCard
                  movie={{
                    id,
                    title: movie.title || movie.original_title,
                    overview: movie.overview,
                    poster:
                      movie.poster ||
                      (movie.poster_path
                        ? `https://image.tmdb.org/t/p/w500${movie.poster_path}`
                        : null),
                    rating: movie.vote_average || movie.rating,
                    votes: movie.vote_count || movie.votes,
                    releaseYear: movie.release_date
                      ? new Date(movie.release_date).getFullYear()
                      : null,
                    runtime: movie.runtime,
                    genres: movie.genres || [],
                  }}
                />

                <button
                  type="button"
                  className="btn-remove-favorite"
                  onClick={() => handleRemove(movie.movie_id)}
                >
                  Remove
                </button>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
