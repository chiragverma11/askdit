import {
  getSearchComments,
  getSearchCommunities,
  getSearchPosts,
  getSearchUsers,
} from "@/lib/prismaQueries";
import { SearchType } from "@/lib/validators/search";
import { FC } from "react";
import { NoContent, NoContentDescription, NoContentTitle } from "../NoContent";
import PostFeed from "../PostFeed";
import CommentSearchFeed from "./feed/CommentSearchFeed";
import CommunitySearchFeed from "./feed/CommunitySearchFeed";
import UserSearchFeed from "./feed/UserSearchFeed";

interface SearchFeedProps {
  type: SearchType;
  query: string;
  userId: string | undefined;
}

const SearchFeed: FC<SearchFeedProps> = async ({ type, query, userId }) => {
  if (type === "post") {
    const searchPosts = await getSearchPosts({ query });

    if (searchPosts.length === 0) {
      return <NoResult query={query} />;
    }

    return (
      <PostFeed
        type="searchPost"
        initialPosts={searchPosts}
        query={query}
        userId={userId}
        variant="compact"
      />
    );
  }

  if (type === "community") {
    const searchCommunities = await getSearchCommunities({ query, userId });

    if (searchCommunities.length === 0) {
      return <NoResult query={query} />;
    }

    return (
      <CommunitySearchFeed
        query={query}
        initialCommunities={searchCommunities}
        userId={userId}
      />
    );
  }

  if (type === "user") {
    const users = await getSearchUsers({ query, userId });

    if (users.length === 0) {
      return <NoResult query={query} />;
    }

    return (
      <UserSearchFeed query={query} userId={userId} initialUsers={users} />
    );
  }

  if (type === "comment") {
    const searchComments = await getSearchComments({ query, userId });

    if (searchComments.length === 0) {
      return <NoResult query={query} />;
    }

    return (
      <CommentSearchFeed
        initialComments={searchComments}
        query={query}
        userId={userId}
      />
    );
  }
};

interface NoResultProps {
  query: string;
}

const NoResult: FC<NoResultProps> = ({ query }) => {
  return (
    <NoContent>
      <NoContentTitle>
        hmm... we couldn&apos;t find any results for &quot;{query}&quot;
      </NoContentTitle>
      <NoContentDescription>
        Double-check your spelling or try searching for something else
      </NoContentDescription>
    </NoContent>
  );
};

export default SearchFeed;
