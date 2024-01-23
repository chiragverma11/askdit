import { cn } from "@/lib/utils";
import { FC } from "react";
import FeedViewTypeSelector from "./FeedViewTypeSelector";

interface FeedFilterOptionProps extends React.ComponentPropsWithoutRef<"div"> {}

const FeedFilterOptions: FC<FeedFilterOptionProps> = ({ className }) => {
  return (
    <div
      className={cn(
        "mb-3 flex gap-4 border-y border-default/25 bg-emphasis px-4 py-2 sm:mb-4 md:rounded-xl md:border",
        className,
      )}
    >
      <FeedViewTypeSelector className="h-8 border-0 bg-transparent data-[state=open]:bg-emphasis md:bg-emphasis md:data-[state=open]:bg-subtle" />
    </div>
  );
};

export default FeedFilterOptions;
