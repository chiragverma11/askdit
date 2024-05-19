import FeedFilterOptions from "@/components/FeedFilterOptions";
import FeedWrapper from "@/components/layout/FeedWrapper";
import MainContentWrapper from "@/components/layout/MainContentWrapper";
import PopularFeed from "@/components/popular/PopularFeed";
import { getAuthSession } from "@/lib/auth";
import { FC } from "react";

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
