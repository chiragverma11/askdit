import { getAuthenticatedFeedPosts } from "@/lib/prismaQueries";
import { cn } from "@/lib/utils";
import { Session } from "next-auth";
import Link from "next/link";
import { FC } from "react";
import PostFeed from "../PostFeed";
import { buttonVariants } from "../ui/Button";

interface AuthenticatedFeedProps {
  session: Session | null;
}

const AuthenticatedFeed: FC<AuthenticatedFeedProps> = async ({ session }) => {
  const { posts, subscriptions } = await getAuthenticatedFeedPosts({
    userId: session?.user.id,
  });

  if (subscriptions.length === 0 && posts.length === 0) {
    return <NoAuthenticatedPost />;
  }

  return (
    <PostFeed
      type="authenticatedPost"
      initialPosts={posts}
      session={session}
      communityIds={subscriptions.map((sub) => sub.subredditId)}
    />
  );
};

const NoAuthenticatedPost = () => {
  return (
    <div className="flex flex-col items-center gap-4 p-4">
      <p className="text-default">You haven&apos;t joined any community yet</p>
      <Link
        href="/communities?explore=true"
        className={cn(
          buttonVariants({ size: "sm", variant: "outline" }),
          "rounded-lg",
        )}
      >
        Explore Communities
      </Link>
    </div>
  );
};

export default AuthenticatedFeed;
