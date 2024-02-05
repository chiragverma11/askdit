"use client";

import { FC, useState } from "react";

import { cn, formatTimeToNow } from "@/lib/utils";
import { FeedViewType } from "@/types/utilities";
import {
  Bookmark,
  Comment,
  Post as PrismaPost,
  Subreddit,
  User,
  Vote,
  VoteType,
} from "@prisma/client";
import Link from "next/link";
import CommunityAvatar from "./CommunityAvatar";
import EditorOutput from "./EditorOutput";
import { Icons } from "./Icons";
import LinkPost, { LinkPostCompactPreview, type LinkContent } from "./LinkPost";
import MoreOptions from "./MoreOptions";
import PostVote from "./PostVote";
import ShareButton from "./ShareButton";
import UserAvatar from "./UserAvatar";
import { Button, buttonVariants } from "./ui/Button";

interface PostProps extends React.ComponentPropsWithoutRef<"div"> {
  post: PrismaPost & {
    author: User;
    votes: Vote[];
    subreddit: Subreddit;
    comments: Comment[];
    bookmarks?: Bookmark[];
  };
  variant?: FeedViewType;
  isCommunity?: boolean;
  votesAmt: number;
  currentVoteType?: VoteType;
  noRedirect?: boolean;
  isLoggedIn: boolean;
  isAuthor: boolean;
  pathName: string;
}

const Post = ({ variant = "card", ...props }: PostProps) => {
  if (variant === "card") {
    return <CardVariantPost {...props} />;
  } else if (variant === "compact") {
    return <CompactVariantPost {...props} />;
  }
};

interface PostVariantProps extends React.ComponentPropsWithoutRef<"div"> {
  post: PrismaPost & {
    author: User;
    votes: Vote[];
    subreddit: Subreddit;
    comments: Comment[];
    bookmarks?: Bookmark[];
  };
  isCommunity?: boolean;
  votesAmt: number;
  currentVoteType?: VoteType;
  noRedirect?: boolean;
  isLoggedIn: boolean;
  isAuthor: boolean;
  pathName: string;
}

const CardVariantPost: FC<PostVariantProps> = ({
  post,
  isCommunity,
  votesAmt,
  currentVoteType,
  noRedirect = false,
  isLoggedIn,
  isAuthor,
  className,
  pathName,
  ...props
}) => {
  const redirectUrl = `/r/${post.subreddit.name}/post/${post.id}`;

  return (
    <div
      className={cn(
        "relative mx-auto flex w-full flex-col gap-2 border-b border-t border-default/25 bg-emphasis px-4 py-3 text-sm md:rounded-3xl md:border lg:p-4",
        !noRedirect ? "lg:hover:border-default/60" : null,
        className,
      )}
      {...props}
    >
      {!noRedirect ? (
        <Link
          href={redirectUrl}
          className="absolute inset-0 z-[1]"
          prefetch={false}
        ></Link>
      ) : null}

      <div className="flex w-full items-center">
        {isCommunity ? (
          <div className="z-[1] inline-flex items-center gap-2 rounded-lg">
            <Link href={`/u/${post.author.username}`} prefetch={false}>
              <UserAvatar
                user={post.author}
                className="aspect-square h-6 w-6"
              />
            </Link>
            <div className="flex items-center">
              <Link href={`/u/${post.author.username}`} prefetch={false}>
                <span className="text-sm font-semibold text-default/90 hover:underline dark:hover:text-red-100">{`u/${post.author.username}`}</span>
              </Link>
              <div className="flex items-center text-subtle">
                <Icons.dot className="h-4 w-4" strokeWidth={4} />
                <span>{formatTimeToNow(new Date(post.createdAt))}</span>
              </div>
            </div>
          </div>
        ) : (
          <div className="z-[1] inline-flex items-center gap-2 rounded-lg">
            <Link href={`/r/${post.subreddit.name}`} prefetch={false}>
              <CommunityAvatar
                communityName={post.subreddit.name}
                image={post.subreddit.image}
              />
            </Link>
            <div className="flex flex-col text-xs ">
              <div className="flex items-center">
                <Link href={`/r/${post.subreddit.name}`} prefetch={false}>
                  <span className="font-bold text-default/90 hover:underline dark:hover:text-red-100">{`r/${post.subreddit.name}`}</span>
                </Link>

                <div className="flex items-center text-subtle">
                  <Icons.dot className="h-4 w-4" strokeWidth={4} />
                  <span>{formatTimeToNow(new Date(post.createdAt))}</span>
                </div>
              </div>
              <span>
                <span className="text-default dark:text-white">{" by "}</span>
                <Link href={`/u/${post.author.username}`} prefetch={false}>
                  <span className="text-default/80 hover:underline dark:hover:text-red-100">
                    {post.author.username}
                  </span>
                </Link>
              </span>
            </div>
          </div>
        )}
      </div>
      <div>
        <p
          className={cn(
            "break-words font-bold",
            noRedirect ? "text-2xl" : "text-xl",
          )}
        >
          {post.title}
        </p>
      </div>
      <div
        className={cn(
          "prose prose-stone min-w-full text-sm dark:prose-invert prose-a:relative prose-a:z-[1] prose-img:m-auto",
          post.type !== "LINK"
            ? "prose-a:text-blue-500 dark:prose-a:text-blue-400"
            : "prose-a:text-inherit",
        )}
      >
        {post.type === "POST" ? (
          <EditorOutput content={post.content} />
        ) : (
          <LinkPost
            content={post.content as LinkContent["content"]}
            title={post.title}
          />
        )}
      </div>
      <div className="flex items-center gap-2 text-xs font-semibold text-subtle dark:text-zinc-400">
        <PostVote
          className="z-[1]"
          postId={post.id}
          initialVotesAmt={votesAmt}
          initialVoteType={currentVoteType}
          isLoggedIn={isLoggedIn}
        />
        <CommentButton
          className="z-[1] inline-flex cursor-pointer items-center gap-1 rounded-3xl bg-subtle px-3 py-2 hover:bg-highlight/40 dark:hover:bg-highlight/60"
          commentsLength={post.comments.length}
          noRedirect={noRedirect}
          redirectUrl={redirectUrl}
        />
        <ShareButton type={"post"} post={post} />
        {isLoggedIn ? (
          <MoreOptions
            type="post"
            id={post.id}
            bookmark={post.bookmarks ? post.bookmarks.length > 0 : false}
            redirectUrl={`/r/${post.subreddit.name}`}
            pathName={pathName}
            isAuthor={isAuthor}
          />
        ) : null}
      </div>
    </div>
  );
};

