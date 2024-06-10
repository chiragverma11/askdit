import Communities from "@/components/communities/Communities";
import GeneralSideMenuCard from "@/components/homepage/GeneralSideMenuCard";
import FeedWrapper from "@/components/layout/FeedWrapper";
import MainContentWrapper from "@/components/layout/MainContentWrapper";
import SideMenuWrapper from "@/components/layout/SideMenuWrapper";
import { getAuthSession } from "@/lib/auth";
import { absoluteUrl } from "@/lib/utils";
import { Metadata } from "next";
import { FC } from "react";
import "react-loading-skeleton/dist/skeleton.css";

export const metadata: Metadata = {
  title: "Communities",
  description:
    "Discover and manage communities on Askdit. Engage with like-minded people, join discussions, and share knowledge across various topics.",
  openGraph: {
    title: "Communities",
    description:
      "Discover and manage communities on Askdit. Engage with like-minded people, join discussions, and share knowledge across various topics.",
    url: absoluteUrl("/communities"),
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Communities",
    description:
      "Discover and manage communities on Askdit. Engage with like-minded people, join discussions, and share knowledge across various topics.",
  },
};

interface CommunitiesPageProps {
  searchParams: { [key: string]: string | string[] | undefined };
}

const CommunitiesPage: FC<CommunitiesPageProps> = async ({ searchParams }) => {
  const session = await getAuthSession();
  const { explore } = searchParams;

  return (
    <MainContentWrapper className="lg:pb-0">
      <FeedWrapper>
        <Communities
          session={session}
          explore={explore === "true" ? true : false}
        />
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
