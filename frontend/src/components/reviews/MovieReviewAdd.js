import React, { useEffect, useState } from "react";
import { postMovieRating, searchMovie } from "../../api/reviews";
import { useAuth } from "../../context/login";

export default function MovieReviewAdd({ movieId, onClose }) {
  const { authFetch } = useAuth();
  const [status, setStatus] = useState("idle"); // idle | loading | success | error
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);

  const [score, setScore] = useState("");
  const [reviewText, setReviewText] = useState("");
  const [isPublic, setIsPublic] = useState(true);

  // meta from existing rating (if any)
  const [existing, setExisting] = useState(null);

  useEffect(() => {
    let mounted = true;
    async function load() {
      if (!movieId) {
        setStatus("error");
        setError("No movie id");
        handleClose();
        return;
      }
      if (!authFetch) {
        setStatus("error");
        setError("You must be logged in to add or edit reviews.");
        handleClose();
        return;
      }

      setStatus("loading");
      setError("");

      try {
        const resp = await searchMovie({ authFetch, movie_id: movieId });

        if (!mounted) return;

        let rating = null;

        if (Array.isArray(resp) && resp.length === 0) {
          rating = null;
        } else if (resp && typeof resp === "object") {
          if (
            "rating" in resp &&
            resp.rating &&
            typeof resp.rating === "object"
          ) {
            rating = resp.rating;
          } else {
            rating = null;
          }
        }

        setExisting(rating);

        if (rating) {
          if (rating.score != null) setScore(String(rating.score));
          if (rating.review) setReviewText(rating.review);
          if (rating.public != null) setIsPublic(Boolean(rating.public));
        } else {
          // clear form to empty state for user to create new
          setScore("");
          setReviewText("");
          setIsPublic(true);
        }

        setStatus("success");
      } catch (err) {
        setStatus("error");
        setError(err?.message || String(err));
      }
    }

    load();
    return () => {
      mounted = false;
    };
  }, [movieId, authFetch]);

  function handleClose() {
    if (onClose) onClose();
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setSaving(true);
    setError("");

    const numericScore = Number(score);
    if (
      Number.isNaN(numericScore) ||
      (numericScore <= 0 && numericScore >= 5)
    ) {
      setError("Score must be a number between 0 and 5.");
      return;
    }

    // include public flag in payload
    const payload = {
      score: numericScore,
      review: reviewText || undefined,
      public: isPublic,
    };

    try {
      const res = await postMovieRating({
        authFetch,
        movie_id: movieId,
        data: payload,
      });

      if (res && typeof res === "object") {
        if ("message" in res && res.message === "Rating saved successfully") {
          setStatus("success");
        }
      }
      handleClose();
    } catch (err) {
      setError(err?.message || String(err));
      setStatus("error");
    } finally {
      setSaving(false);
    }
  }

  const updatedAt = existing?.updated_at || existing?.created_at || null;

  return (
    <div className="review-form__backdrop" role="dialog" aria-modal="true">
      <form className="review-form" onSubmit={handleSubmit}>
        <div className="review-form__header">
          <h3 className="review-form__title">
            {existing ? "Edit your review" : "Add your review"}
          </h3>
          {updatedAt && (
            <div className="review-form__meta">
              Last updated: {new Date(updatedAt).toLocaleString("fi-FI")}
            </div>
          )}
        </div>

        <div className="review-form__field">
          <label className="review-form__label" htmlFor="score">
            Score (0–5)
          </label>
          <input
            id="score"
            className="review-form__input"
            type="number"
            step="1"
            min="0"
            max="5"
            value={score}
            onChange={(e) => setScore(e.target.value)}
            required
          />
        </div>

        <div className="review-form__field">
          <label className="review-form__label" htmlFor="public">
            Public
          </label>
          <input
            id="public"
            className="review-form__checkbox"
            type="checkbox"
            checked={isPublic}
            onChange={(e) => setIsPublic(e.target.checked)}
          />
        </div>

        <div className="review-form__field">
          <label className="review-form__label" htmlFor="review">
            Review (optional)
          </label>
          <textarea
            id="review"
            className="review-form__textarea"
            rows={5}
            value={reviewText}
            onChange={(e) => setReviewText(e.target.value)}
            placeholder="Share your thoughts..."
          />
        </div>

        {error && <div className="review-form__error">{error}</div>}

        <div className="review-form__actions">
          <button
            type="button"
            className="review-form__button review-form__button--muted"
            onClick={handleClose}
            disabled={saving}
          >
            Cancel
          </button>
          <button
            type="submit"
            className="review-form__button review-form__button--primary"
            disabled={saving || status === "loading"}
          >
            {saving ? "Saving…" : existing ? "Update review" : "Post review"}
          </button>
        </div>
      </form>
    </div>
  );
}
