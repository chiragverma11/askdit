"use client";

import { INFINITE_SCROLL_PAGINATION_RESULTS } from "@/lib/config";
import { trpc } from "@/lib/trpc";
import { getVotesAmount } from "@/lib/utils";
import { useIntersection } from "@mantine/hooks";
import {
  Comment,
  Post as PrismaPost,
  Subreddit,
  User,
  Vote,
} from "@prisma/client";
import { Session } from "next-auth";
import { usePathname } from "next/navigation";
import { FC, useEffect, useRef } from "react";
import Post from "./Post";
import PostSkeleton from "./PostSkeleton";

interface PostFeedProps {
  initialPosts: (PrismaPost & {
    author: User;
    votes: Vote[];
    subreddit: Subreddit;
    comments: Comment[];
  })[];
  communityName?: string;
  session: Session | null;
  communityIds?: string[];
}

const PostFeed: FC<PostFeedProps> = ({
  initialPosts,
  communityName,
  session,
  communityIds,
}) => {
  const pathname = usePathname();

  const lastPostRef = useRef<HTMLElement>(null);
  const { ref, entry } = useIntersection({
    root: lastPostRef.current,
    threshold: 0.1,
  });

  const trpcInfiniteQueryRequest = communityName
    ? trpc.post.infiniteCommunityPosts.useInfiniteQuery(
        {
          limit: INFINITE_SCROLL_PAGINATION_RESULTS,
          communityName: communityName!,
        },
        {
          getNextPageParam: (lastPage) => lastPage?.nextCursor,
        },
      )
    : session
    ? trpc.post.infiniteAuthenticatedPosts.useInfiniteQuery(
        {
          limit: INFINITE_SCROLL_PAGINATION_RESULTS,
          communityIds: communityIds!,
        },
        {
          getNextPageParam: (lastPage) => lastPage?.nextCursor,
        },
      )
    : trpc.post.infiniteGeneralPosts.useInfiniteQuery(
        {
          limit: INFINITE_SCROLL_PAGINATION_RESULTS,
        },
        {
          getNextPageParam: (lastPage) => lastPage?.nextCursor,
        },
      );

  const { data, isLoading, isFetchingNextPage, fetchNextPage, hasNextPage } =
    trpcInfiniteQueryRequest;

  useEffect(() => {
    if (hasNextPage && entry?.isIntersecting) {
      fetchNextPage();
    }
  }, [entry, fetchNextPage, isLoading, hasNextPage]);

  const posts = data?.pages.flatMap((page) => page.posts) ?? initialPosts;

  return (
    <ul className="space-y-1 pb-16 sm:space-y-2 md:space-y-3 lg:pb-0">
      {posts.map((post, index) => {
        const votesAmt = getVotesAmount({ votes: post?.votes });

        const currentVote = post?.votes.find(
          (vote) => vote.userId === session?.user.id,
        );

        if (index === posts.length - 1) {
          return (
            <li ref={ref} key={post.id}>
              <Post
                post={post}
                votesAmt={votesAmt}
                isCommunity={communityName ? true : false}
                currentVoteType={currentVote?.type}
                isLoggedIn={session?.user ? true : false}
                pathName={pathname}
                isAuthor={post.authorId === session?.user.id}
              />
            </li>
          );
        } else {
          return (
            <li key={post.id}>
              <Post
                post={post}
                votesAmt={votesAmt}
                isCommunity={communityName ? true : false}
                currentVoteType={currentVote?.type}
                isLoggedIn={session?.user ? true : false}
                pathName={pathname}
                isAuthor={post.authorId === session?.user.id}
              />
            </li>
          );
        }
      })}
      {isFetchingNextPage ? (
        <li className="relative -mb-24 lg:-mb-8">
          <div className="-mb-24 h-44 overflow-hidden lg:-mb-8 lg:h-40">
            <PostSkeleton />
          </div>
        </li>
      ) : null}
    </ul>
  );
};

export default PostFeed;
