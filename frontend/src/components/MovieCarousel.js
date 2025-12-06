import { useEffect, useState, useRef } from "react";
import MovieCardMin from "./MovieCardMin";

export default function MovieCarousel({sidebar, caption, movies = [] }) {
  const [startIndex, setStartIndex] = useState(0);
  const [moviesPerPage, setMoviesPerPage] = useState(1);
  const [isTouchDevice, setIsTouchDevice] = useState(false);
  const containerRef = useRef(null);

  useEffect(() => {
    const mq = window.matchMedia("(pointer: coarse)");
    const onChange = () => setIsTouchDevice(!!mq.matches);
    onChange();
    mq.addEventListener?.("change", onChange);
    return () => mq.removeEventListener?.("change", onChange);
  }, []);

  useEffect(() => {
    const updateMoviesPerPage = () => {
      if (!containerRef.current) return;
      const containerWidth = containerRef.current.offsetWidth;
      const gap = 20;
      const cardWidth = 248;
      const perPage = Math.floor(containerWidth / (cardWidth + gap));
      setMoviesPerPage(perPage || 1);
      setStartIndex((s) =>
        Math.min(s, Math.max(0, (movies?.length || 0) - (perPage || 1))),
      );
    };
    updateMoviesPerPage();
    window.addEventListener("resize", updateMoviesPerPage);
    return () => window.removeEventListener("resize", updateMoviesPerPage);
  }, [movies?.length, sidebar]);

  const handleNext = () => {
    // On touch devices, use native scrolling; on desktop keep translate logic
    const el = containerRef.current;
    if (!el) return;

    const clientWidth = el.getBoundingClientRect().width;
    const firstChild = el.firstElementChild;
    const cardWidth = firstChild?.getBoundingClientRect().width || clientWidth;
    const visibleItems = Math.max(1, Math.floor(clientWidth / cardWidth));
    const scrollLeft = el.scrollLeft || 0;

    if (isTouchDevice) {
      const maxLeft = Math.max(0, el.scrollWidth - clientWidth);
      const scrollOffset = scrollLeft % cardWidth;
      const newLeft = Math.min(
        scrollLeft - scrollOffset + visibleItems * cardWidth,
        maxLeft,
      );
      el.scrollTo({ left: newLeft, behavior: "smooth" });
      return;
    }

    if (startIndex + moviesPerPage < (movies?.length || 0)) {
      setStartIndex((prev) =>
        Math.min(
          prev + moviesPerPage,
          Math.max(0, (movies?.length || 0) - moviesPerPage),
        ),
      );
    }
  };

  const handlePrev = () => {
    const el = containerRef.current;
    if (!el) return;

    const clientWidth = el.getBoundingClientRect().width;
    const firstChild = el.firstElementChild;
    const cardWidth = firstChild?.getBoundingClientRect().width || clientWidth;
    const visibleItems = Math.max(1, Math.floor(clientWidth / cardWidth));
    const scrollLeft = el.scrollLeft || 0;

    if (isTouchDevice) {
      const scrollOffset = scrollLeft % cardWidth;
      const newLeft = Math.max(
        scrollLeft - scrollOffset - visibleItems * cardWidth,
        0,
      );
      el.scrollTo({ left: newLeft, behavior: "smooth" });
      return;
    }

    if (startIndex > 0) {
      setStartIndex((prev) => Math.max(prev - moviesPerPage, 0));
    }
  };

  const slideDistance = 248 + 20; // card width + gap

  return (
    <>
      <div className="carousel-header">
        <h1 className={sidebar === true ? "nowPlayingh1": "nowPlayingh1Closed"}>{caption}</h1>

        {!isTouchDevice && (
          <div className="movie-nav">
            <button onClick={handlePrev} disabled={startIndex === 0}>
              &lt;
            </button>
            <button
              onClick={handleNext}
              disabled={startIndex + moviesPerPage >= (movies?.length || 0)}
            >
              &gt;
            </button>
          </div>
        )}
      </div>
      <article
        className={sidebar === true ? `movieContainer ${isTouchDevice ? "mobile-scroll" : ""}` 
                                    :  `movieContainerClosed ${isTouchDevice ? "mobile-scroll" : ""}`}
        ref={containerRef}
      >
        <div
          className="movie-slider"
          style={
            isTouchDevice
              ? { transform: "none" }
              : { transform: `translateX(-${startIndex * slideDistance}px)` }
          }
        >
          {movies.map((movie) => (
            <MovieCardMin key={movie.id} movie={movie} />
          ))}
        </div>
      </article>
    </>
  );
}
