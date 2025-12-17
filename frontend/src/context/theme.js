import { createContext, useContext, useEffect, useMemo, useState } from "react";

const ThemeContext = createContext(null);

export function ThemeProvider({ children }) {
  const prefersDarkQuery = useMemo(() => {
    if (typeof window === "undefined" || !window.matchMedia) return null;
    return window.matchMedia("(prefers-color-scheme: dark)");
  }, []);

  const stored = useMemo(() => {
    if (typeof window === "undefined") return null;
    const value = localStorage.getItem("theme-preference");
    return value === "dark" || value === "light" ? value : null;
  }, []);

  const [manual, setManual] = useState(() => Boolean(stored));
  const [theme, setTheme] = useState(() => {
    if (stored) return stored;
    if (prefersDarkQuery && prefersDarkQuery.matches) return "dark";
    return "light";
  });

  useEffect(() => {
    const applied = theme === "dark" ? "dark" : "light";
    document.documentElement.dataset.theme = applied;

    if (manual) {
      localStorage.setItem("theme-preference", applied);
    } else {
      localStorage.removeItem("theme-preference");
    }
  }, [theme, manual]);

  useEffect(() => {
    if (!prefersDarkQuery) return undefined;
    const handleChange = (e) => {
      if (!manual) {
        setTheme(e.matches ? "dark" : "light");
      }
    };

    prefersDarkQuery.addEventListener("change", handleChange);
    return () => prefersDarkQuery.removeEventListener("change", handleChange);
  }, [prefersDarkQuery, manual]);

  const toggleTheme = () => {
    setManual(true);
    setTheme((prev) => (prev === "dark" ? "light" : "dark"));
  };

  const forceTheme = (value) => {
    if (value !== "dark" && value !== "light") return;
    setManual(true);
    setTheme(value);
  };

  const value = {
    theme,
    toggleTheme,
    setTheme: forceTheme,
  };

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}

export function useTheme() {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error("useTheme must be used within ThemeProvider");
  return ctx;
}
