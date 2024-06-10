import FeedFilterOptions from "@/components/FeedFilterOptions";
import AnswerFeed from "@/components/answer/AnswerFeed";
import FeedWrapper from "@/components/layout/FeedWrapper";
import MainContentWrapper from "@/components/layout/MainContentWrapper";
import { getAuthSession } from "@/lib/auth";
import { absoluteUrl } from "@/lib/utils";
import { Metadata } from "next";
import { FC } from "react";

export const metadata: Metadata = {
  title: "Answer",
  description:
    "Find answers and share your expertise on Askdit! Explore questions from communities you follow and join the conversation.",
  openGraph: {
    title: "Answer",
    description:
      "Find answers and share your expertise on Askdit! Explore questions from communities you follow and join the conversation.",
    url: absoluteUrl("/answer"),
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Answer",
    description:
      "Find answers and share your expertise on Askdit! Explore questions from communities you follow and join the conversation.",
  },
};

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
