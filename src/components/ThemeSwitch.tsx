"use client";
import { useEffect, useState } from "react";
import { Switch } from "./ui/Switch";
import { useTheme } from "next-themes";

const ThemeSwitch = () => {
  const [mounted, setMounted] = useState(false);
  const [isDark, setIsDark] = useState(false);
  const { theme, setTheme } = useTheme();

  // useEffect only runs on the client, so now we can safely show the UI
  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (theme === "dark") {
      setIsDark(true);
    } else {
      setIsDark(false);
    }
  }, [theme]);

  if (!mounted) {
    return null;
  }

  return (
    <>
      <label htmlFor="themeSwitch" className="w-full">
        Dark Mode
      </label>
      <Switch
        name="themeSwitch"
        id="themeSwitch"
        checked={isDark}
        onCheckedChange={() => {
          setTheme(isDark === true ? "light" : "dark");
        }}
      />
    </>
  );
};

export default ThemeSwitch;
