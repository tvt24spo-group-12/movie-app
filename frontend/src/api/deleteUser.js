const API_BASE_URL = process.env.REACT_APP_API_URL || "http://localhost:3001";

export default async function deleteUser(id) {
  try {
    const res = await fetch(API_BASE_URL+`/user/delete/${id}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
    });

    if (!res.ok) {
      throw new Error("Failed to delete user");
    }

    const data = await res.json();
    return data;
  } catch (err) {
    console.error(err);
    throw err;
  }
}