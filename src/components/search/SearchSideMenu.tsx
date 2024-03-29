import { SearchType } from "@/lib/validators/search";
import { FC, Suspense } from "react";
import SubscribeLeaveToggle from "../SubscribeLeaveToggle";
import CommunityAvatar from "../CommunityAvatar";
import Link from "next/link";
import { getSearchCommunities } from "@/lib/prismaQueries";
import { Session } from "next-auth";
import Skeleton, { SkeletonTheme } from "react-loading-skeleton";

interface SearchSideMenuProps {
  type: SearchType;
  query: string;
  session: Session | null;
}

const SearchSideMenu: FC<SearchSideMenuProps> = ({ type, query, session }) => {
  if (type === "user" || type === "community") return;
  return (
    <div className="flex flex-col gap-4">
      <Suspense fallback={<SearchCommunitySideMenuSkeleton />}>
        <SearchCommunitySideMenu query={query} session={session} />
      </Suspense>
    </div>
  );
};

const SearchCommunitySideMenu: FC<Omit<SearchSideMenuProps, "type">> = async ({
  query,
  session,
}) => {
  const searchCommunities = await getSearchCommunities({
    query,
    userId: session?.user.id,
  });

  return (
    <div className="flex flex-col gap-4 rounded-xl border border-default/40 bg-emphasis px-4 py-4">
      <div className="flex flex-col gap-4">
        <p className="text-sm font-bold text-subtle">Communities</p>
        <ul className="flex h-auto w-full flex-col gap-2 text-sm">
          {searchCommunities.map((community) => (
            <li
              className="flex items-center justify-between"
              key={community.id}
            >
              <Link
                href={`/r/${community.name}`}
                className="flex items-center gap-2"
              >
                <CommunityAvatar
                  communityName={community.name}
                  image={community.image}
                />
                <div className="flex flex-col">
                  <span className="text-sm hover:underline">
                    r/{community.name}
                  </span>
                  <span className="text-xs text-subtle">
                    {community._count.subscribers} members
                  </span>
                </div>
              </Link>
              <SubscribeLeaveToggle
                className="w-16 px-1"
                isSubscribed={community.subscribers.some((subscription) => {
                  return (
                    subscription.userId === session?.user.id &&
                    subscription.subredditId === community.id
                  );
                })}
                isAuthenticated={session ? true : false}
                subredditId={community.id}
                subredditName={community.name}
                disabled={session?.user.id === community.creatorId}
                disableRefresh={true}
              />
            </li>
          ))}
          {searchCommunities.length === 0 && (
            <p>No community matches your search</p>
          )}
        </ul>
      </div>
    </div>
  );
};

const SearchCommunitySideMenuSkeleton = () => {
  return (
    <SkeletonTheme
      baseColor="var(--skeleton-base)"
      highlightColor="var(--skeleton-highlight)"
      duration={2}
      inline={false}
    >
      <div className="flex flex-col gap-4 rounded-xl border border-default/40 bg-emphasis px-4 py-4">
        <div className="flex flex-col gap-4">
          <p className="text-sm font-bold text-subtle">Communities</p>
          <ul className="flex h-auto w-full flex-col gap-2 text-sm">
            {Array.from({ length: 4 }).map((_, index) => (
              <li className="flex items-center justify-between" key={index}>
                <div className="flex items-center gap-2">
                  <Skeleton className="aspect-square h-8 w-8" circle={true} />
                  <div className="flex flex-col -space-y-1">
                    <Skeleton className="text-sm" width={"5rem"} />
                    <Skeleton className="text-xs" width={"4rem"} />
                  </div>
                </div>
                <Skeleton
                  width={"4rem"}
                  height={"2rem"}
                  borderRadius={"0.5rem"}
                />
              </li>
            ))}
          </ul>
        </div>
      </div>
    </SkeletonTheme>
  );
};

export default SearchSideMenu;
