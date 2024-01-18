"use client";

import { FC } from "react";
import PostSkeleton from "../PostSkeleton";
import { UserCommentSkeleton } from "./UserComment";

const userProfileMenus = [
  "posts",
  "comments",
  "saved",
  "upvoted",
  "downvoted",
] as const;

const menuBasedMessage = {
  posts: "posted",
  comments: "commented on",
  saved: "saved",
  upvoted: "upvoted",
  downvoted: "downvoted",
};

type UserMenus = (typeof userProfileMenus)[number];

interface NoUserContentProps {
  isUserSelf: boolean;
  username: string;
  profileMenu: UserMenus;
}

const NoUserContent: FC<NoUserContentProps> = ({
  isUserSelf,
  username,
  profileMenu,
}) => {
  const messagePrefix = `${
    isUserSelf ? "hmm... looks like you" : `u/${username}`
  } haven't `;
  const messageSuffix = `${menuBasedMessage[profileMenu]} anything yet.`;

  return (
    <div className="relative overflow-hidden rounded-lg">
      <ul
        className="pointer-events-none mb-16 select-none space-y-1 opacity-80 sm:space-y-2 lg:mb-0"
        aria-hidden="true"
      >
        {Array.from({ length: 4 }).map((_, index) => (
          <li key={index}>
            {profileMenu === "comments" ? (
              <UserCommentSkeleton disableAnimation={true} />
            ) : (
              <PostSkeleton variant="compact" disableAnimation={true} />
            )}
          </li>
        ))}
      </ul>
      <div className="absolute inset-0 bg-default/50 px-8 text-center">
        <span className="mt-64 block text-lg font-semibold">
          {messagePrefix + messageSuffix}
        </span>
      </div>
    </div>
  );
};

export default NoUserContent;