import { SearchType } from "@/lib/validators/search";
import { FC } from "react";
import PostSkeleton from "../PostSkeleton";
import { UserCardSkeleton } from "./feed/UserSearchFeed";
import { UserCommentSkeleton } from "../user/UserComment";
import { CommunityCardSkeleton } from "./feed/CommunitySearchFeed";

interface SearchFeedFallbackProps {
  type: SearchType;
}

const SearchFeedFallback: FC<SearchFeedFallbackProps> = ({ type }) => {
  if (type === "post") {
    return (
      <ul className="space-y-1 pb-16 sm:space-y-2 md:space-y-3 lg:pb-0">
        {Array.from({ length: 4 }).map((_, index) => (
          <li key={index}>
            <PostSkeleton />
          </li>
        ))}
      </ul>
    );
  }
  else if (type === "comment") {
    return (
      <ul className="space-y-1 pb-16 md:space-y-2 lg:pb-0">
        {Array.from({ length: 4 }).map((_, index) => (
          <li key={index}>
            <UserCommentSkeleton />
          </li>
        ))}
      </ul>)
  }
  else if (type === "community") {
    return <ul className="flex w-full flex-col items-center gap-4 px-4 pb-16 lg:max-h-none lg:pb-4 lg:pr-4">
      {Array.from({ length: 4 }).map((_, index) => (
        <li key={index} className="w-full">
          <CommunityCardSkeleton />
        </li>
      ))}
    </ul>;
  }
  else if (type === "user") {
    return <ul className="flex w-full flex-col items-center gap-4 px-4 pb-16 lg:max-h-none lg:pb-4 lg:pr-4">
      {Array.from({ length: 4 }).map((_, index) => (
        <li key={index} className="w-full">
          <UserCardSkeleton />
        </li>
      ))}
    </ul>;
  }

};

export default SearchFeedFallback;
