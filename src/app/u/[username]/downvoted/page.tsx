import PostFeed from "@/components/PostFeed";
import NoAccess from "@/components/user/NoAccess";
import { getAuthSession } from "@/lib/auth";
import { getUserIdByUsername, getUserVotedPosts } from "@/lib/prismaQueries";
import { FC } from "react";

interface UserProfileDownvotedPageProps {
  params: {
    username: string;
  };
}

const UserProfileDownvotedPage: FC<UserProfileDownvotedPageProps> = async ({
  params,
}) => {
  const { username } = params;

  const session = await getAuthSession();
  const userId = await getUserIdByUsername({ username });

  if (session?.user.id !== userId) {
    return <NoAccess />;
  }

  const userDownvotedPosts = await getUserVotedPosts({
    userId: userId!,
    voteType: "DOWN",
  });

  return (
    <PostFeed
      initialPosts={userDownvotedPosts}
      session={session}
      type="votedPost"
      authorId={userId!}
      voteType="DOWN"
    />
  );
};

export default UserProfileDownvotedPage;
