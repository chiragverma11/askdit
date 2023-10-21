"use client";

import { RouterOutputs } from "@/lib/trpc";
import { Comment, Post, Subreddit, User, Vote, VoteType } from "@prisma/client";
import { MessageSquare } from "lucide-react";
import Link from "next/link";
import EditorOutput from "./EditorOutput";
import PostVote from "./PostVote";
import SharePost from "./SharePost";
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
}

const Post = ({
  post,
  isCommunity,
  votesAmt,
  currentVoteType,
  className,
  ...props
}: PostProps) => {
  const defaultProfileBg = getDefaultCommunityBg({
    communityName: post.subreddit.name,
  });

  return (
    <div
      className={cn(
        "relative mx-auto flex w-full flex-col gap-2 border-b border-t border-default/25 bg-emphasis px-4 py-2 text-sm sm:rounded-3xl sm:border lg:p-4 lg:hover:border-default/60",
        className,
      )}
      {...props}
    >
      <Link
        href={`/r/${post.subreddit.name}/post/${post.id}`}
        className="absolute inset-0"
      ></Link>
      <div className="flex w-full items-center justify-between">
        {isCommunity ? (
          <Link
            href={`/u/${post.author.username}`}
            className="inline-flex items-center gap-2 rounded-lg"
          >
            <UserAvatar user={post.author} className="aspect-square h-6 w-6" />
            <span className="text-sm font-semibold">{`u/${post.author.username}`}</span>
          </Link>
        ) : (
          <Link
            href={`/r/${post.subreddit.name}`}
            className="inline-flex items-center gap-2 rounded-lg text-xs font-semibold"
          >
            <span
              className={cn(
                "flex aspect-square h-5 w-5 items-center justify-center rounded-full font-bold text-zinc-950",
                defaultProfileBg,
              )}
            >
              r/
            </span>
            {`r/${post.subreddit.name}`}
          </Link>
        )}
      </div>
      <div>
        <p className="text-xl font-semibold">{post.title}</p>
      </div>
      <div>
        <EditorOutput content={post.content} />
      </div>
      <div className="text-x flex items-center gap-3 text-xs font-semibold text-subtle dark:text-default">
        <PostVote
          className="z-[1]"
          postId={post.id}
          initialVotesAmt={votesAmt}
          initialVoteType={currentVoteType}
        />
        <span
          className="z-[1] inline-flex items-center gap-1 rounded-3xl bg-subtle px-3 py-2 text-zinc-400 hover:bg-highlight/60"
          onClick={(e) => {
            e.preventDefault();
          }}
        >
          <MessageSquare className="h-5 w-5" />
          <span>{post.comments.length}</span>
        </span>
        <SharePost post={post} />
      </div>
    </div>
  );
};

export default Post;
