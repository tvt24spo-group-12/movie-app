const API_URL = process.env.REACT_APP_API_URL || "http://localhost:3001";

export async function getFavorites(authFetch) {
  const res = await authFetch(`${API_URL}/user/favoriteMovies`, {
    method: "GET",
  });

  if (!res.ok) throw new Error("Failed to load favorites");

  return res.json();
}

export async function getFavorite(movieId, authFetch) {
  const res = await authFetch(`${API_URL}/user/favoriteMovies/${movieId}`, {
    method: "GET",
  });

  if (!res.ok) throw new Error("Failed to load favorites");

  return res.json();
}

export async function addFavorite(movieId, authFetch) {
  const res = await authFetch(`${API_URL}/user/favoriteMovies/${movieId}`, {
    method: "POST",
  });

  if (!res.ok) throw new Error("Failed to add favorite");

  return res.json();
}

export async function removeFavorite(movieId, authFetch) {
  const res = await authFetch(`${API_URL}/user/favoriteMovies/${movieId}`, {
    method: "DELETE",
  });

  if (!res.ok) {
    const text = await res.text().catch(() => "");
    throw new Error(text || "Delete failed");
  }

  return res.json();
}

export async function handleFavorite(movieId, authFetch) {
  const result = await getFavorite(movieId, authFetch);

  if (Array.isArray(result) && result.length === 0) {
    await addFavorite(movieId, authFetch);
    return true;
  }

  await removeFavorite(movieId, authFetch);
  return false;
}

