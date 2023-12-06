import { cn } from "@/lib/utils";
import { Subreddit } from "@prisma/client";
import { Session } from "next-auth";
import Link from "next/link";
import { FC } from "react";
import CommunityDescription from "./CommunityDescription";
import SubscribeLeaveToggle from "./SubscribeLeaveToggle";
import { buttonVariants } from "./ui/Button";
import { Separator } from "./ui/Separator";

type CommunityInfo = Pick<
  Subreddit,
  "id" | "name" | "description" | "createdAt" | "creatorId"
> & { subscribersCount: number };

interface CommunityInfoCardProps {
  isSubscribed: boolean;
  session: Session | null;
  communityInfo: CommunityInfo;
}

const CommunityInfoCard: FC<CommunityInfoCardProps> = ({
  isSubscribed,
  session,
  communityInfo: community,
}) => {
  if (!community) return null;

  const isAuthor = session?.user.id === community.creatorId;

  return (
    <div className="sticky top-[72px] flex flex-col gap-4 rounded-xl border border-default/40 bg-emphasis px-4 py-4">
      <div className="flex flex-col gap-6">
        <div className="flex w-full items-center justify-between">
          <p className="text-lg font-bold">r/{community?.name}</p>
          <SubscribeLeaveToggle
            isSubscribed={isSubscribed}
            subredditId={community?.id}
            subredditName={community?.name}
            session={session}
            className="hidden lg:inline-flex"
            disabled={isAuthor}
          />
        </div>
        <div className="flex h-auto w-full flex-col items-center gap-4 text-sm">
          <CommunityDescription
            initialDescription={community.description}
            communityId={community.id}
            isAuthor={isAuthor}
          />
          <div className="flex w-full items-center justify-between">
            <p className="text-default/40">Members</p>
            <p>{community.subscribersCount}</p>
          </div>
          <div className="flex w-full items-center justify-between">
            <p className="text-default/40">Created</p>
            <p>
              {new Date(community.createdAt).toLocaleDateString(undefined, {
                month: "short",
                day: "numeric",
                year: "numeric",
              })}
            </p>
          </div>
          <Separator />
          <Link
            href={`/r/${community.name}/submit`}
            className={cn(buttonVariants(), "w-full text-white")}
          >
            Create a Post
          </Link>
        </div>
      </div>
    </div>
  );
};

export default CommunityInfoCard;
