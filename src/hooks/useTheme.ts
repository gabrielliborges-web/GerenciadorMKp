import { useEffect, useState } from "react";
import { updateUserTheme } from "../lib/users";
import { useAuth } from "../context/AuthContext";

export function useTheme() {
  const { user, setUser } = useAuth();

  const [isDark, setIsDark] = useState<boolean>(() => {
    // Prioridade: 1) Tema do usuário, 2) LocalStorage, 3) Dark como padrão
    if (user?.theme) return user?.theme === "DARK";

    const savedTheme = localStorage.getItem("theme");
    if (savedTheme) return savedTheme === "dark";

    // Dark é o tema padrão
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
    const root = document.documentElement;
    if (user?.theme) {
      const isDarkTheme = user.theme === "DARK";
      if (isDarkTheme) {
        root.classList.add("dark");
        localStorage.setItem("theme", "dark");
      } else {
        root.classList.remove("dark");
        localStorage.setItem("theme", "light");
      }
    } else {
      const savedTheme = localStorage.getItem("theme");
      const theme = savedTheme === "light" ? "light" : "dark";
      if (theme === "dark") {
        root.classList.add("dark");
        localStorage.setItem("theme", "dark");
      } else {
        root.classList.remove("dark");
        localStorage.setItem("theme", "light");
      }
    }
  }, [user?.theme]);

  useEffect(() => {
    if (user?.theme) setIsDark(user.theme === "DARK");
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
