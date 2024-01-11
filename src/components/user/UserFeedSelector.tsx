"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { useSelectedLayoutSegment } from "next/navigation";
import { FC } from "react";

const userProfileMenus = [
  "Posts",
  "Comments",
  "Saved",
  "Upvoted",
  "Downvoted",
] as const;

const privateMenus = ["Saved", "Upvoted", "Downvoted"];

type UserMenus = (typeof userProfileMenus)[number];

interface UserFeedSelectorProps {
  isUserSelf: boolean;
  username: string;
}

const capitalizeFirstChar = (str: string) => {
  if (!str) {
    return "";
  }
  return str.charAt(0).toUpperCase() + str.slice(1);
};

const UserFeedSelector: FC<UserFeedSelectorProps> = ({
  isUserSelf,
  username,
}) => {
  const segment = useSelectedLayoutSegment();
  const currentMenu = segment ? capitalizeFirstChar(segment) : "Posts";

  const activeMenu: UserMenus = currentMenu as UserMenus;

  const menus = isUserSelf
    ? userProfileMenus
    : userProfileMenus.filter((menu) => !privateMenus.includes(menu));

  return (
    <ul className="mb-1 flex max-w-[100vw] shrink items-center gap-4 overflow-x-scroll px-4 pb-3 sm:overflow-x-auto lg:gap-8">
      {menus.map((menuName) => {
        const isActive = menuName === activeMenu;
        const menu = menuName as typeof activeMenu;

        return (
          <li key={menuName}>
            <Link
              href={`/u/${username}/${
                menuName !== "Posts" ? menuName.toLowerCase() : ""
              }`}
              className="relative font-semibold text-default lg:text-lg"
            >
              {menuName}
              {isActive ? (
                <motion.div
                  className="absolute inset-x-0 -bottom-1.5 -z-10 h-1 rounded-md bg-primary"
                  layoutId="userProfileMenu"
                  aria-hidden="true"
                  transition={{
                    type: "spring",
                    bounce: 0.01,
                    stiffness: 140,
                    damping: 18,
                    duration: 0.3,
                  }}
                />
              ) : null}
            </Link>
          </li>
        );
      })}
    </ul>
  );
};

export default UserFeedSelector;
