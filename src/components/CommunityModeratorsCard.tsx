import { User } from "@prisma/client";
import Link from "next/link";
import { FC } from "react";
import UserAvatar from "./UserAvatar";

interface CommunityModeratorsCardProps {
  moderators: Pick<User, "name" | "username" | "image">[];
}

const CommunityModeratorsCard: FC<CommunityModeratorsCardProps> = ({
  moderators,
}) => {
  return (
    <div className="flex flex-col gap-4 rounded-xl border border-default/40 bg-emphasis px-4 py-4">
      <div className="flex flex-col gap-4">
        <p className="font-bold text-subtle">Moderators</p>
        <div className="flex h-auto w-full flex-col gap-2 text-sm">
          {moderators.map((moderator) => (
            <Link
              href={`/u/${moderator.username}`}
              className="flex items-center gap-2"
              key={moderator.username}
            >
              <UserAvatar
                className="h-6 w-6"
                user={{ name: moderator.name, image: moderator.image }}
              />
              <div className="flex flex-col">
                <span className="text-sm hover:underline">
                  u/{moderator.username}
                </span>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
};

export default CommunityModeratorsCard;
