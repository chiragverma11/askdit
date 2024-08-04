"use client";

import { useTheme } from "next-themes";
import { Icons } from "./Icons";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/Select";

const ThemeSwitch = () => {
  const { theme, setTheme } = useTheme();

  return (
    <>
      <label
        htmlFor="themeSwitch"
        className="mr-4 inline-flex w-full items-center justify-between"
      >
        <span>Theme</span>
      </label>

      <Select value={theme || "system"} onValueChange={setTheme}>
        <SelectTrigger className="group/theme h-8 w-48 text-sm capitalize">
          <SelectValue placeholder="Theme">
            <span className="flex items-center gap-2">
              <ThemeIcon theme={theme} />
              {theme}
            </span>
          </SelectValue>
        </SelectTrigger>
        <SelectContent className="z-[51]">
          <SelectItem value="system">System</SelectItem>
          <SelectItem value="dark">Dark</SelectItem>
          <SelectItem value="light">Light</SelectItem>
        </SelectContent>
      </Select>
    </>
  );
};

const ThemeIcon = ({ theme }: { theme: string | undefined }) => {
  if (theme === "light")
    return (
      <Icons.light className="h-4 w-4 text-subtle transition-colors group-hover/theme:text-default group-focus/theme:text-default" />
    );
  else if (theme === "dark")
    return (
      <Icons.dark className="group-focustheme:text-default h-4 w-4 text-subtle transition-colors group-hover/theme:text-default" />
    );
  else if (theme === "system")
    return (
      <Icons.system className="group-focustheme:text-default h-4 w-4 text-subtle transition-colors group-hover/theme:text-default" />
    );
};

export default ThemeSwitch;
