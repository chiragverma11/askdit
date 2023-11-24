import AskditAuthorCard from "@/components/AskditAuthorCard";
import CreatePostInput from "@/components/CreatePostInput";
import AuthenticatedFeed from "@/components/homepage/AuthenticatedFeed";
import GeneralFeed from "@/components/homepage/GeneralFeed";
import GeneralSideMenuCard from "@/components/homepage/GeneralSideMenuCard";
import FeedWrapper from "@/components/layout/FeedWrapper";
import MainContentWrapper from "@/components/layout/MainContentWrapper";
import SideMenuWrapper from "@/components/layout/SideMenuWrapper";
import { getAuthSession } from "@/lib/auth";
import { type Session } from "next-auth";
import { FC } from "react";

const HomePage = async () => {
  const session = await getAuthSession();

  return (
    <MainContentWrapper>
      <HomeFeed session={session} />
      <SideMenuWrapper>
        {session?.user ? <GeneralSideMenuCard /> : null} <AskditAuthorCard />
      </SideMenuWrapper>
    </MainContentWrapper>
  );
};

interface HomeFeedProps {
  session: Session | null;
}

const HomeFeed: FC<HomeFeedProps> = ({ session }) => {
  return (
    <FeedWrapper>
      {session?.user ? (
        <CreatePostInput
          session={session}
          className="mb-3 sm:mb-4"
          href="/submit"
        />
      ) : null}
      {session?.user ? (
        <AuthenticatedFeed session={session} />
      ) : (
        <GeneralFeed session={session} />
      )}
    </FeedWrapper>
  );
};

export default HomePage;
