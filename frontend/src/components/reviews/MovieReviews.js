import { useEffect, useState } from "react";
import { useAuth } from "../../context/login";
import MovieReviewCard from "./MovieReviewCard";
import { searchMovieReviews, searchMovie } from "../../api/reviews";

export default function MovieReviews({ movie_id, own = false }) {
  const { user, authFetch } = useAuth();
  const [reviews, setReviews] = useState([]);
  const [status, setStatus] = useState("idle"); // idle | loading | success | error
  const [error, setError] = useState("");
  const [show, setShow] = useState(true);

  useEffect(() => {
    if (!movie_id && (!own || user)) {
      setShow(false);
      setStatus("idle");
      return; // nothing to do
    }

    async function fetchReviews() {
      setStatus("loading");
      setError("");

      try {
        let data;
        if (own) {
          data = await searchMovie({ authFetch, movie_id });
        } else {
          data = await searchMovieReviews(movie_id);
        }

        console.debug("search movie response:", data);

        if (data == null) {
          setReviews([]);
        } else if (Array.isArray(data.ratings)) {
          setReviews(data.ratings);
        } else if (data.rating) {
          setReviews([data.rating]);
        } else {
          const arr = Object.values(data).find((v) => Array.isArray(v));
          setReviews(arr || []);
        }

        setStatus("success");
      } catch (err) {
        console.error("Failed to fetch user reviews:", err);
        setError(err.message || "Failed to load reviews. Please try again.");
        setStatus("error");
      }
    }

    fetchReviews();
  }, [movie_id, own, user]);

  const renderContent = () => {
    if (status === "loading") {
      return <p>Loading your movie reviews...</p>;
    }

    if (status === "error") {
      return <p className="error-message">Error: {error}</p>;
    }

    if (reviews.length === 0 && own) {
      return <p>You haven't posted any reviews yet.</p>;
    }

    if (reviews.length === 0 && !own) {
      return <p>There aren't any public reviews yet.</p>;
    }

    // Success: Map over reviews and render ReviewCard for each
    return (
      <>
        <h1 className="page__title">
          {(() => {
            if (own) return "Your review";
            return "Public reviews";
          })()}
        </h1>
        <div className="reviews">
          {reviews.map((review) => (
            <MovieReviewCard
              key={review.vote_id || review.movie_id}
              review={review}
            />
          ))}
        </div>
      </>
    );
  };

  if (!show) return null;

  return <div className="page">{renderContent()}</div>;
}
