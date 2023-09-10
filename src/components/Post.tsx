"use client";

import { cn, getDefaultCommunityBg } from "@/lib/utils";
import { Comment, Post, Subreddit, User, Vote } from "@prisma/client";
import { MessageSquare, ThumbsDown, ThumbsUp } from "lucide-react";
import Link from "next/link";
import { TbShare3 } from "react-icons/tb";
import EditorOutput from "./EditorOutput";
import UserAvatar from "./UserAvatar";

interface PostProps extends React.HTMLAttributes<HTMLAnchorElement> {
  post: Post & {
    author: User;
    votes: Vote[];
    subreddit: Subreddit;
    comments: Comment[];
  };
  isCommunity?: boolean;
  votesAmt: number;
}

const Post = ({
  post,
  isCommunity,
  votesAmt,
  className,
  ...props
}: PostProps) => {
  const defaultProfileBg = getDefaultCommunityBg({
    communityName: post.subreddit.name,
  });

  return (
    <Link
      href={`/r/${post.subreddit.name}/post/${post.id}`}
      className={cn(
        "mx-auto flex w-full flex-col gap-2 rounded-3xl border border-default/25 bg-emphasis p-4 text-sm hover:border-default/60",
        className,
      )}
      {...props}
    >
      <div className="flex w-full items-center justify-between">
        {isCommunity ? (
          <Link
            href={`/u/${post.author.username}`}
            className="inline-flex items-center gap-2 rounded-lg"
          >
            <UserAvatar user={post.author} className="aspect-square h-6 w-6" />
            <span className="text-xs font-semibold">{`u/${post.author.username}`}</span>
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
      <div className="text-x flex items-center gap-3 text-xs font-medium">
        <span className="inline-flex items-center rounded-3xl bg-subtle">
          <span className="flex h-8 w-10 items-center justify-center">
            <ThumbsUp className="h-4 w-4 text-default" />
          </span>
          <span className="text-default">{votesAmt}</span>
          <span className="flex h-8 w-10 items-center justify-center">
            <ThumbsDown className="h-4 w-4 text-default" />
          </span>
        </span>
        <span className="inline-flex items-center gap-1 rounded-3xl bg-subtle px-3 py-2">
          <MessageSquare className="h-5 w-5 text-default" />
          {post.comments.length}
        </span>
        <span className="inline-flex items-center gap-1 rounded-3xl bg-subtle px-3 py-2">
          <TbShare3 className="h-5 w-5 text-default" />
          Share
        </span>
      </div>
    </Link>
  );
};

export default Post;
