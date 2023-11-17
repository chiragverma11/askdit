"use client";

import { useTheme } from "next-themes";
import { Switch } from "./ui/Switch";

const ThemeSwitch = () => {
  const { theme, setTheme } = useTheme();

  return (
    <>
      <label
        htmlFor="themeSwitch"
        className="mr-4 inline-flex w-full items-center justify-between"
      >
        <span>Theme</span>
        {theme ? (
          <span className="text-zinc-500">
            {theme[0]?.toUpperCase() + theme.slice(1)}
          </span>
        ) : null}
      </label>
      <Switch
        name="themeSwitch"
        id="themeSwitch"
        checked={theme === "dark"}
        onCheckedChange={() => {
          setTheme(theme === "light" ? "dark" : "light");
        }}
      />
    </>
  );
};

export default ThemeSwitch;
