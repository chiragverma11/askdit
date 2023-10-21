"use client";

import { RouterOutputs } from "@/lib/trpc";
import { cn, formatTimeToNow, getDefaultCommunityBg } from "@/lib/utils";
import { Comment, Post, Subreddit, User, Vote, VoteType } from "@prisma/client";
import { Dot, MessageSquare } from "lucide-react";
import Link from "next/link";
import EditorOutput from "./EditorOutput";
import PostVote from "./PostVote";
import ShareButton from "./ShareButton";
import UserAvatar from "./UserAvatar";

type InfiniteCommunityPostsOutput =
  RouterOutputs["post"]["infiniteCommunityPosts"];

interface PostProps extends React.HTMLAttributes<HTMLDivElement> {
  post:
    | Pick<InfiniteCommunityPostsOutput, "posts">["posts"][number]
    | (Post & {
        author: User;
        votes: Vote[];
        subreddit: Subreddit;
        comments: Comment[];
      });
  isCommunity?: boolean;
  votesAmt: number;
  currentVoteType?: VoteType;
  noRedirect?: boolean;
  isLoggedIn: boolean;
}

const Post = ({
  post,
  isCommunity,
  votesAmt,
  currentVoteType,
  noRedirect = false,
  isLoggedIn,
  className,
  ...props
}: PostProps) => {
  const defaultProfileBg = getDefaultCommunityBg({
    communityName: post.subreddit.name,
  });

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
          href={`/r/${post.subreddit.name}/post/${post.id}`}
          className="absolute inset-0 z-[1]"
        ></Link>
      ) : null}

      <div className="flex w-full items-center">
        {isCommunity ? (
          <div className="z-[1] inline-flex items-center gap-2 rounded-lg">
            <Link href={`/u/${post.author.username}`}>
              <UserAvatar
                user={post.author}
                className="aspect-square h-6 w-6"
              />
            </Link>
            <div className="flex items-center">
              <Link href={`/u/${post.author.username}`}>
                <span className="text-sm font-semibold text-default/90 hover:underline dark:hover:text-red-100">{`u/${post.author.username}`}</span>
              </Link>
              <div className="flex items-center text-subtle">
                <Dot className="h-4 w-4" strokeWidth={4} />
                <span>{formatTimeToNow(new Date(post.createdAt))}</span>
              </div>
            </div>
          </div>
        ) : (
          <div className="inline-flex items-center gap-2 rounded-lg">
            <Link href={`/r/${post.subreddit.name}`}>
              <span
                className={cn(
                  "flex aspect-square h-8 w-8 items-center justify-center rounded-full text-lg font-bold text-zinc-950",
                  defaultProfileBg,
                )}
              >
                r/
              </span>
            </Link>
            <div className="flex flex-col text-xs ">
              <div className="flex items-center">
                <Link href={`/r/${post.subreddit.name}`}>
                  <span className="font-bold text-default/90 hover:underline dark:hover:text-red-100">{`r/${post.subreddit.name}`}</span>
                </Link>

                <div className="flex items-center text-subtle">
                  <Dot className="h-4 w-4" strokeWidth={4} />
                  <span>{formatTimeToNow(new Date(post.createdAt))}</span>
                </div>
              </div>
              <span>
                <span className="text-default dark:text-white">{" by "}</span>
                <Link href={`/u/${post.author.username}`}>
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
        <p className="text-xl font-semibold">{post.title}</p>
      </div>
      <div className="w-full text-sm">
        <EditorOutput content={post.content} />
      </div>
      <div className="flex items-center gap-3 text-xs font-semibold text-subtle dark:text-default">
        <PostVote
          className="z-[1]"
          postId={post.id}
          initialVotesAmt={votesAmt}
          initialVoteType={currentVoteType}
          isLoggedIn={isLoggedIn}
        />
        <span
          className="z-[1] inline-flex items-center gap-1 rounded-3xl bg-subtle px-3 py-2 text-zinc-400 hover:bg-highlight/40 dark:hover:bg-highlight/60"
          onClick={(e) => {
            e.preventDefault();
          }}
        >
          <MessageSquare className="h-5 w-5" />
          <span>{post.comments.length}</span>
        </span>
        <ShareButton post={post} />
      </div>
    </div>
  );
};

export default Post;
