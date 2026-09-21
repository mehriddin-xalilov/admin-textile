import { useEffect, useState } from "react";
import { useStore } from "../services";

type Theme = "light" | "dark";

export const useResolvedTheme = (): Theme => {
  const theme = useStore((state) => state.theme);
  const [resolvedTheme, setResolvedTheme] = useState<Theme>(() => {
    if (theme === "system") {
      return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
    }
    return theme === "dark" ? "dark" : "light";
  });

  useEffect(() => {
    if (theme !== "system") {
      setResolvedTheme(theme === "dark" ? "dark" : "light");
      return;
    }

    const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
    const handleChange = (e: MediaQueryListEvent) => {
      setResolvedTheme(e.matches ? "dark" : "light");
    };

    // Initial check
    setResolvedTheme(mediaQuery.matches ? "dark" : "light");

    mediaQuery.addEventListener("change", handleChange);
    return () => mediaQuery.removeEventListener("change", handleChange);
  }, [theme]);

  return resolvedTheme;
};

export default useResolvedTheme;
