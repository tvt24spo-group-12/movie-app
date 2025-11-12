import { useEffect, useMemo, useState } from "react";
import SearchBar from "./SearchBar";
import MovieCard from "./MovieCard";
import { searchMovies } from "../api/movies";

function MovieList() {
    const [query, setQuery] = useState("");
    const [movies, setMovies] = useState([]);
    const [status, setStatus] = useState("idle"); // idle | loading | success | error
    const [error, setError] = useState("");

    useEffect(() => {
        const controller = new AbortController();
    
        async function fetchMovies() {
          const trimmed = query.trim();
          if (!trimmed) {
            setMovies([]);
            setStatus("idle");
            setError("");
            return;
          }
    
          try {
            setStatus("loading");
            setError("");
            const results = await searchMovies(trimmed);
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
    }, [query]);

    const results = useMemo(() => movies ?? [], [movies]);

    return (
        <div className="page">
            <h1 className="page__title">Movie Search</h1>
            <SearchBar value={query} onChange={setQuery} />

            <section className="results" aria-live="polite">
            {status === "idle" && <p className="results__hint">Start typing to search TMDb.</p>}
            {status === "loading" && <p className="results__hint">Searching…</p>}
            {status === "error" && <p className="results__error">{error}</p>}
            {status === "success" && results.length === 0 && (
                <p className="results__empty">No movies found for “{query}”.</p>
            )}
            {status === "success" &&
                results.map((movie) => <MovieCard key={movie.id} movie={movie} />)}
            </section>
        </div>
    );
}

export default MovieList;