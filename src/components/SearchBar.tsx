import { cn } from "@/lib/utils";
import { Search } from "lucide-react";
import React, { FC } from "react";

interface SearchBarProps extends React.HTMLAttributes<HTMLDivElement> {}

const SearchBar: FC<SearchBarProps> = ({ className, ...props }) => {
  return (
    <div
      className={cn(
        "inline-flex w-4/6 items-center gap-2 rounded-lg border border-default/25 bg-emphasis/80 px-6 text-sm text-subtle backdrop-blur-xl focus-within:border-default/90 focus-within:bg-subtle focus-within:transition hover:border-default/90",
        className,
      )}
      {...props}
    >
      <Search className="h-5 w-5" />
      <input
        type="text"
        name="search_input"
        className="w-full bg-transparent py-2.5 font-semibold placeholder:text-subtle focus-visible:outline-none"
        placeholder="Search"
      />
    </div>
  );
};

export default SearchBar;
