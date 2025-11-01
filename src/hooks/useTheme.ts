import { useEffect, useState } from "react";
import { updateUserTheme } from "../lib/users";
import { useAuth } from "../context/AuthContext";

export function useTheme() {
  const { user, setUser } = useAuth();

  const [isDark, setIsDark] = useState<boolean>(() => {
    if (user?.theme) return user?.theme === "DARK";

    const savedTheme = localStorage.getItem("theme");
    if (savedTheme) return savedTheme === "dark";

    return true;
  });

  useEffect(() => {
    const root = document.documentElement;

    if (isDark) {
      root.classList.add("dark");
      localStorage.setItem("theme", "dark");
    } else {
      root.classList.remove("dark");
      localStorage.setItem("theme", "light");
    }
  }, [isDark]);

  useEffect(() => {
    if (user?.theme) setIsDark(user?.theme === "DARK");
  }, [user?.theme]);

  const toggleTheme = async () => {
    const newTheme = isDark ? "LIGHT" : "DARK";
    setIsDark((prev) => !prev);

    try {
      await updateUserTheme(newTheme);

      setUser((prev) => (prev ? { ...prev, theme: newTheme } : prev));

      const storedUser = localStorage.getItem("user");
      if (storedUser) {
        const parsed = JSON.parse(storedUser);
        localStorage.setItem(
          "user",
          JSON.stringify({ ...parsed, theme: newTheme })
        );
      }
    } catch (error: any) {
      console.error(`Erro ao atualizar tema: ${error.message}`);
    }
  };

  return { isDark, toggleTheme };
}
