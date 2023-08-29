"use client";

import AsideBar from "@/components/AsideBar";
import SubscribeLeaveToggle from "@/components/SubscribeLeaveToggle";
import { trpc } from "@/lib/trpc";
import { cn, getDefaultCommunityBg } from "@/lib/utils";
import { motion } from "framer-motion";
import { Session } from "next-auth";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { FC, useState } from "react";
import Skeleton, { SkeletonTheme } from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";

const CommunitiesPage = () => {
  const [activeMenu, setActiveMenu] = useState<"Your Communities" | "Explore">(
    "Your Communities",
  );

  const { data: session, status: sessionStatus } = useSession();

  return (
    <>
      <AsideBar />{" "}
      <div className="flex w-full justify-center px-2 py-6 pt-4">
        <div className="relative w-full overflow-x-hidden lg:w-[600px]">
          <div className="flex flex-col gap-5">
            <div className="flex items-center gap-6 px-4 lg:gap-10">
              {["Your Communities", " Explore"].map((menuName) => {
                const isActive = menuName === activeMenu;
                const menu = menuName as typeof activeMenu;
                return (
                  <h1
                    className="relative cursor-pointer text-xl font-semibold text-default lg:text-2xl"
                    key={menuName}
                    onClick={() => {
                      setActiveMenu(menu);
                    }}
                  >
                    {menuName}
                    {isActive ? (
                      <motion.div
                        className="absolute inset-x-0 -bottom-2 -z-10 h-1 rounded-md bg-primary"
                        layoutId="asidebar"
                        aria-hidden="true"
                        transition={{
                          type: "spring",
                          bounce: 0.01,
                          stiffness: 140,
                          damping: 18,
                          duration: 0.3,
                        }}
                      />
                    ) : null}
                  </h1>
                );
              })}
            </div>
            <div className="flex max-h-[calc(72vh)] w-full flex-col items-center gap-4 overflow-y-scroll px-4 pb-10 lg:max-h-none lg:overflow-y-auto lg:px-0 lg:pb-0 landscape:pb-20 lg:landscape:pb-0">
              {activeMenu === "Your Communities" ? (
                <YourCommunities
                  session={session}
                  sessionStatus={sessionStatus}
                />
              ) : (
                <ExploreCommunities
                  session={session}
                  sessionStatus={sessionStatus}
                />
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

interface Communities {
  session: Session | null;
  sessionStatus: "authenticated" | "loading" | "unauthenticated";
}

const YourCommunities: FC<Communities> = ({ session, sessionStatus }) => {
  const { isLoading: isLoadingCommunities, data: yourCommunities } =
    trpc.community.yourCommunities.useQuery();

  const isLoading = isLoadingCommunities || sessionStatus === "loading";

  return (
    <>
      {!isLoading
        ? yourCommunities?.map((community) => {
            const defaultProfileBg = getDefaultCommunityBg({
              communityName: community?.Subreddit.name,
            });

            return (
              <Link
                href={`/r/${community.Subreddit.name}`}
                key={community.subredditId}
                className="flex w-full items-center justify-between rounded-xl border border-default/20 bg-emphasis px-4 py-4"
              >
                <div className="flex items-center gap-3">
                  <span
                    className={cn(
                      "flex aspect-square h-10 w-10 items-center justify-center rounded-full text-2xl font-bold text-zinc-950",
                      defaultProfileBg,
                    )}
                  >
                    r/
                  </span>
                  <div className="flex flex-col gap-2">
                    <h1 className="text-lg font-semibold md:text-xl">
                      r/{community.Subreddit.name}
                    </h1>
                    <p className="text-xs text-subtle">
                      {community.Subreddit._count.subscribers}{" "}
                      {community.Subreddit._count.subscribers > 1
                        ? "members"
                        : "member"}
                    </p>
                  </div>
                </div>
                <SubscribeLeaveToggle
                  isSubscribed={true}
                  subredditId={community?.subredditId}
                  subredditName={community?.Subreddit.name}
                  session={session}
                  disableRefresh={true}
                  disabled={session?.user.id === community?.Subreddit.creatorId}
                />
              </Link>
            );
          })
        : Array.from({ length: 4 }, () => "").map((elem, index) => (
            <CommunitiesSkeleton key={index} />
          ))}
    </>
  );
};

const ExploreCommunities: FC<Communities> = ({ session, sessionStatus }) => {
  const { isLoading: isLoadingCommunities, data: exploreCommunities } =
    trpc.community.exploreCommunities.useQuery();

  const isLoading = isLoadingCommunities || sessionStatus === "loading";

  return (
    <>
      {!isLoading
        ? exploreCommunities?.map((community) => {
            const defaultProfileBg = getDefaultCommunityBg({
              communityName: community?.name,
            });

            return (
              <Link
                href={`/r/${community.name}`}
                key={community.id}
                className="flex w-full items-center justify-between rounded-xl border border-default/20 bg-emphasis px-4 py-4"
              >
                <div className="flex items-center gap-3">
                  <span
                    className={cn(
                      "flex aspect-square h-10 w-10 items-center justify-center rounded-full text-2xl font-bold text-zinc-950",
                      defaultProfileBg,
                    )}
                  >
                    r/
                  </span>
                  <div className="flex flex-col gap-2">
                    <h1 className="text-lg font-semibold md:text-xl">
                      r/{community.name}
                    </h1>
                    <p className="text-xs text-subtle">
                      {community._count.subscribers}{" "}
                      {community._count.subscribers > 1 ? "members" : "member"}
                    </p>
                  </div>
                </div>
                <SubscribeLeaveToggle
                  isSubscribed={false}
                  subredditId={community?.id}
                  subredditName={community?.name}
                  session={session}
                  disableRefresh={true}
                  disabled={session?.user.id === community?.creatorId}
                />
              </Link>
            );
          })
        : Array.from({ length: 4 }, () => "").map((elem, index) => (
            <CommunitiesSkeleton key={index} />
          ))}
    </>
  );
};

const CommunitiesSkeleton = () => {
  return (
    <SkeletonTheme
      baseColor="var(--skeleton-base)"
      highlightColor="var(--skeleton-highlight)"
      duration={2}
      inline={false}
    >
      <div className="flex w-full items-center justify-between rounded-xl bg-emphasis px-4 py-4">
        <div className="inline-flex items-center gap-3">
          <Skeleton
            className="flex aspect-square h-10 w-10 text-2xl"
            circle={true}
          />
          <div className="flex flex-col gap-1">
            <Skeleton
              className="text-lg font-semibold md:text-xl"
              width={"7rem"}
            />
            <Skeleton className="text-xs text-subtle" width={"5rem"} />
          </div>
        </div>
        <Skeleton width={"4.5rem"} height={"1.8rem"} borderRadius={"0.5rem"} />
      </div>
    </SkeletonTheme>
  );
};

export default CommunitiesPage;
