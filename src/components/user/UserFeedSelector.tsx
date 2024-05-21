"use client";

import { useSelectedLayoutSegments } from "next/navigation";
import { FC } from "react";
import HorizontalMenu from "../HorizontalMenu";

const userProfileMenus = [
  "Posts",
  "Comments",
  "Saved",
  "Questions",
  "Answers",
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
  const segments = useSelectedLayoutSegments();
  const segment = segments[1];
  const currentMenu = segment ? capitalizeFirstChar(segment) : "Posts";

  const activeMenu: UserMenus = currentMenu as UserMenus;

  const menus = isUserSelf
    ? userProfileMenus
    : userProfileMenus.filter((menu) => !privateMenus.includes(menu));

  return (
    <HorizontalMenu
      menuId="userFeedSelector"
      items={menus.map((menu) => ({
        name: menu,
        href: `/u/${username}/${menu !== "Posts" ? menu.toLowerCase() : ""}`,
      }))}
      isActive={(item) => item.name === activeMenu}
      className="mb-4"
    />
  );
};

export default UserFeedSelector;
