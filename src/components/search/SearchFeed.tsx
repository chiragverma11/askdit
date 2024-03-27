import { getSearchComments, getSearchCommunities, getSearchPosts, getSearchUsers } from "@/lib/prismaQueries";
import { SearchType } from "@/lib/validators/search";
import { FC } from "react";
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

    return (
      <PostFeed
        type="searchPost"
        initialPosts={searchPosts}
        query={query}
        userId={userId}
      />
    );
  }

  if (type === "community") {
    const searchCommunities = await getSearchCommunities({ query, userId });

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
    await new Promise((resolve) => setTimeout(resolve, 4000));

    return <UserSearchFeed query={query} userId={userId} initialUsers={users} />;
  }

  if (type === "comment") {
    const searchComments = await getSearchComments({ query, userId });

    return <CommentSearchFeed initialComments={searchComments} query={query} userId={userId} />
  }
};

export default SearchFeed;
