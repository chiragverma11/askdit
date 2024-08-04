import FeedFilterOptions from "@/components/FeedFilterOptions";
import FeedWrapper from "@/components/layout/FeedWrapper";
import MainContentWrapper from "@/components/layout/MainContentWrapper";
import PopularFeed from "@/components/popular/PopularFeed";
import { getAuthSession } from "@/lib/auth";
import { absoluteUrl } from "@/lib/utils";
import { Metadata } from "next";
import { FC } from "react";

export const metadata: Metadata = {
  title: "Popular",
  description:
    "The top trending content from some of Askdit's most popular communities.",
  openGraph: {
    title: "Popular",
    description:
      "The top trending content from some of Askdit's most popular communities.",
    url: absoluteUrl("/popular"),
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Popular",
    description:
      "The top trending content from some of Askdit's most popular communities.",
  },
};

interface PopularPageProps {}

const PopularPage: FC<PopularPageProps> = async ({}) => {
  const session = await getAuthSession();

  return (
    <MainContentWrapper>
      <FeedWrapper>
        <FeedFilterOptions />
        <PopularFeed currentUserId={session?.user.id} />
      </FeedWrapper>
    </MainContentWrapper>
  );
};

export default PopularPage;
