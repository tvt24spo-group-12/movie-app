import { useAuth } from "../context/login";

const API_BASE_URL = process.env.REACT_APP_API_URL || "http://localhost:3001";

export default function useDeleteUser() {
  const { authFetch } = useAuth();

  const deleteUser = async (id) => {
    const res = await authFetch(`${API_BASE_URL}/user/delete/${id}`, {
      method: "DELETE",
    });

    if(!res.ok){
      throw new Error("Failed to delete user")
    }

    return res.json()
  };
  return deleteUser;
}
