"use client";

import { cn, formatTimeToNow, getVotes } from "@/lib/utils";
import { UserComments } from "@/types/utilities";
import { VoteType } from "@prisma/client";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { FC, forwardRef, useState } from "react";
import Skeleton, { SkeletonTheme } from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import CommentVote from "../CommentVote";
import { Icons } from "../Icons";
import MoreOptions from "../MoreOptions";
import ShareButton from "../ShareButton";
import UserAvatar from "../UserAvatar";
import { Separator } from "../ui/Separator";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "../ui/Tooltip";

interface UserCommentProps extends React.ComponentPropsWithoutRef<"div"> {
  comment: UserComments[number];
  isLoggedIn: boolean;
  isAuthor: boolean;
  votesAmt: number;
  currentVoteType?: VoteType;
  showCommentHeader?: boolean;
}

const UserComment: FC<UserCommentProps> = ({
  comment,
  isLoggedIn,
  isAuthor,
  votesAmt,
  currentVoteType,
  showCommentHeader = true,
  className,
}) => {
  const [isDeleted, setIsDeleted] = useState(comment.deleted);

  const commentUrl = `/r/${comment.post.subreddit.name}/post/${
    comment.postId
  }/comment/${comment.id}${comment.replyToId ? "?context=3" : ""}`;

  const router = useRouter();
  const pathname = usePathname();

  const deleteComment = () => {
    setIsDeleted(true);
  };

  if (isDeleted) {
    return null;
  }

  return (
    <div
      className={cn(
        showCommentHeader &&
          "flex w-full flex-col border-b border-t border-default/25 bg-emphasis text-sm md:rounded-lg md:border",
        className,
      )}
    >
      {showCommentHeader ? (
        <UserCommentHeader
          authorUsername={comment.author.username!}
          communityName={comment.post.subreddit.name}
          postId={comment.postId}
          className=""
        />
      ) : null}

      <div
        className={cn(
          "relative p-3",
          showCommentHeader &&
            "md:rounded-b-lg md:border lg:hover:border-default/80",
        )}
      >
        <Link
          href={commentUrl}
          className="absolute inset-0 z-[1]"
          prefetch={false}
        ></Link>
        <div className="flex gap-1.5">
          <Link href={`/u/${comment.author.username}`} className="z-[1]">
            <UserAvatar user={comment.author} className="h-5 w-5" />
          </Link>
          <div className="flex items-center text-xs">
            <Link href={`/u/${comment.author.username}`} className="z-[1]">
              <span className="font-semibold text-default/90 hover:underline dark:hover:text-red-100">
                {comment.author.username}
              </span>
            </Link>
            <div className="flex items-center text-subtle">
              <Icons.dot className="h-4 w-4" strokeWidth={4} />
              <span>{formatTimeToNow(new Date(comment.createdAt))}</span>
            </div>
          </div>
        </div>
        <div className="pl-2.5 pt-2">
          <div className="w-full border-l-2 border-dashed border-default/60 pl-5">
            <span className="whitespace-pre-wrap break-all">
              {comment.text}
            </span>
            <div className="-ml-1.5 flex items-center gap-0 text-xs font-semibold text-subtle dark:text-zinc-400 md:gap-0.5">
              <CommentVote
                className="z-[1]"
                commentId={comment.id}
                initialVotesAmt={votesAmt}
                initialVoteType={currentVoteType}
                onNotLoggedIn={
                  isLoggedIn
                    ? undefined
                    : () => {
                        router.push(`/sign-in?callbackUrl=${pathname}`);
                      }
                }
              />
              <ReplyButton
                onClick={() => {
                  if (!isLoggedIn) {
                    return router.push(`/sign-in?callbackUrl=${pathname}`);
                  }
                  return router.push(commentUrl);
                }}
              />
              <ShareButton
                type="comment"
                level={comment.replyToId ? 2 : 1}
                comment={{
                  id: comment.id,
                  subredditName: comment.post.subreddit.name,
                  postId: comment.postId,
                }}
              />
              {isLoggedIn ? (
                <MoreOptions
                  type="comment"
                  id={comment.id}
                  bookmark={
                    comment.bookmarks ? comment.bookmarks.length > 0 : false
                  }
                  redirectUrl={pathname}
                  pathName={pathname}
                  isAuthor={isAuthor}
                  onCommentDelete={deleteComment}
                  isQuestionPost={true}
                  acceptedAnswer={comment.acceptedAnswer}
                  level={comment.replyToId ? 2 : 1}
                  isPostAuthor={false}
                />
              ) : null}
              {comment.acceptedAnswer && (
                <TooltipProvider delayDuration={200}>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Icons.acceptedAnswer className="z-[1] ml-1 h-4 w-4 font-bold text-green-600" />
                    </TooltipTrigger>
                    <TooltipContent
                      side="bottom"
                      className="px-2 py-1 text-xs"
                      sideOffset={7}
                    >
                      <p>Accepted Answer</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

interface ReplyButtonProps extends React.ComponentPropsWithoutRef<"span"> {}

const ReplyButton: FC<ReplyButtonProps> = ({ onClick }) => {
  return (
    <span
      className="z-[1] inline-flex cursor-pointer items-center gap-1 rounded-3xl px-3 py-2 hover:bg-highlight/40 dark:hover:bg-highlight/60"
      onClick={onClick}
    >
      <Icons.message className="h-5 w-5" />
      <span className="hidden lg:inline">Reply</span>
    </span>
  );
};

interface UserCommentHeaderProps extends React.ComponentPropsWithoutRef<"div"> {
  authorUsername: string;
  postId: string;
  communityName: string;
}

const UserCommentHeader: FC<UserCommentHeaderProps> = ({
  authorUsername,
  postId,
  communityName,
  className,
}) => {
  const postUrl = `/r/${communityName}/post/${postId}`;

  return (
    <div>
      <div
        className={cn(
          "relative p-3 text-xs text-subtle dark:text-zinc-400 md:rounded-t-lg md:border lg:hover:border-default/80",
          className,
        )}
      >
        <Link
          href={postUrl}
          className="absolute inset-0 z-[1]"
          prefetch={false}
        ></Link>
        <div className="flex w-fit items-center">
          <div className="flex items-center gap-1">
            <Icons.messages className="mr-1 h-5 w-5" />
            <Link
              href={`/u/${authorUsername}`}
              className="z-[1] font-semibold text-default/90 hover:underline dark:hover:text-red-100"
            >
              {authorUsername}
            </Link>
            commented on{" "}
            <Link
              href={postUrl}
              className="z-[1] font-semibold text-default/90 hover:underline"
            >
              Post
            </Link>
          </div>
          <Icons.dot className="h-4 w-4 text-subtle" strokeWidth={4} />
          <Link
            href={`/r/${communityName}/`}
            className="z-[1] font-semibold text-default/90 hover:underline dark:hover:text-red-100"
          >
            r/{communityName}
          </Link>
        </div>
      </div>
      <Separator className="h-0.5 bg-highlight/80" />
    </div>
  );
};

interface SamePostUserCommentsProps
  extends React.ComponentPropsWithoutRef<"div"> {
  comments: UserComments;
  isLoggedIn: boolean;
  isAuthor: boolean;
  currentUserId: string | undefined;
}

// This SamePostUserComments will group consecutive comments with same postId together.

const SamePostUserComments = forwardRef<
  React.ElementRef<"li">,
  SamePostUserCommentsProps
>(({ comments, isLoggedIn, isAuthor, currentUserId, className }, ref) => {
  return (
    <div
      className={cn(
        "flex w-full flex-col border-b border-t border-default/25 bg-emphasis text-sm md:rounded-lg md:border",
        className,
      )}
    >
      <UserCommentHeader
        authorUsername={comments[0].author.username!}
        communityName={comments[0].post.subreddit.name}
        postId={comments[0].postId}
      />
      <ul className="flex flex-col">
        {comments.map((comment, index) => {
          const isLastComment = index === comments.length - 1;

          const { votesAmt, currentVoteType } = getVotes({
            votes: comment.votes,
            currentUserId,
          });

          return (
            <li
              key={comment.id}
              className="flex flex-col"
              ref={isLastComment ? ref : undefined}
            >
              {index !== 0 ? (
                <Separator className="mx-auto h-0.5 w-[97%] bg-highlight" />
              ) : null}
              <UserComment
                comment={comment}
                showCommentHeader={false}
                isLoggedIn={isLoggedIn}
                isAuthor={isAuthor}
                votesAmt={votesAmt}
                currentVoteType={currentVoteType}
                className={cn(
                  "md:border md:border-transparent lg:hover:border-default/80",
                  index === comments.length - 1 && "md:rounded-b-lg",
                )}
              />
            </li>
          );
        })}
      </ul>
    </div>
  );
});

SamePostUserComments.displayName = "SamePostUserComments";

const UserCommentSkeleton = ({
  disableAnimation = false,
}: {
  disableAnimation?: boolean;
}) => {
  return (
    <SkeletonTheme
      baseColor="var(--skeleton-base)"
      highlightColor="var(--skeleton-highlight)"
      duration={2}
      inline={false}
      enableAnimation={!disableAnimation}
    >
      <div className="flex w-full flex-col border-b border-t border-default/25 bg-emphasis text-xs md:rounded-lg md:border">
        <div>
          <div className="relative p-3 text-sm text-subtle dark:text-zinc-400 md:rounded-t-lg md:border">
            <div className="flex w-fit items-center gap-2">
              <div className="flex items-center gap-1">
                <Icons.messages className="mr-1 h-5 w-5" />
                <Skeleton className="font-semibold" width={"13rem"} />
              </div>
              <Skeleton className="font-semibold" width={"5rem"} />
            </div>
          </div>
          <Separator className="h-0.5 bg-highlight/80" />
        </div>

        <div className="relative p-3 md:rounded-b-lg md:border">
          <div className="flex items-center gap-1.5">
            <Skeleton className="aspect-square h-5 w-5" circle={true} />
            <div className="flex items-center text-xs">
              <Skeleton className="font-semibold" width={"10rem"} />
            </div>
          </div>
          <div className="pl-2.5 pt-2">
            <div className="flex w-full flex-col gap-2 border-l-2 border-dashed border-default/60 pl-5">
              <div className="flex flex-col gap-1">
                <Skeleton className="text-sm" width={"50%"} />
                <Skeleton className="text-sm" width={"70%"} />
              </div>

              <div className="-ml-1.5 flex items-center gap-2 text-xs font-semibold text-subtle dark:text-zinc-400">
                <Skeleton
                  className="py-1"
                  width={"5rem"}
                  borderRadius={"0.4rem"}
                />
                <Skeleton
                  className="py-1"
                  width={"2.5rem"}
                  borderRadius={"0.4rem"}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </SkeletonTheme>
  );
};

export { SamePostUserComments, UserCommentSkeleton };

export default UserComment;
