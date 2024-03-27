"use client";

import CommunityAvatar from "@/components/CommunityAvatar";
import SubscribeLeaveToggle from "@/components/SubscribeLeaveToggle";
import { INFINITE_SCROLL_PAGINATION_RESULTS } from "@/lib/config";
import { getSearchCommunities } from "@/lib/prismaQueries";
import { trpc } from "@/lib/trpc";
import { useIntersection } from "@mantine/hooks";
import Link from "next/link";
import { FC, useEffect, useRef } from "react";
import Skeleton, { SkeletonTheme } from "react-loading-skeleton";

interface CommunitySearchFeedProps {
  query: string;
  userId: string | undefined;
  initialCommunities: Awaited<ReturnType<typeof getSearchCommunities>>;
}

const CommunitySearchFeed: FC<CommunitySearchFeedProps> = ({
  query,
  userId,
  initialCommunities,
}) => {
  const lastPostRef = useRef<HTMLElement>(null);
  const { ref, entry } = useIntersection({
    root: lastPostRef.current,
    threshold: 0.1,
  });

  const { data, isLoading, isFetchingNextPage, fetchNextPage, hasNextPage } =
    trpc.search.infiniteSearchCommunities.useInfiniteQuery({
      limit: INFINITE_SCROLL_PAGINATION_RESULTS,
      query,
      userId,
    });

  useEffect(() => {
    if (hasNextPage && entry?.isIntersecting) {
      fetchNextPage();
    }
  }, [entry, fetchNextPage, isLoading, hasNextPage]);

  const communities =
    data?.pages.flatMap((page) => page.communities) ?? initialCommunities;

  return (
    <ul className="flex w-full flex-col items-center gap-4 px-4 pb-16 lg:max-h-none lg:pb-4 lg:pr-4">
      {communities.map((community, index) => {
        if (index === communities.length - 1) {
          return (
            <li ref={ref} key={community.id} className="w-full">
              <CommunityCard
                community={community}
                isSubscribed={community.subscribers.length > 0}
                userId={userId}
              />
            </li>
          );
        } else {
          return (
            <li key={community.id} className="w-full">
              <CommunityCard
                community={community}
                isSubscribed={community.subscribers.length > 0}
                userId={userId}
              />
            </li>
          );
        }
      })}
      {isFetchingNextPage ? (
        <li className="relative -mb-24 lg:-mb-8 w-full">
          <div className="-mb-24 h-44 overflow-hidden lg:-mb-8 lg:h-40">
            <CommunityCardSkeleton />
          </div>
        </li>
      ) : null}
    </ul>
  );
};

interface CommunityCardProps {
  community: Pick<
    CommunitySearchFeedProps,
    "initialCommunities"
  >["initialCommunities"][number];
  isSubscribed: boolean;
  userId: string | undefined;
}

const CommunityCard: FC<CommunityCardProps> = ({
  community,
  isSubscribed,
  userId,
}) => {
  return (
    <Link
      href={`/r/${community.name}`}
      key={community.id}
      className="block w-full gap-4 rounded-xl border border-y border-default/20 bg-emphasis bg-emphasis/75 px-4 py-4 text-base font-medium text-default/75 aria-selected:text-default/90 md:rounded-xl md:border lg:p-4 lg:hover:border-default/60"
    >
      <div className="flex w-full items-center justify-between">
        <div className="flex items-center gap-3">
          <CommunityAvatar
            className="h-10 w-10 text-2xl"
            communityName={community.name}
            image={community.image}
          />
          <div className="flex flex-col">
            <h1 className="text-lg font-semibold md:text-xl">
              r/{community.name}
            </h1>
            <p className="text-xs text-subtle">
              {`${community._count.subscribers} ${community._count.subscribers > 1 ? "members" : "member"
                }`}
            </p>
          </div>
        </div>
        <SubscribeLeaveToggle
          isSubscribed={isSubscribed}
          subredditId={community.id}
          subredditName={community.name}
          isAuthenticated={userId ? true : false}
          disableRefresh={true}
          disabled={userId === community.creatorId}
        />
      </div>
    </Link>
  );
};

export const CommunityCardSkeleton = () => {
  return (
    <SkeletonTheme
      baseColor="var(--skeleton-base)"
      highlightColor="var(--skeleton-highlight)"
      duration={2}
      inline={false}
    >
      <div className="w-full rounded-xl border border-default/20 bg-emphasis px-4 py-4">
        <div className="flex w-full items-center justify-between">
          <div className="flex items-center gap-3">
            <Skeleton
              className="flex aspect-square h-10 w-10 text-2xl"
              circle={true}
            />
            <div className="flex flex-col -space-y-1">
              <Skeleton
                className="text-lg font-semibold md:text-xl"
                width={"7rem"}
              />
              <Skeleton className="text-xs text-subtle" width={"5rem"} />
            </div>
          </div>

          <Skeleton width={"4.75rem"} height={"2rem"} borderRadius={"0.5rem"} />
        </div>
      </div>
    </SkeletonTheme>
  );
};

export default CommunitySearchFeed;
