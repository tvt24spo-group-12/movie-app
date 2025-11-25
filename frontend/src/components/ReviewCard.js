// näytä elokuva-kartta posterin, metatietojen ja äänen tiedon perusteella
function ReviewCard({ movie }) {
  const { title, review, poster, rating, votes, releaseYear, genres, runtime } =
    movie;

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
          {rating != null && <span>⭐ {Number(rating).toFixed(1)}</span>}
        </div>

        <h3 className="movie-card__title">{title}</h3>
        <h4 className="movie-card__title">{title}</h4>

        <p className="movie-card__overview">
          {review || "No review text for this review."}
        </p>

        {votes != null && (
          <div className="movie-card__footer">
            <span className="movie-card__votes">
              {votes.toLocaleString()} votes
            </span>
          </div>
        )}
      </div>
    </article>
  );
}

export default ReviewCard;

