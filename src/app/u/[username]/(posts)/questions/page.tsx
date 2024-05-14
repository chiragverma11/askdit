import PostFeed from "@/components/PostFeed";
import NoUserContent from "@/components/user/NoUserContent";
import { getAuthSession } from "@/lib/auth";
import { getUserQuestions } from "@/lib/prismaQueries";
import { FC } from "react";

interface UserProfileQuestionsPageProps {
  params: {
    username: string;
  };
}

const UserProfileQuestionsPage: FC<UserProfileQuestionsPageProps> = async ({
  params,
}) => {
  const { username } = params;

  const session = await getAuthSession();

  const { authorId, userQuestions } = await getUserQuestions({
    username,
    currentUserId: session?.user.id,
  });

  if (userQuestions.length === 0) {
    return (
      <NoUserContent
        isUserSelf={session?.user.id === authorId}
        username={username}
        profileMenu="questions"
      />
    );
  }

  return (
    <PostFeed
      type="userQuestion"
      authorId={authorId!}
      initialPosts={userQuestions}
      userId={session?.user.id}
    />
  );
};

export default UserProfileQuestionsPage;
