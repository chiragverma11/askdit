import { getPopularPosts } from "@/lib/prismaQueries";
import { FC } from "react";
import {
  NoContent,
  NoContentAction,
  NoContentDescription,
  NoContentTitle,
} from "../NoContent";
import PostFeed from "../PostFeed";

interface PopularFeedProps {
  currentUserId: string | undefined;
}

const PopularFeed: FC<PopularFeedProps> = async ({ currentUserId }) => {
  const popularPosts = await getPopularPosts({ currentUserId });

  if (popularPosts.length === 0) {
    return (
      <NoContent>
        <NoContentTitle>
          hmm... looks like there are no posts yet
        </NoContentTitle>
        <NoContentDescription>
          Create one and get this feed started
        </NoContentDescription>
        <NoContentAction href="/submit">Create Post</NoContentAction>
      </NoContent>
    );
  }

  return (
    <PostFeed
      type="popularPost"
      userId={currentUserId}
      initialPosts={popularPosts}
    />
  );
};

export default PopularFeed;
