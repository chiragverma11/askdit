import type { getCommunity } from "@/lib/prismaQueries";
import { cn } from "@/lib/utils";
import { Session } from "next-auth";
import Link from "next/link";
import { FC } from "react";
import CommunityDescription from "./CommunityDescription";
import SubscribeLeaveToggle from "./SubscribeLeaveToggle";
import { buttonVariants } from "./ui/Button";
import { Separator } from "./ui/Separator";

interface InfoSideMenuProps {
  isSubscribed: boolean;
  session: Session | null;
  community: Awaited<ReturnType<typeof getCommunity>>;
}

const InfoSideMenu: FC<InfoSideMenuProps> = ({
  isSubscribed,
  session,
  community,
}) => {
  if (!community) return null;

  const isAuthor = session?.user.id === community.creatorId;

  return (
    <div className="absolute right-[-2rem] top-0 hidden justify-self-end xl:block">
      <div className="fixed flex flex-col gap-4 rounded-xl border border-default/40 bg-emphasis px-4 py-4">
        <div className="flex w-56 flex-col gap-6">
          <div className="flex items-center justify-between">
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
              <p>{community._count.subscribers}</p>
            </div>
            <div className="flex w-full items-center justify-between">
              <p className="text-default/40">Created</p>
              <p>{new Date(community.createdAt).toDateString()}</p>
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
    </div>
  );
};

export default InfoSideMenu;
