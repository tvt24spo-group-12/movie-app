import { useEffect, useMemo, useState } from "react";
import { useAuth } from "../context/login";
import { getFavorites, getFavoritesPublic, removeFavorite } from "../api/favorites";
import { fetchMovieDetails } from "../api/movies";
import MovieCard from "../components/MovieCard";
import "../style/FavoritesPage.css";

export default function FavoritesPage({ targetUserId }) {
  const { user, authFetch } = useAuth();
  const [movies, setMovies] = useState([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const viewUserId = useMemo(() => targetUserId || user?.id || null, [targetUserId, user]);
  const isOwnFavorites = useMemo(() => {
    if (!targetUserId && user) return true;
    if (targetUserId && user) return String(user.id) === String(targetUserId);
    return false;
  }, [targetUserId, user]);

  const handleRemove = async (movieId) => {
    if (!user || !isOwnFavorites) {
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

  const shareLink = async () => {
    if (!isOwnFavorites || !user) return;
    const url = `${window.location.origin}/favorites/${user.id}`;

    try {
      if (navigator.clipboard && navigator.clipboard.writeText) {
        await navigator.clipboard.writeText(url);
        alert("Link copied to clipboard");
      } else {
        const textarea = document.createElement("textarea");
        textarea.value = url;
        textarea.style.position = "fixed";
        document.body.appendChild(textarea);
        textarea.focus();
        textarea.select();
        document.execCommand("copy");
        document.body.removeChild(textarea);
        alert("Link copied to clipboard");
      }
    } catch (err) {
      console.error(err);
      alert("Could not copy link");
    }
  };

  async function loadFavorites() {
    if (!viewUserId) {
      setMovies([]);
      setError("Log in to view favorites.");
      return;
    }

    try {
      setLoading(true);
      setError("");

      const favorites = isOwnFavorites && authFetch
        ? await getFavorites(authFetch)
        : await getFavoritesPublic(viewUserId);

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

      //console.log("Favorites movies:", data);
    } catch (err) {
      console.error(err);
      setError("Failed to load favorites.");
      setMovies([]);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    if (viewUserId) {
      loadFavorites();
    } else {
      setMovies([]);
    }
  }, [user, viewUserId]);

  return (
    <div className="favorites-page">
      <div className="favorites-header">
        <h2>{isOwnFavorites ? "Your Favorites" : "Shared Favorites"}</h2>
        <button className="btn-primary" onClick={loadFavorites}>
          Refresh Favorites
        </button>
        {isOwnFavorites && user && (
          <button className="btn-secondary" onClick={shareLink}>
            Share Favorites
          </button>
        )}
      </div>

      {!viewUserId && <p className="favorites-message">Log in to view favorites.</p>}
      {loading && <p className="favorites-message">Loading...</p>}
      {error && <p className="favorites-error">{error}</p>}

      {!loading && movies.length === 0 && viewUserId && (
        <p className="favorites-message">No favorites yet.</p>
      )}

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

                {isOwnFavorites && (
                  <button
                    type="button"
                    className="btn-remove-favorite"
                    onClick={() => handleRemove(movie.movie_id)}
                  >
                    Remove
                  </button>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
