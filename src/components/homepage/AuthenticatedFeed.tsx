import { getAuthenticatedFeedPosts } from "@/lib/prismaQueries";
import { Session } from "next-auth";
import { FC } from "react";
import { NoContent, NoContentAction, NoContentTitle } from "../NoContent";
import PostFeed from "../PostFeed";

interface AuthenticatedFeedProps {
  session: Session | null;
}

const AuthenticatedFeed: FC<AuthenticatedFeedProps> = async ({ session }) => {
  const { posts, communityIds } = await getAuthenticatedFeedPosts({
    userId: session?.user.id,
  });

  if (communityIds.length === 0 && posts.length === 0) {
    return (
      <NoContent>
        <NoContentTitle>
          You haven&apos;t joined any community yet
        </NoContentTitle>
        <NoContentAction href="/communities?explore=true">
          Explore Communities
        </NoContentAction>
      </NoContent>
    );
  }

  return (
    <PostFeed
      type="authenticatedPost"
      initialPosts={posts}
      userId={session?.user.id}
      communityIds={communityIds}
    />
  );
};

export default AuthenticatedFeed;
