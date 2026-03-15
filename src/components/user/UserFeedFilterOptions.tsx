"use client";

import { useSelectedLayoutSegment } from "next/navigation";
import FeedFilterOptions from "../FeedFilterOptions";

const UserFeedFilterOptions = () => {
  const segment = useSelectedLayoutSegment();

  if (segment === "comments") return null;

  return <FeedFilterOptions />;
};

export default UserFeedFilterOptions;
