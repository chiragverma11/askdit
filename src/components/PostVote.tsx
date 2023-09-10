"use client";

import { cn } from "@/lib/utils";
import { ThumbsDown, ThumbsUp } from "lucide-react";
import { FC, HTMLAttributes } from "react";

interface PostVoteProps extends HTMLAttributes<HTMLSpanElement> {
  votesAmt: number;
}

const PostVote: FC<PostVoteProps> = ({ votesAmt, className, ...props }) => {
  return (
    <span
      className={cn(
        "inline-flex cursor-default items-center rounded-3xl bg-subtle",
        className,
      )}
      onClick={(e) => {
        e.preventDefault();
      }}
      {...props}
    >
      <span className="group/upvote flex aspect-square h-8 w-10 cursor-pointer items-center justify-center rounded-full hover:bg-red-400/10 dark:hover:bg-red-400/5">
        <ThumbsUp
          className="h-4 w-4 group-hover/upvote:text-red-600/75"
          strokeWidth={2.25}
        />
      </span>
      <span>{votesAmt}</span>
      <span className="group/downvote flex aspect-square h-8 w-10 cursor-pointer items-center justify-center rounded-full hover:bg-indigo-400/10 dark:hover:bg-indigo-400/5">
        <ThumbsDown
          className="h-4 w-4 group-hover/downvote:text-indigo-600/75"
          strokeWidth={2.25}
        />
      </span>
    </span>
  );
};

export default PostVote;
