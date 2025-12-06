import { useEffect, useState } from "react";
import { useAuth } from "../../context/login";
import ReviewCard from "./ReviewCard";
import SearchBar from "../SearchBar";
import { searchUserReviews } from "../../api/reviews";
import { getUserInfo } from "../../api/user";

export default function UserMovieReviews({ user_id }) {
  const [query, setQuery] = useState("");
  const { user, authFetch } = useAuth();
  const [reviews, setReviews] = useState([]);
  const [activeReviews, setActiveReviews] = useState([]);
  const [reviewUser, setReviewUser] = useState({});
  const [status, setStatus] = useState("idle"); // idle | loading | success | error
  const [error, setError] = useState("");
  const id = user?.id;

  function normalize(str) {
    return str
      .normalize("NFD")
      .replace(/\p{Diacritic}/gu, "")
      .toLowerCase();
  }

  useEffect(() => {
    async function fetchReviews() {
      setStatus("loading");
      setError("");

      try {
        let data;
        console.log(user_id);

        if (id === user_id || user_id == -1 || user_id == "") {
          data = await searchUserReviews({ authFetch, user_id: -1 });
        } else {
          data = await searchUserReviews({ authFetch, user_id });
        }
        setReviews(data);
        if (user_id != "" && user_id != -1) {
          const userData = await getUserInfo(user_id);
          setReviewUser(userData);
        }
        setStatus("success");
      } catch (err) {
        console.error("Failed to fetch user reviews:", err);
        setError(err.message || "Failed to load reviews. Please try again.");
        setStatus("error");
      }
    }

    fetchReviews();
  }, [user_id]);

  useEffect(() => {
    const controller = new AbortController();

    function reviewToString(obj) {
      if (obj == null) return "";
      if (["string", "number", "boolean"].includes(typeof obj))
        return String(obj);
      if (Array.isArray(obj)) return obj.map(reviewToString).join(" ");
      if (typeof obj === "object")
        return Object.values(obj).map(reviewToString).join(" ");
      return "";
    }

    function filterReviews() {
      const trimmed = query.trim();
      if (!trimmed) {
        setActiveReviews(reviews);
        return;
      }

      const terms = normalize(trimmed).split(/\s+/).filter(Boolean);

      const filtered = reviews.filter((review) => {
        const haystack = normalize(reviewToString(review));
        return terms.every((t) => haystack.includes(t));
      });

      if (!controller.signal.aborted) setActiveReviews(filtered);
    }

    filterReviews();

    return () => controller.abort();
  }, [query, reviews]);

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
        {activeReviews.map((review) => (
          <ReviewCard key={review.id || review.movie_id} review={review} />
        ))}
      </div>
    );
  };

  return (
    <div className="page">
      <h1 className="page__title">
        {user_id === -1 || user_id == "" || user_id == id
          ? "Your reviews"
          : `${reviewUser?.username ?? "User"}'s reviews`}
      </h1>
      {(user_id === -1 || user_id !== "" || user_id == id) && (
        <SearchBar value={query} onChange={setQuery} />
      )}

      {renderContent()}
    </div>
  );
}
