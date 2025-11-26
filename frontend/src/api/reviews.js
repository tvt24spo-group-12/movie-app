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

  // Return the data with the new 'poster' URL
  return transformedReviews;
}

export async function searchMovieReviews(movie_id, auth_token) {
  const options = {};
  let reqUrl;

  // If a token is provided, fetch the user's specific rating
  if (auth_token) {
    reqUrl = `${API_BASE_URL}/movie/${movie_id}/rating`;
    options.headers = {
      Authorization: `Bearer ${auth_token}`,
    };
  } else {
    // If no token, fetch all public ratings
    reqUrl = `${API_BASE_URL}/movie/${movie_id}/ratings`;
  }

  let res;
  try {
    res = await fetch(reqUrl, options);
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
      "Unauthorized: Authentication token is invalid or expired.",
    );
  }

  if (!res.ok) {
    const message = await res.text();
    throw new Error(`Fetching movie reviews failed: ${res.status} ${message}`);
  }

  return await res.json();
}

export async function postMovieRating(movie_id, auth_token, data) {
  if (!auth_token) {
    throw new Error("Authentication token is required to post a movie rating.");
  }

  const reqUrl = `${API_BASE_URL}/movie/${movie_id}/rating`;

  const options = {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${auth_token}`,
    },
    body: JSON.stringify(data),
  };

  let res;
  try {
    res = await fetch(reqUrl, options);
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

  // Return the created/updated resource
  return await res.json();
}

export async function deleteMovieRating(movie_id, auth_token) {
  if (!auth_token) {
    throw new Error(
      "Authentication token is required to delete a movie rating.",
    );
  }

  const reqUrl = `${API_BASE_URL}/movie/${movie_id}/rating`;

  const options = {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${auth_token}`,
    },
  };

  let res;
  try {
    res = await fetch(reqUrl, options);
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

  // Return true for success, or check for 204 No Content if needed
  return res.status === 204 ? true : await res.json();
}
