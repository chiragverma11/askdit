import PostFeed from "@/components/PostFeed";
import NoUserContent from "@/components/user/NoUserContent";
import { getAuthSession } from "@/lib/auth";
import { getUserPosts } from "@/lib/prismaQueries";
import { FC } from "react";

interface UserProfilePageProps {
  params: {
    username: string;
  };
}

const UserProfilePostsPage: FC<UserProfilePageProps> = async ({ params }) => {
  const { username } = params;

  const session = await getAuthSession();

  const { authorId, userPosts } = await getUserPosts({
    username,
    currentUserId: session?.user.id,
  });

  if (userPosts.length === 0) {
    return (
      <NoUserContent
        isUserSelf={session?.user.id === authorId}
        username={username}
        profileMenu="posts"
      />
    );
  }

  return (
    <PostFeed
      type="userPost"
      authorId={authorId!}
      initialPosts={userPosts}
      session={session}
    />
  );
};

export default UserProfilePostsPage;
