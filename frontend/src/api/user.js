const API_BASE_URL = process.env.REACT_APP_API_URL || "http://localhost:3001";

export async function getUserInfo(user_id) {
  const url = `${API_BASE_URL}/user/${user_id}`;
  let res;

  try {
    res = await fetch(url);
  } catch (networkError) {
    throw new Error(
      `Network error while fetching user info: ${networkError.message}`,
    );
  }

  if (res.status === 404) return null;

  if (!res.ok) {
    const msg = await res.text();
    throw new Error(`Fetching user info failed: ${res.status} ${msg}`);
  }

  return await res.json();
}
