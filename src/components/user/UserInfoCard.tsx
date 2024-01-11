import { cn } from "@/lib/utils";
import { User } from "@prisma/client";
import { Session } from "next-auth";
import Link from "next/link";
import { FC } from "react";
import { Icons } from "../Icons";
import UserAvatar from "../UserAvatar";
import { buttonVariants } from "../ui/Button";
import { Separator } from "../ui/Separator";

type UserInfo = Pick<User, "id" | "name" | "username" | "image">;

interface UserInfoCardProps {
  session: Session | null;
  userInfo: UserInfo;
}

const UserInfoCard: FC<UserInfoCardProps> = ({ session, userInfo }) => {
  if (!userInfo) return null;

  return (
    <div className="flex flex-col gap-4 rounded-xl border border-default/40 bg-emphasis px-4 py-4">
      <div className="flex flex-col gap-5">
        <div className="flex h-auto w-full flex-col items-center gap-4 text-sm">
          <UserTitle
            name={userInfo.name}
            image={userInfo.image}
            username={userInfo.username}
            isUserSelf={session?.user.id === userInfo.id}
          />

          <Separator />

          <Link
            href={`/submit`}
            className={cn(buttonVariants(), "w-full rounded-lg text-white")}
          >
            New Post
          </Link>
        </div>
      </div>
    </div>
  );
};

interface UserTitleProps {
  name: string | null;
  username: string | null;
  image: string | null;
  isUserSelf: boolean;
}

const UserTitle: FC<UserTitleProps> = ({
  name,
  username,
  image,
  isUserSelf,
}) => {
  return (
    <div className="flex w-full items-center gap-3">
      <UserAvatar className="h-14 w-14" user={{ name: name, image: image }} />
      <div className="flex flex-col">
        <p className="text-base font-semibold">{name}</p>
        <p className="font-medium text-subtle">u/{username}</p>
      </div>
      {isUserSelf ? (
        <Link href="/settings/profile" className="ml-auto">
          <Icons.settings className="h-5 w-5 text-default/80 transition-transform duration-200 ease-in-out hover:rotate-90" />
        </Link>
      ) : null}
    </div>
  );
};

export default UserInfoCard;
