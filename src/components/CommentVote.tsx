"use client";

import { trpc } from "@/lib/trpc";
import { cn } from "@/lib/utils";
import { VoteType } from "@prisma/client";
import { ArrowBigDown, ArrowBigUp } from "lucide-react";
import { FC, HTMLAttributes, useEffect, useState } from "react";

interface CommentVoteProps extends HTMLAttributes<HTMLSpanElement> {
  commentId: string;
  initialVotesAmt: number;
  initialVoteType?: VoteType;
  onNotLoggedIn?: () => void;
}

const CommentVote: FC<CommentVoteProps> = ({
  commentId,
  initialVotesAmt,
  initialVoteType,
  onNotLoggedIn,
  className,
  ...props
}) => {
  const [votesAmt, setVotesAmt] = useState<number>(initialVotesAmt);
  const [currentVoteType, setCurrentVoteType] = useState(initialVoteType);

  //To sync intialVoteType with setCurrentVoteType, b'coz initially initialVoteType will be undefined than later it gets value
  useEffect(() => {
    setCurrentVoteType(initialVoteType);
  }, [initialVoteType]);

  const { mutate: vote } = trpc.comment.voteComment.useMutation({
    onMutate: ({ voteType }) => {
      if (currentVoteType === voteType) {
        setCurrentVoteType(undefined);
        if (voteType === "UP") {
          setVotesAmt((prev) => prev - 1);
        } else if (voteType === "DOWN") {
          setVotesAmt((prev) => prev + 1);
        }
      } else {
        setCurrentVoteType(voteType);
        if (voteType === "UP") {
          setVotesAmt((prev) => prev + (currentVoteType ? 2 : 1));
        } else if (voteType === "DOWN") {
          setVotesAmt((prev) => prev - (currentVoteType ? 2 : 1));
        }
      }
    },
    onError: () => {
      setVotesAmt(initialVotesAmt);
      setCurrentVoteType(initialVoteType);
    },
  });

  return (
    <span
      className={cn(
        "inline-flex cursor-default items-center gap-1 rounded-3xl",
        className,
      )}
      onClick={(e) => {
        e.preventDefault();
      }}
      {...props}
    >
      <span
        className="group/upvote flex aspect-square h-8 w-8 cursor-pointer items-center justify-center rounded-full hover:bg-red-400/10 dark:hover:bg-red-400/5"
        onClick={
          onNotLoggedIn
            ? onNotLoggedIn
            : () => {
                vote({ commentId, voteType: "UP" });
              }
        }
      >
        <ArrowBigUp
          className={cn(
            "h-6 w-6",
            currentVoteType === "UP"
              ? "fill-red-500 text-red-500"
              : "text-inherit group-hover/upvote:text-red-600/75",
          )}
          strokeWidth={1.5}
        />
      </span>
      <div className="flex items-center justify-center">
        <span
          className={cn(
            "absolute",
            currentVoteType === "UP"
              ? "text-red-500"
              : currentVoteType === "DOWN"
              ? "text-indigo-500"
              : "text-inherit",
          )}
        >
          {votesAmt}
        </span>
      </div>
      <span
        className="group/downvote flex aspect-square h-8 w-8 cursor-pointer items-center justify-center rounded-full hover:bg-indigo-400/10 dark:hover:bg-indigo-400/5"
        onClick={
          onNotLoggedIn
            ? onNotLoggedIn
            : () => {
                vote({ commentId, voteType: "DOWN" });
              }
        }
      >
        <ArrowBigDown
          className={cn(
            "h-6 w-6",
            currentVoteType === "DOWN"
              ? "fill-indigo-500 text-indigo-500"
              : "text-inherit group-hover/downvote:text-indigo-600/75",
          )}
          strokeWidth={1.5}
        />
      </span>
    </span>
  );
};

export default CommentVote;
