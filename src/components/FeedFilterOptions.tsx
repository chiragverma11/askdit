import { FC } from "react";
import FeedViewTypeSelector from "./FeedViewTypeSelector";

interface FeedFilterOptionProps {}

const FeedFilterOptions: FC<FeedFilterOptionProps> = ({}) => {
  return (
    <div className="mb-3 flex gap-4 border-b border-default/40 px-4 py-2 md:rounded-xl md:border md:bg-emphasis">
      <FeedViewTypeSelector className="h-8 border-0 bg-transparent data-[state=open]:bg-emphasis md:bg-emphasis md:data-[state=open]:bg-subtle" />
    </div>
  );
};

export default FeedFilterOptions;
