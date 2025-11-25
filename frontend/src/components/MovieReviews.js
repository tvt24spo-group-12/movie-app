import { useEffect, useState } from "react";
import SearchBar from "./SearchBar";

export default function MovieReviews() {
  const [query, setQuery] = useState("");
  const [movies, setMovies] = useState([]);
  const [status, setStatus] = useState("idle"); // idle | loading | success | error
  const [error, setError] = useState("");
  const [isFiltersOpen, setIsFiltersOpen] = useState(false);

  return (
    <div className="reviewWrapper">
      <div className="">
        <div className="group-view">
          <h2>Reviews</h2>
        </div>

        <div className="group-list">
          <p>Group list</p>
        </div>
      </div>
    </div>
  );
}
