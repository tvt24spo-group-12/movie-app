import { useEffect, useState } from "react";
import { useAuth } from "../../context/login";
import ReviewCard from "./ReviewCard";
import { searchUserReviews } from "../../api/reviews";
import { getUserInfo } from "../../api/user";

export default function UserMovieReviews({ user_id }) {
  const { user, authFetch } = useAuth();
  const [reviews, setReviews] = useState([]);
  const [reviewUser, setReviewUser] = useState({});
  const [status, setStatus] = useState("idle"); // idle | loading | success | error
  const [error, setError] = useState("");
  const id = user?.id;

  useEffect(() => {
    async function fetchReviews() {
      setStatus("loading");
      setError("");

      try {
        let data;

        if (id === user_id) {
          data = await searchUserReviews({ authFetch, user_id: -1 });
        } else {
          data = await searchUserReviews({ authFetch, user_id });
        }
        setReviews(data);
        const userData = await getUserInfo(user_id);
        setReviewUser(userData);
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
          <ReviewCard key={review.id || review.movie_id} review={review} />
        ))}
      </div>
    );
  };

  return (
    <div className="page">
      <h1 className="page__title">
        {user_id === -1 || user_id == id
          ? "Your reviews"
          : `${reviewUser?.username ?? "User"}'s reviews`}
      </h1>

      {renderContent()}
    </div>
  );
}
