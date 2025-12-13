import { useEffect, useState } from "react";
import { updateUserTheme } from "../lib/users";
import { useAuth } from "../context/AuthContext";

export function useTheme() {
  const { user, setUser } = useAuth();

  const [isDark, setIsDark] = useState<boolean>(() => {
    const savedTheme = localStorage.getItem("theme");
    if (savedTheme) return savedTheme === "dark";
    
    if (user?.theme) return user.theme === "DARK";

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
    if (!user?.theme) return;
    
    const userThemeIsDark = user.theme === "DARK";
    const currentTheme = localStorage.getItem("theme") === "dark";
    
    if (userThemeIsDark !== currentTheme) {
      setIsDark(userThemeIsDark);
    }
  }, [user?.theme]);

  const toggleTheme = async () => {
    const newTheme = isDark ? "LIGHT" : "DARK";
    setIsDark((prev) => !prev);

    try {
      await updateUserTheme(newTheme);

      setUser((prev) => {
        if (!prev) return prev;
        const updated = { ...prev, theme: newTheme };
        localStorage.setItem("usuario", JSON.stringify(updated));
        return updated;
      });
    } catch (error: any) {
      console.error(`Erro ao atualizar tema: ${error.message}`);
    }
  };

  return { isDark, toggleTheme };
}
