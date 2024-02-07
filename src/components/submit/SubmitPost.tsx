"use client";

import { cn } from "@/lib/utils";
import { $Enums, PostType, Subreddit } from "@prisma/client";
import { motion } from "framer-motion";
import { FC, useState } from "react";
import { Icons } from "../Icons";
import { Separator } from "../ui/Separator";
import CommunitySelector from "./CommunitySelector";
import CreateEditorPost from "./CreateEditorPost";
import CreateLinkPost from "./CreateLinkPost";
import CreateMediaPost from "./CreateMediaPost";

interface SubmitPostProps {
  community: Subreddit | undefined;
  searchParams?: { [key: string]: string | string[] | undefined };
}

const SubmitPost: FC<SubmitPostProps> = ({ community, searchParams }) => {
  const [postType, setPostType] = useState<PostType>(
    searchParams?.media === "true"
      ? "MEDIA"
      : searchParams?.url || searchParams?.url === ""
      ? "LINK"
      : "POST",
  );

  return (
    <div className="mb-16 mt-4 w-full space-y-2 lg:mb-auto">
      <CommunitySelector community={community} />
      <div className="w-full overflow-hidden rounded-xl border border-default/10 bg-emphasis shadow-xl">
        <SubmitPostTypeSelect postType={postType} setPostType={setPostType} />
        <Separator className="bg-highlight/40 dark:bg-highlight/60" />
        <div className="px-5 py-5 lg:p-10 lg:pb-6">
          <CreateEditorPost
            className={cn(postType === "POST" ? "block" : "hidden")}
            communityId={community?.id}
          />
          <CreateMediaPost
            className={cn(postType === "MEDIA" ? "block" : "hidden")}
            communityId={community?.id}
          />
          <CreateLinkPost
            className={cn(postType === "LINK" ? "block" : "hidden")}
            communityId={community?.id}
            initialUrl={(searchParams?.url as string) || ""}
          />
        </div>
      </div>
    </div>
  );
};

interface SubmitPostTypeSelectProps {
  postType: PostType;
  setPostType: React.Dispatch<React.SetStateAction<$Enums.PostType>>;
}

const SubmitPostTypeSelect: FC<SubmitPostTypeSelectProps> = ({
  postType,
  setPostType,
}) => {
  const PostTypes: { name: string; type: PostType }[] = [
    { name: "Post", type: "POST" },
    { name: "Images", type: "MEDIA" },
    { name: "Link", type: "LINK" },
  ];

  return (
    <div className="flex w-full items-center justify-between divide-x divide-highlight/40 overflow-hidden rounded-t-xl text-base dark:divide-highlight/60">
      {PostTypes.map((type) => {
        const isActive = type.type === postType;
        return (
          <button
            key={type.type}
            className={cn(
              "relative flex flex-1 cursor-pointer items-center justify-center gap-2 px-6 py-3 font-semibold",
              isActive
                ? "bg-brand-default/10 text-red-500 transition-colors dark:text-red-400"
                : "text-subtle",
            )}
            onClick={() => setPostType(type.type)}
          >
            {type.type === "POST" ? (
              <Icons.alignJustify
                className="h-3.5 w-3.5 rounded-[2px] p-[1px] outline outline-[1.5px]"
                strokeWidth={3}
              />
            ) : type.type === "MEDIA" ? (
              <Icons.imageIcon className="h-5 w-5" />
            ) : (
              <Icons.link className="h-5 w-5" />
            )}
            {type.name}
            {isActive ? (
              <motion.div
                className="absolute inset-x-0 bottom-0 z-10 h-0.5 rounded-full bg-brand-default"
                layoutId="selectPostType"
                aria-hidden="true"
                transition={{
                  type: "spring",
                  bounce: 0.01,
                  stiffness: 140,
                  damping: 18,
                  duration: 0.2,
                }}
              />
            ) : null}
          </button>
        );
      })}
    </div>
  );
};

export default SubmitPost;
