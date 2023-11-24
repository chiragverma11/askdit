"use client";

import SubscribeLeaveToggle from "@/components/SubscribeLeaveToggle";
import { trpc } from "@/lib/trpc";
import { cn, getDefaultCommunityBg } from "@/lib/utils";
import { motion } from "framer-motion";
import { Session } from "next-auth";
import Link from "next/link";
import { FC } from "react";
import "react-loading-skeleton/dist/skeleton.css";
import CommunitiesFallback from "./CommunitiesFallback";

interface YourCommunitiesProps {
  session: Session | null;
}

const YourCommunities: FC<YourCommunitiesProps> = ({ session }) => {
  const { isLoading: isLoading, data: yourCommunities } =
    trpc.community.yourCommunities.useQuery();

  if (!isLoading && yourCommunities?.length === 0) {
    return <CommunitiesFallback type="nocontent" parent="YourCommunities" />;
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
            <CommunitiesFallback type="loading" key={index} />
          ))}
    </>
  );
};

export default YourCommunities;
