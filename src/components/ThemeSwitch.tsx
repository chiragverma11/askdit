"use client";
import { useEffect, useState } from "react";
import { Switch } from "./ui/Switch";
import { useTheme } from "next-themes";
import { useMounted } from "@/hooks/use-mounted";

const ThemeSwitch = () => {
  const [isDark, setIsDark] = useState(false);
  const { theme, setTheme } = useTheme();
  const mounted = useMounted();

  useEffect(() => {
    if (theme === "dark") {
      setIsDark(true);
    } else {
      setIsDark(false);
    }
  }, [theme]);

  if (!mounted) {
    return (
      <>
        <label
          htmlFor="themeSwitch"
          className="mr-4 inline-flex w-full items-center justify-between"
        >
          <span>Dark Mode</span>
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
  }

  return (
    <>
      <label
        htmlFor="themeSwitch"
        className="mr-4 inline-flex w-full items-center justify-between"
      >
        <span>Dark Mode</span>
        {theme ? (
          <span className="text-zinc-500">
            {/* &bull; */}
            {theme[0]?.toUpperCase() + theme.slice(1)}
          </span>
        ) : null}
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
