import { useEffect, useState } from "react";
import { useAuth } from "../../context/login";
import MovieReviewCard from "./MovieReviewCard";
import SearchBar from "../SearchBar";
import { searchMovieReviews, searchMovie } from "../../api/reviews";

export default function MovieReviews({ movie_id, own = false }) {
  const [query, setQuery] = useState("");
  const { user, authFetch } = useAuth();
  const [reviews, setReviews] = useState([]);
  const [activeReviews, setActiveReviews] = useState([]);
  const [status, setStatus] = useState("idle"); // idle | loading | success | error
  const [error, setError] = useState("");
  const [show, setShow] = useState(true);

  function normalize(str) {
    return str
      .normalize("NFD")
      .replace(/\p{Diacritic}/gu, "")
      .toLowerCase();
  }

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
      return <p className="reviews-loading">Loading reviews...</p>;
    }

    if (status === "error") {
      return <p className="error-message">Error: {error}</p>;
    }

    if (reviews.length === 0 && own) {
      return <p className="reviews-empty">You haven't posted any reviews yet.</p>;
    }

    if (reviews.length === 0 && !own) {
      return <p className="reviews-empty">There aren't any public reviews yet.</p>;
    }

    // Success: Map over reviews and render ReviewCard for each
    return (
      <>
        <h2 className="reviews-title">
          {(() => {
            if (own) return "Your review";
            return "Public reviews";
          })()}
        </h2>

        {!own && (
          <SearchBar
            value={query}
            onChange={setQuery}
            placeholder="Search reviews"
          />
        )}
        <div className="reviews">
          {activeReviews.map((review) => (
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

  return <section className="reviews-section">{renderContent()}</section>;
}
