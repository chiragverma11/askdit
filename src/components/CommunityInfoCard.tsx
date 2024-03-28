import { cn, getDefaultCommunityBg } from "@/lib/utils";
import { Subreddit } from "@prisma/client";
import { Session } from "next-auth";
import Link from "next/link";
import { FC } from "react";
import CommunityDescription from "./CommunityDescription";
import SubscribeLeaveToggle from "./SubscribeLeaveToggle";
import UserAvatar from "./UserAvatar";
import { buttonVariants } from "./ui/Button";
import { Separator } from "./ui/Separator";

type CommunityInfo = Pick<
  Subreddit,
  "id" | "name" | "description" | "createdAt" | "creatorId" | "image"
> & { subscribersCount: number };

interface CommunityInfoCardProps {
  isSubscribed: boolean;
  session: Session | null;
  communityInfo: CommunityInfo;
  parent: "post" | "community";
}

const CommunityInfoCard: FC<CommunityInfoCardProps> = ({
  isSubscribed,
  session,
  communityInfo: community,
  parent,
}) => {
  if (!community) return null;

  const isAuthor = session?.user.id === community.creatorId;

  return (
    <div className="flex flex-col gap-4 rounded-xl border border-default/40 bg-emphasis px-4 py-4">
      <div className="flex flex-col gap-5">
        <p className="font-bold text-subtle">About Community</p>

        <div className="flex h-auto w-full flex-col items-center gap-4 text-sm">
          {parent === "post" ? (
            <CommunityTitle name={community.name} image={community.image} />
          ) : null}
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
          {parent === "post" ? (
            <SubscribeLeaveToggle
              isSubscribed={isSubscribed}
              isAuthenticated={session ? true : false}
              subredditId={community.id}
              subredditName={community.name}
              className="h-10 w-full"
              disabled={session?.user.id === community?.creatorId}
            />
          ) : null}
          <Link
            href={`/r/${community.name}/submit`}
            className={cn(buttonVariants(), "w-full rounded-lg text-white")}
          >
            Create a Post
          </Link>
        </div>
      </div>
    </div>
  );
};

interface CommunityTitleProps {
  name: string;
  image: string | null;
}

const CommunityTitle: FC<CommunityTitleProps> = ({ name, image }) => {
  return (
    <Link
      href={`/r/${name}`}
      className="flex w-full items-center gap-3"
      prefetch={false}
    >
      {image ? (
        <UserAvatar className="h-12 w-12" user={{ name: name, image: image }} />
      ) : (
        <span
          className={cn(
            "flex aspect-square h-12 w-12 items-center justify-center rounded-full text-2xl font-bold text-zinc-950",
            getDefaultCommunityBg({
              communityName: name,
            }),
          )}
        >
          r/
        </span>
      )}
      <p className="text-lg font-bold">r/{name}</p>
    </Link>
  );
};

export default CommunityInfoCard;
