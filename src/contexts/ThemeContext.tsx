import { createContext, type ReactNode, useEffect, useState } from "react";

interface ITheme {
  theme: "light" | "dark";
  toggleTheme: () => void;
}

type Theme = "light" | "dark";
const ThemeContext = createContext<ITheme | null>(null);

export const ThemeProvider = ({ children }: { children?: ReactNode }) => {
  const selectedTheme: string | null = localStorage.getItem("theme");
  const [theme, setTheme] = useState<"light" | "dark">(
    (selectedTheme as Theme) || "light"
  );

  useEffect(() => {
    if (selectedTheme) {
      document.body.classList.add(selectedTheme);
      setTheme(selectedTheme as "light" | "dark");
    } else if (window.matchMedia("(prefers-color-scheme: dark)").matches) {
      document.body.classList.add("dark");
      setTheme("dark");
      localStorage.setItem("theme", "dark");
    } else {
      document.body.classList.add("light");
      setTheme("light");
      localStorage.setItem("theme", "light");
    }
  }, [selectedTheme]);

  const toggleTheme = () => {
    setTheme((prevTheme) => {
      if (prevTheme === "dark") {
        localStorage.setItem("theme", "light");
        document.body.classList.remove("dark");
        document.body.classList.add("light");
        return "light";
      } else {
        localStorage.setItem("theme", "dark");
        document.body.classList.remove("light");
        document.body.classList.add("dark");
        return "dark";
      }
    });
  };

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

export default ThemeContext;