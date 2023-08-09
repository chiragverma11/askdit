import { cn } from "@/lib/utils";
import { Search } from "lucide-react";
import React, { FC } from "react";

interface SearchBarProps extends React.HTMLAttributes<HTMLDivElement> {}

const SearchBar: FC<SearchBarProps> = ({ className, ...props }) => {
  return (
    <div
      className={cn(
        "inline-flex w-4/6 items-center gap-2 rounded-lg border border-default/25 bg-emphasis px-6  py-2.5 text-sm text-subtle backdrop-blur-xl transition focus-within:border-default/90 focus-within:bg-subtle hover:border-default/90",
        className,
      )}
      {...props}
    >
      <Search className="h-5 w-5" />
      <input
        type="text"
        className="w-full bg-transparent font-semibold placeholder:text-subtle focus-visible:outline-none"
        placeholder="Search"
      />
    </div>
  );
};

export default SearchBar;
