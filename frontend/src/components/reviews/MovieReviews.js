import { useEffect, useState } from "react";
import { useAuth } from "../../context/login";
import MovieReviewCard from "./MovieReviewCard";
import { searchMovieReviews } from "../../api/reviews";

export default function MovieReviews({ movie_id }) {
  const { authFetch } = useAuth();
  const [reviews, setReviews] = useState([]);
  const [status, setStatus] = useState("idle"); // idle | loading | success | error
  const [error, setError] = useState("");

  useEffect(() => {
    async function fetchReviews() {
      setStatus("loading");
      setError("");

      try {
        const data = await searchMovieReviews(movie_id);
        setReviews(data.ratings);
        setStatus("success");
      } catch (err) {
        console.error("Failed to fetch user reviews:", err);
        setError(err.message || "Failed to load reviews. Please try again.");
        setStatus("error");
      }
    }

    fetchReviews();
  }, []);

  const renderContent = () => {
    if (status === "loading") {
      return <p>Loading your movie reviews...</p>;
    }

    if (status === "error") {
      return <p className="error-message">Error: {error}</p>;
    }

    if (reviews.length === 0) {
      return <p>You haven't posted any reviews yet.</p>;
    }

    // Success: Map over reviews and render ReviewCard for each
    return (
      <div className="reviews">
        {reviews.map((review) => (
          <MovieReviewCard
            key={review.vote_id || review.movie_id}
            review={review}
          />
        ))}
      </div>
    );
  };

  return <div className="page">{renderContent()}</div>;
}
