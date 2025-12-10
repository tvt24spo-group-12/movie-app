import { useEffect, useMemo, useState } from "react";
import SearchBar from "./SearchBar";
import MovieCard from "./MovieCard";
import { searchMovies } from "../api/movies";
import { useAuth } from "../context/login";
import { addFavorite } from "../api/favorites";


function MovieList() {
    const [query, setQuery] = useState("");
    const [movies, setMovies] = useState([]);
    const [status, setStatus] = useState("idle"); // idle | loading | success | error
    const [error, setError] = useState("");
    const [isFiltersOpen, setIsFiltersOpen] = useState(false);
    const { authFetch, user } = useAuth();

    const debouncedQuery = useDebounce(query, 300);

function useDebounce(value, delay) {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    setStatus("loading") // set loading status at this point, so the website still feels responsive
    const timer = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);
    
    return () => {
      clearTimeout(timer);
    };
  }, [value, delay]);
  
  return debouncedValue;
}

const handleAddFavorite = async (id) => {
  if (!user) {
    alert("Kirjaudu sisään lisätäksesi suosikkeihin");
    return;
  }

  try {
    await addFavorite(id, authFetch);
    alert("Lisätty suosikkeihin");
  } catch {
    alert("Ei voitu lisätä");
  }
};
    
    // Filter
    const [filters, setFilters] = useState({
        genre: "",
        year: "",
        min_rating: "",
        sort: "rating",
        order: "desc",
    });

    useEffect(() => {
        const controller = new AbortController();
    
        async function fetchMovies() {
          const trimmed = debouncedQuery.trim();
          
          // Tarkista onko yhtään filtteriä asetettu
          const hasFilters = Object.entries(filters)
            .filter(([k]) => !["sort", "order"].includes(k))
            .some(([, v]) => v !== "");
          
          if (!trimmed && !hasFilters) {
            setMovies([]);
            setStatus("idle");
            setError("");
            return;
          }
    
          try {
            setStatus("loading");
            setError("");
            const results = await searchMovies(trimmed, filters);
            setMovies(results);
            setStatus("success");
          } catch (err) {
            if (controller.signal.aborted) return;
            setError(err.message);
            setStatus("error");
          }
        }
    
        fetchMovies();
    
        return () => controller.abort();
    }, [debouncedQuery, filters]);

    const results = useMemo(() => movies ?? [], [movies]);

    const handleFilterChange = (field, value) => {
        setFilters(prev => ({ ...prev, [field]: value }));
    };

    const resetFilters = () => {
        setFilters({
            genre: "",
            year: "",
            min_rating: "",
            sort: "rating",
            order: "desc",
        });
    };

    return (
        <div className="page">
            <h1 className="page__title">Movie Search</h1>
            <SearchBar value={query} onChange={setQuery} placeholder="Search for movies" />

            <div className="filters">
                <button 
                    className="filters__toggle"
                    onClick={() => setIsFiltersOpen(!isFiltersOpen)}
                    aria-expanded={isFiltersOpen}
                >
                    <span>Advanced Filters</span>
                    <span className={`filters__toggle-icon ${isFiltersOpen ? 'open' : ''}`}>▼</span>
                </button>
                
                {isFiltersOpen && (
                    <div className="filters__content">
                        <div className="filters__grid">
                            <div className="filter-group">
                                <label htmlFor="genre">Genre:</label>
                                <input
                                    id="genre"
                                    type="text"
                                    placeholder="e.g., Action, Drama"
                                    value={filters.genre}
                                    onChange={(e) => handleFilterChange("genre", e.target.value)}
                                />
                            </div>

                            <div className="filter-group">
                                <label htmlFor="year">Year:</label>
                                <input
                                    id="year"
                                    type="number"
                                    placeholder="e.g., 2024"
                                    value={filters.year}
                                    onChange={(e) => handleFilterChange("year", e.target.value)}
                                />
                            </div>

                            <div className="filter-group">
                                <label htmlFor="min_rating">Min Rating:</label>
                                <input
                                    id="min_rating"
                                    type="number"
                                    min="0"
                                    max="10"
                                    step="0.1"
                                    placeholder="0-10"
                                    value={filters.min_rating}
                                    onChange={(e) => handleFilterChange("min_rating", e.target.value)}
                                />
                            </div>

                            <div className="filter-group">
                                <label htmlFor="sort">Sort By:</label>
                                <select
                                    id="sort"
                                    value={filters.sort}
                                    onChange={(e) => handleFilterChange("sort", e.target.value)}
                                >
                                    <option value="rating">Rating</option>
                                    <option value="release_date">Release Date</option>
                                    <option value="title">Title</option>
                                </select>
                            </div>

                            <div className="filter-group">
                                <label htmlFor="order">Order:</label>
                                <select
                                    id="order"
                                    value={filters.order}
                                    onChange={(e) => handleFilterChange("order", e.target.value)}
                                >
                                    <option value="desc">Descending</option>
                                    <option value="asc">Ascending</option>
                                </select>
                            </div>
                        </div>

                        <button onClick={resetFilters} className="filters__reset">
                            Reset Filters
                        </button>
                    </div>
                )}
            </div>

            <section className="results" aria-live="polite">
            {status === "idle" && <p className="results__hint">Start typing to search or use filters to discover movies.</p>}
            {status === "loading" && <p className="results__hint">Searching…</p>}
            {status === "error" && <p className="results__error">{error}</p>}
            {status === "success" && results.length === 0 && (
                <p className="results__empty">No movies found{query ? ` for "${query}"` : " with the selected filters"}.</p>
            )}
       {status === "success" &&
          results.map((movie) => (
            <MovieCard
              key={movie.id}
              movie={movie}
              onAddFavorite={handleAddFavorite}
            />
          ))}
      </section>
    </div>
  );
}
export default MovieList;
