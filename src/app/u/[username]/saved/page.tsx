import NoAccess from "@/components/user/NoAccess";
import NoUserContent from "@/components/user/NoUserContent";
import UserBookmarkFeed from "@/components/user/UserBookmarkFeed";
import { getAuthSession } from "@/lib/auth";
import { getUserBookmarks, getUserIdByUsername } from "@/lib/prismaQueries";
import { FC } from "react";

interface UserProfileSavedPageProps {
  params: {
    username: string;
  };
}

const UserProfileSavedPage: FC<UserProfileSavedPageProps> = async ({
  params,
}) => {
  const { username } = params;

  const session = await getAuthSession();
  const userId = await getUserIdByUsername({ username });

  if (session?.user.id !== userId) {
    return <NoAccess />;
  }

  const userBookmarks = await getUserBookmarks({ userId: userId! });

  if (userBookmarks.length === 0) {
    return (
      <NoUserContent
        isUserSelf={session?.user.id === userId}
        username={username}
        profileMenu="saved"
      />
    );
  }

  return <UserBookmarkFeed initialBookmarks={userBookmarks} userId={userId!} />;
};

export default UserProfileSavedPage;
