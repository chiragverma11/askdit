import UserCommentFeed from "@/components/user/UserCommentFeed";
import { getAuthSession } from "@/lib/auth";
import { getUserComments } from "@/lib/prismaQueries";
import { FC } from "react";

interface UserProfileCommentsPageProps {
  params: {
    username: string;
  };
}

const UserProfileCommentsPage: FC<UserProfileCommentsPageProps> = async ({
  params,
}) => {
  const { username } = params;

  const session = await getAuthSession();

  const { authorId, userComments } = await getUserComments({
    username,
    currentUserId: session?.user.id,
  });

  return (
    <UserCommentFeed
      initialComments={userComments}
      session={session}
      authorId={authorId!}
    />
  );
};

export default UserProfileCommentsPage;
