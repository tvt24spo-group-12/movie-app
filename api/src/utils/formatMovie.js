export function formatMovie(data) {
  return {
    movie_id: data.id,
    name: data.title,
    original_title: data.original_title,
    overview: data.overview,
    release_date: data.release_date,
    runtime: data.runtime,
    genres: (data.genres || []).map((g) => g.name),
    vote_average: data.vote_average,
    vote_count: data.vote_count,
    budget: data.budget,
    original_language: data.original_language,
    director: data.credits && data.credits.crew
      ? data.credits.crew.find((member) => member.job === "Director")?.name || "N/A"
      : "N/A",
    top_cast: data.credits && data.credits.cast
      ? data.credits.cast.slice(0, 4).map((member) => member.name)
      : [],
    distributor: data.production_companies && data.production_companies.length
      ? data.production_companies[0].name
      : "N/A",
      
    moviePicture: data.poster_path
      ? `https://image.tmdb.org/t/p/w500${data.poster_path}`
      : null,
    backdrop_path: data.backdrop_path
      ? `https://image.tmdb.org/t/p/original${data.backdrop_path}`
      : null,
    raw: data,
  };
}

