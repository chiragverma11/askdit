"use client";

import { trpc } from "@/lib/trpc";
import { Session } from "next-auth";
import { FC } from "react";
import CommunitiesFallback from "./CommunitiesFallback";
import CommunityCard from "./CommunityCard";

interface YourCommunitiesProps {
  session: Session | null;
}

const YourCommunities: FC<YourCommunitiesProps> = ({ session }) => {
  const { isLoading: isLoading, data: yourCommunities } =
    trpc.community.yourCommunities.useQuery();

  if (!isLoading && yourCommunities?.length === 0) {
    return <CommunitiesFallback type="nocontent" parent="YourCommunities" />;
  }

  if (isLoading) {
    return <CommunitiesFallback type="loading" />;
  }

  return yourCommunities?.map((community) => (
    <CommunityCard
      key={community.subredditId}
      community={community.Subreddit}
      session={session}
      isSubscribed={true}
    />
  ));
};

export default YourCommunities;
