"use client";

import AsideBar from "@/components/AsideBar";
import AuthLink from "@/components/AuthLink";
import SubscribeLeaveToggle from "@/components/SubscribeLeaveToggle";
import { buttonVariants } from "@/components/ui/Button";
import { trpc } from "@/lib/trpc";
import { cn, getDefaultCommunityBg } from "@/lib/utils";
import { AnimatePresence, motion } from "framer-motion";
import { Metadata } from "next";
import { Session } from "next-auth";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { FC, useState } from "react";
import Skeleton, { SkeletonTheme } from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";

export const metadata: Metadata = {
  title: "Communities",
};

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
              <AnimatePresence>
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
              </AnimatePresence>
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
  if (sessionStatus === "unauthenticated") {
    return <UnauthenticatedFallback />;
  }

  const { isLoading: isLoadingCommunities, data: yourCommunities } =
    trpc.community.yourCommunities.useQuery();

  const isLoading = isLoadingCommunities || sessionStatus === "loading";

  if (!isLoading && yourCommunities?.length === 0) {
    return <NoContent parent="YourCommunities" />;
  }

  return (
    <>
      {!isLoading
        ? yourCommunities?.map((community) => {
            const defaultProfileBg = getDefaultCommunityBg({
              communityName: community?.Subreddit.name,
            });

            return (
              <motion.div
                key={community.subredditId}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="w-full rounded-xl border border-default/20 bg-emphasis px-4 py-4"
              >
                <Link
                  href={`/r/${community.Subreddit.name}`}
                  className="flex w-full items-center justify-between"
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
                    disabled={
                      session?.user.id === community?.Subreddit.creatorId
                    }
                  />
                </Link>
              </motion.div>
            );
          })
        : Array.from({ length: 4 }, () => "").map((elem, index) => (
            <CommunitiesSkeleton key={index} />
          ))}
    </>
  );
};

const ExploreCommunities: FC<Communities> = ({ session, sessionStatus }) => {
  if (sessionStatus === "unauthenticated") {
    return <UnauthenticatedFallback />;
  }

  const { isLoading: isLoadingCommunities, data: exploreCommunities } =
    trpc.community.exploreCommunities.useQuery();

  const isLoading = isLoadingCommunities || sessionStatus === "loading";

  if (!isLoading && exploreCommunities?.length === 0) {
    return <NoContent parent="ExploreCommunities" />;
  }

  return (
    <>
      {!isLoading
        ? exploreCommunities?.map((community) => {
            const defaultProfileBg = getDefaultCommunityBg({
              communityName: community?.name,
            });

            return (
              <motion.div
                key={community.id}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="w-full rounded-xl border border-default/20 bg-emphasis px-4 py-4"
              >
                <Link
                  href={`/r/${community.name}`}
                  className="flex w-full items-center justify-between"
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
                        {community._count.subscribers > 1
                          ? "members"
                          : "member"}
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
              </motion.div>
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

const UnauthenticatedFallback = () => {
  return (
    <div className="flex flex-col items-center gap-4 p-4">
      <p className="font-medium text-default">
        Sign In to explore & Join Communities
      </p>
      <AuthLink href="/sign-in" className={cn(buttonVariants({ size: "sm" }))}>
        {" "}
        Sign In
      </AuthLink>
    </div>
  );
};

const NoContent = ({
  parent,
}: {
  parent: "YourCommunities" | "ExploreCommunities";
}) => {
  if (parent === "YourCommunities") {
    return (
      <div className="flex flex-col items-center gap-4 p-4">
        <p className="font-medium text-default">
          You haven&apos;t joined any community yet
        </p>
        <p className="font-medium text-default">
          Click Explore to find communties
        </p>
      </div>
    );
  } else if (parent === "ExploreCommunities") {
    return (
      <div className="flex flex-col items-center gap-4 p-4">
        <p className="font-medium text-default">
          There are no commmunites to join.
        </p>
        <Link
          href="/communities/create"
          className={cn(buttonVariants({ size: "sm" }))}
        >
          Create One
        </Link>
      </div>
    );
  }
};

export default CommunitiesPage;
