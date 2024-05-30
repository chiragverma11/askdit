import NoUserContent from "@/components/user/NoUserContent";
import UserCommentFeed from "@/components/user/UserCommentFeed";
import { getAuthSession } from "@/lib/auth";
import { getUserAnswers } from "@/lib/prismaQueries";
import { FC } from "react";

interface UserProfileAnswersPageProps {
  params: {
    username: string;
  };
}

const UserProfileAnswersPage: FC<UserProfileAnswersPageProps> = async ({
  params,
}) => {
  const { username } = params;

  const session = await getAuthSession();

  const { authorId, userAnswers } = await getUserAnswers({
    username,
    currentUserId: session?.user.id,
  });

  if (userAnswers.length === 0) {
    return (
      <NoUserContent
        isUserSelf={session?.user.id === authorId}
        username={username}
        profileMenu="answers"
      />
    );
  }

  return (
    <UserCommentFeed
      type="userAnswer"
      initialComments={userAnswers}
      session={session}
      authorId={authorId!}
    />
  );
};

export default UserProfileAnswersPage;
