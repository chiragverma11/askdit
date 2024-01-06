import AskditAuthorCard from "@/components/AskditAuthorCard";
import CreatePostInput from "@/components/CreatePostInput";
import PostSkeleton from "@/components/PostSkeleton";
import AuthenticatedFeed from "@/components/homepage/AuthenticatedFeed";
import GeneralFeed from "@/components/homepage/GeneralFeed";
import GeneralSideMenuCard from "@/components/homepage/GeneralSideMenuCard";
import FeedWrapper from "@/components/layout/FeedWrapper";
import MainContentWrapper from "@/components/layout/MainContentWrapper";
import SideMenuWrapper from "@/components/layout/SideMenuWrapper";
import { getAuthSession } from "@/lib/auth";
import { type Session } from "next-auth";
import { FC, Suspense } from "react";

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
      <Suspense
        fallback={
          <ul className="space-y-1 pb-16 sm:space-y-2 md:space-y-3 lg:pb-0">
            {Array.from({ length: 4 }).map((_, index) => (
              <li key={index}>
                <PostSkeleton />
              </li>
            ))}
          </ul>
        }
      >
        {session?.user ? (
          <AuthenticatedFeed session={session} />
        ) : (
          <GeneralFeed session={session} />
        )}
      </Suspense>
    </FeedWrapper>
  );
};

export default HomePage;
