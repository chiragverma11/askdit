import { getQuestions } from "@/lib/prismaQueries";
import { FC } from "react";
import {
  NoContent,
  NoContentAction,
  NoContentDescription,
  NoContentTitle,
} from "../NoContent";
import PostFeed from "../PostFeed";

interface AnswerFeedProps {
  currentUserId: string | undefined;
}

const AnswerFeed: FC<AnswerFeedProps> = async ({ currentUserId }) => {
  const { communityIds, posts: questions } = await getQuestions({
    currentUserId,
  });

  if (questions.length === 0) {
    return (
      <NoContent>
        <NoContentTitle>There are no questions to answer</NoContentTitle>
        <NoContentDescription>
          Join a communtiy to ask or answer questions
        </NoContentDescription>
        <NoContentAction href="/communities?explore=true">
          Explore Communities
        </NoContentAction>
      </NoContent>
    );
  }

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
