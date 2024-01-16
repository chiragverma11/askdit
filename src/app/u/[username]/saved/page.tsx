import NoAccess from "@/components/user/NoAccess";
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

  return <UserBookmarkFeed initialBookmarks={userBookmarks} userId={userId!} />;
};

export default UserProfileSavedPage;
