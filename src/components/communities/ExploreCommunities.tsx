"use client";

import { trpc } from "@/lib/trpc";
import { Session } from "next-auth";
import { FC } from "react";
import CommunitiesFallback from "./CommunitiesFallback";
import CommunityCard from "./CommunityCard";

interface ExploreCommunitiesProps {
  session: Session | null;
}

const ExploreCommunities: FC<ExploreCommunitiesProps> = ({ session }) => {
  const { isLoading: isLoading, data: exploreCommunities } =
    trpc.community.exploreCommunities.useQuery();

  if (!isLoading && exploreCommunities?.length === 0) {
    return <CommunitiesFallback type="nocontent" parent="ExploreCommunities" />;
  }

  if (isLoading) {
    return <CommunitiesFallback type="loading" />;
  }

  return exploreCommunities?.map((community) => (
    <CommunityCard key={community.id} community={community} session={session} />
  ));
};

export default ExploreCommunities;
