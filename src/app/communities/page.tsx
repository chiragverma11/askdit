import Communities from "@/components/communities/Communities";
import GeneralSideMenuCard from "@/components/homepage/GeneralSideMenuCard";
import FeedWrapper from "@/components/layout/FeedWrapper";
import MainContentWrapper from "@/components/layout/MainContentWrapper";
import SideMenuWrapper from "@/components/layout/SideMenuWrapper";
import { getAuthSession } from "@/lib/auth";
import { Metadata } from "next";
import "react-loading-skeleton/dist/skeleton.css";

export const metadata: Metadata = {
  title: "Communities",
};

const CommunitiesPage = async () => {
  const session = await getAuthSession();

  return (
    <MainContentWrapper>
      <FeedWrapper>
        <Communities session={session} />
      </FeedWrapper>
      <SideMenuWrapper>
        <GeneralSideMenuCard
          title="Communities"
          description="Communities will be shown on this page. You can join or leave communities or create a community."
        />
      </SideMenuWrapper>
    </MainContentWrapper>
  );
};

export default CommunitiesPage;
