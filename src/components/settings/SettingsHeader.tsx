"use client";

import { useSelectedLayoutSegment } from "next/navigation";
import { FC } from "react";
import HorizontalMenu from "../HorizontalMenu";

const settingsMenus = ["Account", "Profile"] as const;

interface SettingsHeaderProps {}

const capitalizeFirstChar = (str: string) => {
  if (!str) {
    return "";
  }
  return str.charAt(0).toUpperCase() + str.slice(1);
};

const SettingsHeader: FC<SettingsHeaderProps> = ({}) => {
  const segment = useSelectedLayoutSegment();

  const activeMenu = segment ? capitalizeFirstChar(segment) : "Account";

  return (
    <HorizontalMenu
      menuId="settings"
      items={settingsMenus.map((menu) => ({
        name: menu,
        href: `/settings/${menu !== "Account" ? menu.toLowerCase() : ""}`,
      }))}
      isActive={(item) => item.name === activeMenu}
    />
  );
};

export default SettingsHeader;
