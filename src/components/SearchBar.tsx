import { cn } from "@/lib/utils";
import { Search } from "lucide-react";
import React, { FC } from "react";

interface SearchBarProps extends React.HTMLAttributes<HTMLDivElement> {}

const SearchBar: FC<SearchBarProps> = ({ className, ...props }) => {
  return (
    <div
      className={cn(
        "inline-flex w-4/6 items-center gap-2 rounded-lg bg-zinc-200/60 px-6 py-2 text-sm text-zinc-500  backdrop-blur-xl transition focus-within:ring-2 focus-within:ring-ring focus-within:ring-offset-2  focus-within:ring-offset-zinc-300/75 hover:bg-zinc-200/80 hover:outline hover:outline-zinc-400/50",
        className,
      )}
      {...props}
    >
      <Search className="h-5 w-5" />
      <input
        type="text"
        className="w-full bg-transparent font-semibold placeholder:text-zinc-500 focus-visible:outline-none"
        placeholder="Search"
      />
    </div>
  );
};

export default SearchBar;
