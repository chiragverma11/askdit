import PostFeed from "@/components/PostFeed";
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
