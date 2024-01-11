import { db } from "@/lib/db";
import { Session } from "next-auth";
import Link from "next/link";
import { FC } from "react";
import Skeleton, { SkeletonTheme } from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import CommunityAvatar from "../CommunityAvatar";
import SubscribeLeaveToggle from "../SubscribeLeaveToggle";

interface UserModeratorsCardProps {
  userId: string;
  session: Session | null;
}

const UserModeratorsCard: FC<UserModeratorsCardProps> = async ({
  userId,
  session,
}) => {
  const moderatingCommunities = await db.subreddit.findMany({
    where: {
      creatorId: userId,
    },
    select: {
      id: true,
      name: true,
      image: true,
      _count: {
        select: {
          subscribers: true,
        },
      },
      subscribers: {
        where: {
          userId: session?.user.id,
        },
      },
    },
  });

  return (
    <div className="flex flex-col gap-4 rounded-xl border border-default/40 bg-emphasis px-4 py-4">
      <div className="flex flex-col gap-4">
        <p className="text-sm font-bold text-subtle">
          {session?.user.id === userId ? "You're are moderator" : "Moderator"}{" "}
          of these communities
        </p>
        <ul className="flex h-auto w-full flex-col gap-2 text-sm">
          {moderatingCommunities.map((community) => (
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
                session={session}
                subredditId={community.id}
                subredditName={community.name}
                disabled={session?.user.id === userId}
                disableRefresh={true}
              />
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

interface UserModeratorCardSkeletonProps {
  isUserSelf: boolean;
}

export const UserModeratorCardSkeleton: FC<UserModeratorCardSkeletonProps> = ({
  isUserSelf,
}) => {
  return (
    <SkeletonTheme
      baseColor="var(--skeleton-base)"
      highlightColor="var(--skeleton-highlight)"
      duration={2}
      inline={false}
    >
      <div className="flex flex-col gap-4 rounded-xl border border-default/40 bg-emphasis px-4 py-4">
        <div className="flex flex-col gap-4">
          <p className="text-sm font-bold text-subtle">
            {isUserSelf ? "You're are moderator" : "Moderator"} of these
            communities
          </p>
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

export default UserModeratorsCard;
