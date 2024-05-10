import { getQuestions } from "@/lib/prismaQueries";
import { FC } from "react";
import PostFeed from "../PostFeed";

interface AnswerFeedProps {
  currentUserId: string | undefined;
}

const AnswerFeed: FC<AnswerFeedProps> = async ({ currentUserId }) => {
  const { communityIds, posts: questions } = await getQuestions({
    currentUserId,
  });

  return (
    <PostFeed
      type="answerPost"
      userId={currentUserId}
      initialPosts={questions}
      communityIds={communityIds}
    />
  );
};

export default AnswerFeed;
