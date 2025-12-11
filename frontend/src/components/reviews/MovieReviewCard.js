// Review card for displaying individual movie reviews
function MovieReviewCard({ review }) {
  const {
    created_at,
    updated_at,
    score,
    username,
    review: reviewText,
  } = review;

  return (
    <article className="review-card">
      <div className="review-card__header">
        <div className="review-card__user-info">
          <h4 className="review-card__username">{username}</h4>
          <div className="review-card__meta">
            {created_at && (
              <span className="review-card__date">
                {new Date(created_at).toLocaleDateString("fi-FI")}
              </span>
            )}
            {score != null && (
              <span className="review-card__rating">
                ⭐ {Number(score).toFixed(1)}
              </span>
            )}
          </div>
        </div>
      </div>

      <p className="review-card__text">
        {reviewText || "No review text for this review."}
      </p>
    </article>
  );
}
export default MovieReviewCard;
