// näytä elokuva-kartta posterin, metatietojen ja äänen tiedon perusteella
function MovieReviewCard({ review }) {
  const {
    created_at,
    updated_at,
    score,
    username,
    review: reviewText,
  } = review;

  return (
    <article className="movie-card-min">
      <div className="movie-card__content">
        <div className="movie-card__meta">
          {created_at && (
            <span>{new Date(created_at).toLocaleDateString("fi-FI")} | </span>
          )}
          {score != null && <span>⭐ {Number(score).toFixed(1)}</span>}
        </div>

        <h3 className="movie-card__title">{username}</h3>

        <p className="movie-card__overview">
          {reviewText || "No review text for this review."}
        </p>
      </div>
    </article>
  );
}
export default MovieReviewCard;
