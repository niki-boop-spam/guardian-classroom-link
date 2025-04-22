
import * as React from "react";
import { Sun, Moon } from "lucide-react";

const THEME_KEY = "theme";
const LIGHT = "light";
const DARK = "dark";
const getSystemTheme = () =>
  window.matchMedia("(prefers-color-scheme: dark)").matches ? DARK : LIGHT;

function applyTheme(theme: string) {
  const root = document.documentElement;
  if (theme === DARK) {
    root.classList.add(DARK);
  } else {
    root.classList.remove(DARK);
  }
}

export function ThemeToggle() {
  const [theme, setTheme] = React.useState<string>(() => {
    if (typeof window !== "undefined") {
      return localStorage.getItem(THEME_KEY) || getSystemTheme();
    }
    return LIGHT;
  });

  React.useEffect(() => {
    applyTheme(theme);
    localStorage.setItem(THEME_KEY, theme);
  }, [theme]);

  // Listen for OS theme changes, update if user didn't set manual override
  React.useEffect(() => {
    const mq = window.matchMedia("(prefers-color-scheme: dark)");
    const handleChange = () => {
      if (!localStorage.getItem(THEME_KEY)) {
        setTheme(getSystemTheme());
      }
    };
    mq.addEventListener("change", handleChange);
    return () => mq.removeEventListener("change", handleChange);
  }, []);

  const toggleTheme = () => {
    setTheme((prev) => (prev === LIGHT ? DARK : LIGHT));
  };

  const Icon = theme === DARK ? Sun : Moon;

  return (
    <button
      type="button"
      onClick={toggleTheme}
      aria-label={`Switch to ${theme === DARK ? "light" : "dark"} mode`}
      className="rounded-full p-2 transition-colors hover:bg-accent1 focus:outline-none"
    >
      <Icon className="w-5 h-5 text-primary" />
    </button>
  );
}

