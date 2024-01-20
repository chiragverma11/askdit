"use client";

import { cn } from "@/lib/utils";
import { FC } from "react";
import { WebShare } from "../share/WebShare";
import { Icons } from "../Icons";

interface ShareUserProfileButtonProps
  extends React.ComponentPropsWithoutRef<"button"> {
  title: string;
  profileUrl?: string;
}

const ShareUserProfileButton: FC<ShareUserProfileButtonProps> = ({
  title,
  profileUrl,
  className,
}) => {
  return (
    <WebShare
      data={{
        title: title,
        url: profileUrl,
      }}
      disableNative={true}
    >
      <button className={cn("inline-flex items-center", className)}>
        <Icons.share className="h-5 w-5" />
      </button>
    </WebShare>
  );
};

export default ShareUserProfileButton;
