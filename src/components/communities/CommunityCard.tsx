import { cn, getDefaultCommunityBg } from "@/lib/utils";
import { ChangeTypeOfKeys } from "@/types/utilities";
import { Subreddit } from "@prisma/client";
import { Session } from "next-auth";
import Link from "next/link";
import { FC } from "react";
import SubscribeLeaveToggle from "../SubscribeLeaveToggle";
import UserAvatar from "../UserAvatar";

interface CommunityCardProps {
  community: ChangeTypeOfKeys<Subreddit, "createdAt" | "updatedAt", string> & {
    _count: { subscribers: number };
  };
  session: Session | null;
  isSubscribed: boolean;
}

const CommunityCard: FC<CommunityCardProps> = ({
  community,
  session,
  isSubscribed,
}) => {
  return (
    <div
      key={community.id}
      className="w-full rounded-xl border border-default/20 bg-emphasis px-4 py-4"
    >
      <Link
        href={`/r/${community.name}`}
        className="flex w-full items-center justify-between"
      >
        <div className="flex items-center gap-3">
          {community.image ? (
            <UserAvatar
              user={{ name: community.name, image: community.image }}
              className="h-10 w-10"
            />
          ) : (
            <span
              className={cn(
                "flex aspect-square h-10 w-10 items-center justify-center rounded-full text-2xl font-bold text-zinc-950",
                getDefaultCommunityBg({
                  communityName: community.name,
                }),
              )}
            >
              r/
            </span>
          )}
          <div className="flex flex-col">
            <h1 className="text-lg font-semibold md:text-xl">
              r/{community.name}
            </h1>
            <p className="text-xs text-subtle">
              {`${community._count.subscribers} ${
                community._count.subscribers > 1 ? "members" : "member"
              }`}
            </p>
          </div>
        </div>
        <SubscribeLeaveToggle
          isSubscribed={isSubscribed}
          subredditId={community.id}
          subredditName={community.name}
          session={session}
          disableRefresh={true}
          disabled={session?.user.id === community.creatorId}
        />
      </Link>
    </div>
  );
};

export default CommunityCard;
