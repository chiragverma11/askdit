import { FC } from "react";
import PostFeed from "../PostFeed";
import { getPopularPosts } from "@/lib/prismaQueries";

interface PopularFeedProps {
  currentUserId: string | undefined;
}

const PopularFeed: FC<PopularFeedProps> = async ({ currentUserId }) => {
  const popularPosts = await getPopularPosts({ currentUserId });

  return (
    <PostFeed
      type="popularPost"
      userId={currentUserId}
      initialPosts={popularPosts}
    />
  );
};

export default PopularFeed;
