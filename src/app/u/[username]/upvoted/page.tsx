import PostFeed from "@/components/PostFeed";
import NoAccess from "@/components/user/NoAccess";
import { getAuthSession } from "@/lib/auth";
import { getUserIdByUsername, getUserVotedPosts } from "@/lib/prismaQueries";
import { FC } from "react";

interface UserProfileUpvotedPageProps {
  params: {
    username: string;
  };
}

const UserProfileUpvotedPage: FC<UserProfileUpvotedPageProps> = async ({
  params,
}) => {
  const { username } = params;

  const session = await getAuthSession();
  const userId = await getUserIdByUsername({ username });

  if (session?.user.id !== userId) {
    return <NoAccess />;
  }

  const userUpvotedPosts = await getUserVotedPosts({
    userId: userId!,
    voteType: "UP",
  });

  return (
    <PostFeed
      initialPosts={userUpvotedPosts}
      session={session}
      type="votedPost"
      authorId={userId!}
      voteType="UP"
    />
  );
};

export default UserProfileUpvotedPage;
