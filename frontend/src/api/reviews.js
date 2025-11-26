const API_BASE_URL = process.env.REACT_APP_API_URL || "http://localhost:3001";

const TMDB_IMAGE_BASE = "https://image.tmdb.org/t/p/w500";

export async function searchUserReviews({ authFetch, user_id = -1 } = {}) {
  let res;
  let reqUrl;
  try {
    if (user_id === -1) {
      reqUrl = `${API_BASE_URL}/user/ratings`;
      res = await authFetch(reqUrl);
    } else {
      reqUrl = `${API_BASE_URL}/user/${user_id}/ratings`;
      res = await fetch(reqUrl);
    }
  } catch (networkError) {
    throw new Error(
      `Network error while fetching user reviews: ${networkError.message}`,
    );
  }

  if (res.status === 404) {
    return [];
  }

  if (res.status === 401) {
    throw new Error(
      "Unauthorized: Authentication token is invalid or missing.",
    );
  }

  if (!res.ok) {
    const message = await res.text();
    throw new Error(`Fetching user reviews failed: ${res.status} ${message}`);
  }
  const raw = await res.json();
  const rawReviews = Array.isArray(raw.ratings) ? raw.ratings : [];

  const transformedReviews = rawReviews.map((review) => {
    // Check if the poster_path exists and is not null/empty
    if (review.poster_path) {
      review.poster = `${TMDB_IMAGE_BASE}${review.poster_path}`;

      delete review.poster_path;
    } else {
      review.poster = "";
    }

    return review;
  });

  // Return the data with the new poster URL
  return transformedReviews;
}

export async function searchMovie({ authFetch, movie_id } = {}) {
  const isUserSpecific = !!authFetch;
  let reqUrl;
  let res;

  if (isUserSpecific) {
    reqUrl = `${API_BASE_URL}/movie/${movie_id}/rating`;
  } else {
    // If authFetch is NOT provided, we fetch all public ratings (plural endpoint)
    reqUrl = `${API_BASE_URL}/movie/${movie_id}/ratings`;
  }

  try {
    if (isUserSpecific) {
      // Use authFetch for the authenticated endpoint
      res = await authFetch(reqUrl);
    } else {
      // Use standard fetch for the public endpoint
      res = await fetch(reqUrl);
    }
  } catch (networkError) {
    throw new Error(
      `Network error while fetching movie reviews: ${networkError.message}`,
    );
  }

  if (res.status === 404) {
    return [];
  }

  if (res.status === 401) {
    throw new Error(
      "Unauthorized: Authentication required or token is invalid/expired.",
    );
  }

  if (!res.ok) {
    const message = await res.text();
    throw new Error(`Fetching movie reviews failed: ${res.status} ${message}`);
  }

  return await res.json();
}

export async function searchMovieReviews(movie_id) {
  let reqUrl = `${API_BASE_URL}/movie/${movie_id}/ratings`;
  let res;

  try {
    res = await fetch(reqUrl);
  } catch (networkError) {
    throw new Error(
      `Network error while fetching movie reviews: ${networkError.message}`,
    );
  }

  if (res.status === 404) {
    return [];
  }

  if (res.status === 401) {
    throw new Error(
      "Unauthorized: Authentication required or token is invalid/expired.",
    );
  }

  if (!res.ok) {
    const message = await res.text();
    throw new Error(`Fetching movie reviews failed: ${res.status} ${message}`);
  }

  return await res.json();
}

export async function postMovieRating({ authFetch, movie_id, data } = {}) {
  if (!authFetch) {
    throw new Error(
      "Authentication context is required to post a movie rating.",
    );
  }

  const reqUrl = `${API_BASE_URL}/movie/${movie_id}/rating`;

  const options = {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  };

  let res;
  try {
    res = await authFetch(reqUrl, options);
  } catch (networkError) {
    throw new Error(
      `Network error while posting movie rating: ${networkError.message}`,
    );
  }

  if (!res.ok) {
    const message = await res.text();
    if (res.status === 401) {
      throw new Error("Unauthorized: Invalid or expired token.");
    }
    if (res.status === 400) {
      throw new Error(`Validation failed (400): ${message}`);
    }
    throw new Error(`Posting movie rating failed: ${res.status} ${message}`);
  }

  return await res.json();
}

export async function deleteMovieRating({ authFetch, movie_id } = {}) {
  if (!authFetch) {
    throw new Error(
      "Authentication context is required to delete a movie rating.",
    );
  }

  const reqUrl = `${API_BASE_URL}/movie/${movie_id}/rating`;

  const options = {
    method: "DELETE",
  };

  let res;
  try {
    res = await authFetch(reqUrl, options);
  } catch (networkError) {
    throw new Error(
      `Network error while deleting movie rating: ${networkError.message}`,
    );
  }

  if (!res.ok) {
    const message = await res.text();
    if (res.status === 401) {
      throw new Error("Unauthorized: Invalid or expired token.");
    }
    if (res.status === 404) {
      throw new Error(`Movie rating not found or already deleted.`);
    }
    throw new Error(`Deleting movie rating failed: ${res.status} ${message}`);
  }

  return res.status === 204 ? true : await res.json();
}
