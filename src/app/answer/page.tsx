import FeedFilterOptions from "@/components/FeedFilterOptions";
import AnswerFeed from "@/components/answer/AnswerFeed";
import FeedWrapper from "@/components/layout/FeedWrapper";
import MainContentWrapper from "@/components/layout/MainContentWrapper";
import { getAuthSession } from "@/lib/auth";
import { FC } from "react";

interface AnswerPageProps {}

const AnswerPage: FC<AnswerPageProps> = async ({}) => {
  const session = await getAuthSession();

  return (
    <MainContentWrapper>
      <FeedWrapper>
        <FeedFilterOptions />
        <AnswerFeed currentUserId={session?.user.id} />
      </FeedWrapper>
    </MainContentWrapper>
  );
};

export default AnswerPage;
