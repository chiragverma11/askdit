"use client";

import { FC, useCallback } from "react";
import HorizontalMenu from "../HorizontalMenu";

interface SearchTypeSelectorProps {
  query: string;
  type: string;
}

const SearchTypeSelector: FC<SearchTypeSelectorProps> = ({ query, type }) => {
  const menuItems: Parameters<typeof HorizontalMenu>[0]["items"] = [
    { name: "Posts", href: `/search?q=${query}&type=post` },
    { name: "Comments", href: `/search?q=${query}&type=comment` },
    { name: "Communities", href: `/search?q=${query}&type=community` },
    { name: "People", href: `/search?q=${query}&type=user` },
  ];

  const checkIsActive = useCallback(
    (item: (typeof menuItems)[number]) => {
      const itemType = item.href.split("&type=")[1];

      if (!itemType) return false;

      return itemType === type;
    },
    [type],
  );

  return <HorizontalMenu items={menuItems} isActive={checkIsActive} />;
};

export default SearchTypeSelector;
