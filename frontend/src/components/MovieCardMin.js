// näytä elokuva-kartta posterin, metatietojen ja äänen tiedon perusteella
function MovieCardMin({ movie }) {
  const { title, poster, rating, releaseYear, runtime, id } = movie;

  return (
    <article className="movie-card-min">
      <div className="movie-card__poster">
        {poster ? (
          <img src={poster} alt={`${title} poster`} />
        ) : (
          // placeholder, kun ei ole posteriä
          <div className="movie-card__poster-placeholder">
            <span>No poster</span>
          </div>
        )}
      </div>

      <div className="movie-card__content">
        <div className="movie-card__meta">
          {releaseYear && <span>{releaseYear} | </span>}
          {runtime && <span>{runtime} min | </span>}
          {rating != null && <span>⭐ {Number(rating).toFixed(1)}</span>}
        </div>

        <h3 className="movie-card__title">
          <a href={`/movie/${id}`}>{title}</a>
        </h3>
      </div>
    </article>
  );
}

export default MovieCardMin;
