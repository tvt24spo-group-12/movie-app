// näytä elokuva-kartta posterin, metatietojen ja äänen tiedon perusteella
function ReviewCard({ review }) {
  const {
    title = "Untitled",
    release_date,
    created_at,
    updated_at,
    score,
    rating,
    poster = "",
    review: reviewText,
  } = review;

  return (
    <article className="movie-card-min">
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
          {release_date && (
            <span>{new Date(release_date).toLocaleDateString("fi-FI")} | </span>
          )}
          {score != null && <span>⭐ {Number(score).toFixed(1)}</span>}
        </div>

        <h3 className="movie-card__title">{title}</h3>
        <h4 className="movie-card__title">{}</h4>

        <p className="movie-card__overview">
          {reviewText || "No review text for this review."}
        </p>
      </div>
    </article>
  );
}
export default ReviewCard;
