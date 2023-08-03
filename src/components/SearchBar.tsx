import { Search } from "lucide-react";
import { FC } from "react";

interface SearchBarProps {}

const SearchBar: FC<SearchBarProps> = ({}) => {
  return (
    <div className="inline-flex w-3/5 items-center gap-2 rounded-lg bg-zinc-200/60 px-6 py-2 text-sm text-zinc-500  backdrop-blur-xl transition-colors focus-within:ring-2 focus-within:ring-ring focus-within:ring-offset-2 focus-within:ring-offset-zinc-300/75  hover:bg-zinc-200/80">
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
