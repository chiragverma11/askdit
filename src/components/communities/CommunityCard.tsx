import { Subreddit } from "@prisma/client";
import { Session } from "next-auth";
import Link from "next/link";
import { FC } from "react";
import CommunityAvatar from "../CommunityAvatar";
import SubscribeLeaveToggle from "../SubscribeLeaveToggle";
interface CommunityCardProps {
  community: Subreddit & {
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
