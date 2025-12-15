// näytä elokuva-kartta posterin, metatietojen ja äänen tiedon perusteella
import { useEffect, useState } from "react";
import { getFavorite, handleFavorite } from "../api/favorites";
import { useAuth } from "../context/login";

function MovieCard({ movie }) {
  const { user, authFetch } = useAuth();
  const {
    title,
    overview,
    poster,
    rating,
    votes,
    releaseYear,
    genres,
    runtime,
    id,
  } = movie;
  const [isExpanded, setIsExpanded] = useState(false);
  const [favorited, setFavorited] = useState(false);

  async function onFavoriteClick() {
    if (!user) {
      alert("You must be logged in to add movies to favorites.");
      return;
    }

    // Optimistically toggle favorite
    setFavorited((prev) => !prev);

    try {
      const newState = await handleFavorite(id, authFetch);

      // Sync with backend result in case of mismatch
      setFavorited(newState);
    } catch (err) {
      console.error("Failed to toggle favorite:", err);
      // Revert state on error
      setFavorited((prev) => !prev);
    }
  }

  useEffect(() => {
    let mounted = true;
    async function loadFavorite() {
      if (!id || !authFetch) return;
      try {
        const favorite = await getFavorite(id, authFetch);
        if (Array.isArray(favorite) && favorite.length > 0) setFavorited(true);
      } catch (err) {
        console.error("Failed to load favorite:", err);
      }
    }

    loadFavorite();
    return () => {
      mounted = false;
    };
  }, [id, authFetch, favorited]);

  return (
    <article className="movie-card">
      <div className="movie-card__poster">
        {poster ? (
          <img src={poster} alt={`${title} poster`} />
        ) : (
          // placeholder, kun ei ole posteriä
          <div className="movie-card__poster-placeholder">
            <span>No poster</span>
          </div>
        )}
      </div>

      <div className="movie-card__content">
        <div className="movie-card__meta">
          {releaseYear && <span>{releaseYear} | </span>}
          {runtime && <span>{runtime} min | </span>}
          {rating != null && <span>⭐ {Number(rating).toFixed(1)}</span>}
        </div>

        <h3 className="movie-card__title">
          <a href={`/movie/${id}`}>{title}</a>
        </h3>

        {genres?.length > 0 && (
          <div className="movie-card__genres">{genres.join(" • ")}</div>
        )}

        <p
          className={`movie-card__overview ${!isExpanded ? "clamped" : ""}`}
          onClick={() => setIsExpanded(!isExpanded)}
          title={!isExpanded ? "Click to read more" : "Click to show less"}
        >
          {overview || "No description available yet."}
        </p>

        {votes != null && (
          <div className="movie-card__footer">
            <span className="movie-card__votes">
              {votes.toLocaleString()} votes
            </span>

            {user && (
              <button
                type="button"
                className="btn-primary"
                onClick={onFavoriteClick}
              >
                {favorited ? "Unfavorite" : "Favorite"}
              </button>
            )}
          </div>
        )}
      </div>
    </article>
  );
}

export default MovieCard;