interface CommentButtonProps extends React.HTMLAttributes<HTMLElement> {
  noRedirect: boolean;
  redirectUrl: string;
  commentsLength: number;
}

const CommentButton: FC<CommentButtonProps> = ({
  className,
  noRedirect,
  redirectUrl,
  commentsLength,
}) => {
  const CommentIcon = (
    <>
      <Icons.message className="h-5 w-5" />
      <span>{commentsLength}</span>
    </>
  );

  if (!noRedirect) {
    return (
      <Link href={redirectUrl} className={className} prefetch={false}>
        {CommentIcon}
      </Link>
    );
  }

  return (
    <span
      className={className}
      onClick={(ref) => {
        ref.currentTarget.scrollIntoView({ behavior: "smooth" });
      }}
    >
      {CommentIcon}
    </span>
  );
};

const CompactVariantPost: FC<PostVariantProps> = ({
  post,
  isCommunity,
  votesAmt,
  currentVoteType,
  noRedirect = false,
  isLoggedIn,
  isAuthor,
  className,
  pathName,
  ...props
}) => {
  const [showContent, setShowContent] = useState(false);

  const redirectUrl = `/r/${post.subreddit.name}/post/${post.id}`;

  return (
    <div
      className={cn(
        "relative mx-auto flex w-full flex-col gap-2 border-b border-t border-default/25 bg-emphasis px-4 py-3 text-sm md:rounded-lg md:border lg:p-3",
        !noRedirect ? "lg:hover:border-default/60" : null,
        className,
      )}
      {...props}
    >
      {!noRedirect ? (
        <Link
          href={redirectUrl}
          className="absolute inset-0 z-[1]"
          prefetch={false}
        ></Link>
      ) : null}

      <div className="flex flex-row-reverse justify-between gap-2 md:flex-row md:justify-normal">
        <CompactVariantPostPreview post={post} />
        <div className="flex flex-col gap-1">
          <div>
            <p
              className={cn(
                "break-words font-bold",
                noRedirect ? "text-2xl" : "text-lg font-medium leading-snug",
              )}
            >
              {post.title}
            </p>
          </div>
          <div className="flex w-full items-center">
            {isCommunity ? (
              <div className="z-[1] inline-flex items-center gap-2 rounded-lg">
                <div className="flex items-center">
                  <Link href={`/u/${post.author.username}`} prefetch={false}>
                    <span className="text-sm font-semibold text-default/90 hover:underline dark:hover:text-red-100">{`u/${post.author.username}`}</span>
                  </Link>
                  <div className="flex items-center text-subtle">
                    <Icons.dot className="h-4 w-4" strokeWidth={4} />
                    <span>{formatTimeToNow(new Date(post.createdAt))}</span>
                  </div>
                </div>
              </div>
            ) : (
              <div className="z-[1] inline-flex items-center gap-2 rounded-lg">
                {post.type === "LINK" ? (
                  <Link
                    href={(post.content as LinkContent["content"]).url}
                    className={cn(
                      buttonVariants({ variant: "subtle", size: "icon" }),
                      "h-auto w-auto bg-transparent p-1 text-subtle hover:bg-highlight dark:text-zinc-400",
                    )}
                    target="_blank"
                    prefetch={false}
                  >
                    <Icons.externalLink className="h-5 w-5" />
                  </Link>
                ) : (
                  <Button
                    onClick={() => setShowContent(!showContent)}
                    className="h-auto w-auto bg-transparent p-1 text-subtle hover:bg-highlight dark:text-zinc-400"
                    variant={"subtle"}
                    size={"icon"}
                  >
                    {showContent ? (
                      <Icons.minimize className="h-5 w-5 rotate-90" />
                    ) : (
                      <Icons.maximize className="h-5 w-5 rotate-90" />
                    )}
                  </Button>
                )}

                <div className="flex flex-col text-xs ">
                  <div className="flex items-center">
                    <Link href={`/r/${post.subreddit.name}`} prefetch={false}>
                      <span className="font-bold text-default/90 hover:underline dark:hover:text-red-100">{`r/${post.subreddit.name}`}</span>
                    </Link>
                    <div className="flex items-center text-subtle">
                      <Icons.dot className="h-4 w-4" strokeWidth={4} />
                      <span>{formatTimeToNow(new Date(post.createdAt))}</span>
                    </div>
                  </div>
                  <span>
                    <span className="text-default dark:text-white">
                      {" by "}
                    </span>
                    <Link href={`/u/${post.author.username}`} prefetch={false}>
                      <span className="text-default/80 hover:underline dark:hover:text-red-100">
                        {post.author.username}
                      </span>
                    </Link>
                  </span>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
      <div
        className={cn(
          "prose prose-stone min-w-full text-sm dark:prose-invert prose-a:relative prose-a:z-[1] prose-img:m-auto",
          post.type !== "LINK"
            ? "prose-a:text-blue-500 dark:prose-a:text-blue-400"
            : "prose-a:text-inherit",
        )}
      >
        {showContent ? (
          post.type === "POST" ? (
            <EditorOutput content={post.content} />
          ) : (
            <LinkPost
              content={post.content as LinkContent["content"]}
              title={post.title}
            />
          )
        ) : null}
      </div>
      <div className="flex items-center gap-2 text-xs font-semibold text-subtle dark:text-zinc-400">
        <PostVote
          className="z-[1]"
          postId={post.id}
          initialVotesAmt={votesAmt}
          initialVoteType={currentVoteType}
          isLoggedIn={isLoggedIn}
        />
        <CommentButton
          className="z-[1] inline-flex cursor-pointer items-center gap-1 rounded-3xl bg-subtle px-3 py-2 hover:bg-highlight/40 dark:hover:bg-highlight/60"
          commentsLength={post.comments.length}
          noRedirect={noRedirect}
          redirectUrl={redirectUrl}
        />
        <ShareButton type={"post"} post={post} />
        {isLoggedIn ? (
          <MoreOptions
            type="post"
            id={post.id}
            bookmark={post.bookmarks ? post.bookmarks.length > 0 : false}
            redirectUrl={`/r/${post.subreddit.name}`}
            pathName={pathName}
            isAuthor={isAuthor}
          />
        ) : null}
      </div>
    </div>
  );
};

const CompactVariantPostPreview: FC<Pick<PostVariantProps, "post">> = ({
  post,
}) => {
  return (
    <div
      className={cn(
        "relative flex aspect-[7/6] h-[4.25rem] shrink-0 items-center justify-center overflow-hidden rounded-md bg-highlight text-subtle md:h-24",
        post.type === "LINK" && "z-[1]",
      )}
    >
      {post.type === "POST" ? (
        <Icons.alignJustify
          className="h-3.5 w-3.5 rounded-[2px] p-[1px] outline outline-[1.5px]"
          strokeWidth={3}
        />
      ) : post.type === "MEDIA" ? (
        <Icons.imageIcon className="h-5 w-5" />
      ) : post.type === "LINK" ? (
        <LinkPostCompactPreview
          content={post.content as LinkContent["content"]}
        />
      ) : null}
    </div>
  );
};

export default Post;
