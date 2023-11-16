import { getAuthenticatedFeedPosts } from "@/lib/prismaQueries";
import { Session } from "next-auth";
import { FC } from "react";
import PostFeed from "../PostFeed";

interface AuthenticatedFeedProps {
  session: Session | null;
}

const AuthenticatedFeed: FC<AuthenticatedFeedProps> = async ({ session }) => {
  const { posts, subscriptions } = await getAuthenticatedFeedPosts({
    userId: session?.user.id,
  });

  return (
    <PostFeed
      initialPosts={posts}
      session={session}
      communityIds={subscriptions.map((sub) => sub.subredditId)}
    />
  );
};

export default AuthenticatedFeed;
