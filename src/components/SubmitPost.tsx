"use client";

import { cn } from "@/lib/utils";
import { $Enums, PostType } from "@prisma/client";
import { motion } from "framer-motion";
import { AlignJustify, ImageIcon, LinkIcon } from "lucide-react";
import { FC, useState } from "react";
import Editor from "./Editor";
import { Separator } from "./ui/Separator";
import CreateLinkPost from "./CreateLinkPost";

interface SubmitPostProps {
  communityId: string;
}

const SubmitPost: FC<SubmitPostProps> = ({ communityId }) => {
  const [postType, setPostType] = useState<PostType>("POST");

  return (
    <div className="my-4 mb-16 w-full rounded-xl border-zinc-200 bg-emphasis shadow-xl">
      <SubmitPostTypeSelect postType={postType} setPostType={setPostType} />
      <Separator className="bg-highlight/40 dark:bg-highlight/60" />
      <div className="px-5 py-5 lg:p-10 lg:pb-6">
        <Editor
          className={cn(postType === "POST" ? "block" : "hidden")}
          communityId={communityId}
        />
        <PostImages
          className={cn(postType === "IMAGES" ? "block" : "hidden")}
        />
        <CreateLinkPost
          className={cn(postType === "LINK" ? "block" : "hidden")}
          communityId={communityId}
        />
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
    { name: "Images", type: "IMAGES" },
    { name: "Link", type: "LINK" },
  ];

  return (
    <div className="flex w-full items-center justify-between divide-x divide-highlight/40 overflow-hidden rounded-t-xl text-base dark:divide-highlight/60">
      {PostTypes.map((type) => {
        const isActive = type.type === postType;
        return (
          <span
            key={type.type}
            className={cn(
              "relative flex flex-1 cursor-pointer items-center justify-center gap-2 px-6 py-3 font-semibold",
              isActive ? "text-red-500 dark:text-red-400" : "text-subtle",
            )}
            onClick={() => setPostType(type.type)}
          >
            {type.type === "POST" ? (
              <AlignJustify
                className="h-3.5 w-3.5 rounded-[2px] p-[1px] outline outline-[1.5px]"
                strokeWidth={3}
              />
            ) : type.type === "IMAGES" ? (
              <ImageIcon className="h-5 w-5" />
            ) : (
              <LinkIcon className="h-5 w-5" />
            )}
            {type.name}
            {isActive ? (
              <motion.div
                className="absolute inset-0 border-b-2 border-red-500 bg-brand-default/10"
                layoutId="selectPostType"
                aria-hidden="true"
                transition={{
                  type: "spring",
                  bounce: 0.01,
                  stiffness: 140,
                  damping: 18,
                  duration: 0.25,
                }}
              />
            ) : null}
          </span>
        );
      })}
    </div>
  );
};

interface PostImagesProps extends React.HTMLAttributes<HTMLDivElement> {}

const PostImages: FC<PostImagesProps> = ({ className }) => {
  return <div className={cn(className)}>PostImages</div>;
};

export default SubmitPost;
