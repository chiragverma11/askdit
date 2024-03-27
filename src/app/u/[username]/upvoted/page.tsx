import PostFeed from "@/components/PostFeed";
import NoAccess from "@/components/user/NoAccess";
import NoUserContent from "@/components/user/NoUserContent";
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

  if (userUpvotedPosts.length === 0) {
    return (
      <NoUserContent
        isUserSelf={session?.user.id === userId}
        username={username}
        profileMenu="upvoted"
      />
    );
  }

  return (
    <PostFeed
      initialPosts={userUpvotedPosts}
      userId={session?.user.id}
      type="votedPost"
      authorId={userId!}
      voteType="UP"
    />
  );
};

export default UserProfileUpvotedPage;
