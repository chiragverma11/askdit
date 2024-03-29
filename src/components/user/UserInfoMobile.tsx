"use client";

import { useMounted } from "@/hooks/use-mounted";
import { trpc } from "@/lib/trpc";
import { cn } from "@/lib/utils";
import { User } from "@prisma/client";
import { Session } from "next-auth";
import Link from "next/link";
import { FC, useState } from "react";
import CommunityAvatar from "../CommunityAvatar";
import { Icons } from "../Icons";
import SubscribeLeaveToggle from "../SubscribeLeaveToggle";
import UserAvatar from "../UserAvatar";
import { Button } from "../ui/Button";
import ShareUserProfileButton from "./ShareUserProfileButton";
import { UserModeratorCardSkeleton } from "./UserModeratorCard";

type UserInfo = Pick<User, "id" | "name" | "username" | "image">;

interface UserInfoMobileProps extends React.ComponentPropsWithoutRef<"div"> {
  session: Session | null;
  userInfo: UserInfo;
}

const UserInfoMobile: FC<UserInfoMobileProps> = ({
  session,
  userInfo,
  className,
}) => {
  const [seeMore, setSeeMore] = useState(false);
  const mounted = useMounted();

  return (
    <div
      className={cn(
        "flex flex-col gap-4 rounded-xl px-4 py-4 lg:hidden",
        className,
      )}
    >
      <div className="flex w-full flex-col gap-2">
        <div className="flex w-full items-center gap-3">
          <UserAvatar
            className="h-[5.5rem] w-[5.5rem]"
            user={{ name: userInfo.name, image: userInfo.image }}
          />
          {session?.user.id === userInfo.id ? (
            <Link
              href="/settings/profile"
              className="ml-auto rounded-full bg-emphasis/70 p-1.5"
            >
              <Icons.settings className="h-5 w-5 text-default/80 transition-transform duration-200 ease-in-out hover:rotate-90" />
            </Link>
          ) : (
            <ShareUserProfileButton
              title={`${userInfo.name} (${userInfo.username}) | Askdit`}
              profileUrl={mounted ? window.location.href : ""}
              className="ml-auto rounded-full bg-emphasis/70 p-1.5 text-default/80"
            />
          )}
        </div>
        <div className="flex flex-col">
          <p className="text-2xl font-semibold">{userInfo.name}</p>
          <p className="text-xs text-subtle">u/{userInfo.username}</p>
        </div>
      </div>
      <Button
        variant={"outline"}
        size={"xs"}
        onClick={() => setSeeMore(!seeMore)}
        className="w-fit rounded-3xl border border-default px-2 text-xs font-semibold ring-0"
      >
        See {seeMore ? "Less" : "More"}
      </Button>

      {seeMore ? <MoreInfo session={session} userInfo={userInfo} /> : null}
    </div>
  );
};

interface MoreInfoProps extends UserInfoMobileProps {}

const MoreInfo: FC<MoreInfoProps> = ({ session, userInfo }) => {
  return (
    <div className="">
      <UserModeratorsCard
        userId={userInfo?.id}
        session={session}
        className=""
      />
    </div>
  );
};

interface UserModeratorsCardProps
  extends React.ComponentPropsWithoutRef<"div"> {
  userId: string;
  session: Session | null;
}

const UserModeratorsCard: FC<UserModeratorsCardProps> = ({
  userId,
  session,
  className,
}) => {
  const { data: moderatingCommunities, isLoading } =
    trpc.community.moderatingCommunities.useQuery({
      creatorId: userId,
      currentUserId: session?.user.id,
    });

  if (isLoading) {
    return (
      <UserModeratorCardSkeleton isUserSelf={session?.user.id === userId} />
    );
  }

  if (moderatingCommunities?.length === 0) {
    return null;
  }

  return (
    <div
      className={cn(
        "flex flex-col gap-4 rounded-xl border border-default/40 bg-emphasis px-4 py-4",
        className,
      )}
    >
      <div className="flex flex-col gap-4">
        <p className="text-sm font-bold text-subtle">
          {session?.user.id === userId ? "You're are moderator" : "Moderator"}{" "}
          of these communities
        </p>
        <ul className="flex h-auto w-full flex-col gap-2 text-sm">
          {moderatingCommunities?.map((community) => (
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

export default UserInfoMobile;
