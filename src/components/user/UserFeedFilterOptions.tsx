"use client";

import { useSelectedLayoutSegment } from "next/navigation";
import { FC } from "react";
import FeedFilterOptions from "../FeedFilterOptions";

interface UserFeedFilterOptionsProps {}

const UserFeedFilterOptions: FC<UserFeedFilterOptionsProps> = ({}) => {
  const segment = useSelectedLayoutSegment();

  if (segment === "comments") return null;

  return <FeedFilterOptions />;
};

export default UserFeedFilterOptions;
