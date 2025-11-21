const url = "http://localhost:3001/user";
import { createContext, useContext, useState, useEffect } from "react";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [accessToken, setAccessToken] = useState(null);
  //  const [loading, setLoading] = useState(true)
  /*
  useEffect(()=>{ //näkee tallentuiko muutokset ja (setUser & setAccessToken)
    console.log("use: ",accessToken)
    console.log("user: ",user)

  },[accessToken,user])

  */

  const signIn = async (Identifier, Password) => {
    const res = await fetch(url + "/signin", {
      method: "POST",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        user: { identifier: Identifier, password: Password },
      }),
    });

    if (!res.ok) {
      const error = await res.json();
      throw new Error(error.error);
    }
    const data = await res.json();
    if (data.user) {
      setUser({
        id: data.user.id,
        email: data.user.email,
        username: data.user.username,
      });
    }

    setAccessToken(data.token);

    return data;
  };

  const logout = async () => {
    await fetch(`${process.env.REACT_APP_API_URL}/user/logout`, {
      method: "POST",
      credentials: "include",
    });

    setUser(null);
    setAccessToken(null);
  };

  const refreshAccessToken = async () => {
    const res = await fetch(url + "/refresh", {
      method: "POST",
      credentials: "include",
    });

    if (!res.ok) {
      throw new Error("Could not refresh token");
    }

    const data = await res.json();

    setAccessToken(data.accessToken);

    if (data.user) {
      setUser({
        id: data.user.id,
        email: data.user.email,
        username: data.user.username,
      });
    }

    return data.accessToken;
  };

  const authFetch = async (url, options = {}) => {
    const res = await fetch(url, {
      ...options,
      headers: {
        ...(options.headers || {}),
        Authorization: accessToken ? `Bearer ${accessToken}` : "",
      },
      credentials: "include",
    });

    if (res.status === 401 || res.status === 403) {
      try {
        await refreshAccessToken();

        const resRetry = await fetch(url, {
          ...options,
          headers: {
            ...(options.headers || {}),
            Authorization: accessToken ? `Bearer ${accessToken}` : "",
          },
          credentials: "include",
        });

        return resRetry;
      } catch (err) {
        logout();
        throw new Error("Session expired");
      }
    }
    return res;
  };

  useEffect(() => {
    const tryRefresh = async () => {
      try {
        await refreshAccessToken();
        console.log("Access token restored");
      } catch (err) {
        console.log("No valid refresh token");
      }
    };

    tryRefresh();
  }, []);

  const value = {
    user,
    accessToken,
    signIn,
    logout,
    refreshAccessToken,
    authFetch,
  };
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
export function useAuth() {
  return useContext(AuthContext);
}
