"use client";

import { trpc } from "@/lib/trpc";
import { cn } from "@/lib/utils";
import { VoteType } from "@prisma/client";
import { ArrowBigDown, ArrowBigUp } from "lucide-react";
import { FC, HTMLAttributes, useEffect, useState } from "react";
import AuthLink from "./AuthLink";

interface PostVoteProps extends HTMLAttributes<HTMLSpanElement> {
  postId: string;
  initialVotesAmt: number;
  initialVoteType?: VoteType;
  isLoggedIn: boolean;
}

const PostVote: FC<PostVoteProps> = ({
  postId,
  initialVotesAmt,
  initialVoteType,
  isLoggedIn,
  className,
  ...props
}) => {
  const [votesAmt, setVotesAmt] = useState<number>(initialVotesAmt);
  const [currentVoteType, setCurrentVoteType] = useState(initialVoteType);

  //To sync intialVoteType with setCurrentVoteType, b'coz initially initialVoteType will be undefined than later it gets value
  useEffect(() => {
    setCurrentVoteType(initialVoteType);
  }, [initialVoteType]);

  const { mutate: vote } = trpc.post.votePost.useMutation({
    onMutate: ({ voteType }) => {
      if (currentVoteType === voteType) {
        setCurrentVoteType(undefined);
        if (voteType === "UP") {
          console.log("first");
          setVotesAmt((prev) => prev - 1);
        } else if (voteType === "DOWN") {
          console.log("second");

          setVotesAmt((prev) => prev + 1);
        }
      } else {
        setCurrentVoteType(voteType);
        if (voteType === "UP") {
          console.log("third");

          setVotesAmt((prev) => prev + (currentVoteType ? 2 : 1));
        } else if (voteType === "DOWN") {
          console.log("fourth");

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
        "inline-flex cursor-default items-center gap-1 rounded-3xl bg-subtle",
        className,
      )}
      onClick={(e) => {
        e.preventDefault();
      }}
      {...props}
    >
      {isLoggedIn ? (
        <span
          className="group/upvote flex aspect-square h-8 w-10 cursor-pointer items-center justify-center rounded-full hover:bg-red-400/10 dark:hover:bg-red-400/5"
          onClick={() => {
            vote({ postId: postId, voteType: "UP" });
          }}
        >
          <ArrowBigUp
            className={cn(
              "h-6 w-6",
              currentVoteType === "UP"
                ? "fill-red-500 text-red-500"
                : "text-zinc-400 group-hover/upvote:text-red-600/75",
            )}
            strokeWidth={1.5}
          />
        </span>
      ) : (
        <AuthLink
          href="/sign-in"
          className="group/downvote flex aspect-square h-8 w-10 cursor-pointer items-center justify-center rounded-full hover:bg-indigo-400/10 dark:hover:bg-indigo-400/5"
        >
          <ArrowBigDown
            className={cn(
              "h-6 w-6",
              currentVoteType === "DOWN"
                ? "fill-indigo-500 text-indigo-500"
                : "text-zinc-400 group-hover/downvote:text-indigo-600/75",
            )}
            strokeWidth={1.5}
          />
        </AuthLink>
      )}
      <div className="flex items-center justify-center">
        <span
          className={cn(
            "absolute",
            currentVoteType === "UP"
              ? "text-red-500"
              : currentVoteType === "DOWN"
              ? "text-indigo-500"
              : "text-zinc-400",
          )}
        >
          {votesAmt}
        </span>
      </div>
      {isLoggedIn ? (
        <span
          className="group/downvote flex aspect-square h-8 w-10 cursor-pointer items-center justify-center rounded-full hover:bg-indigo-400/10 dark:hover:bg-indigo-400/5"
          onClick={() => {
            vote({ postId: postId, voteType: "DOWN" });
          }}
        >
          <ArrowBigDown
            className={cn(
              "h-6 w-6",
              currentVoteType === "DOWN"
                ? "fill-indigo-500 text-indigo-500"
                : "text-zinc-400 group-hover/downvote:text-indigo-600/75",
            )}
            strokeWidth={1.5}
          />
        </span>
      ) : (
        <AuthLink
          href="/sign-in"
          className="group/downvote flex aspect-square h-8 w-10 cursor-pointer items-center justify-center rounded-full hover:bg-indigo-400/10 dark:hover:bg-indigo-400/5"
        >
          <ArrowBigDown
            className={cn(
              "h-6 w-6",
              currentVoteType === "DOWN"
                ? "fill-indigo-500 text-indigo-500"
                : "text-zinc-400 group-hover/downvote:text-indigo-600/75",
            )}
            strokeWidth={1.5}
          />
        </AuthLink>
      )}
    </span>
  );
};

export default PostVote;
