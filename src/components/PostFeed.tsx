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
import { useSession } from "next-auth/react";
import { usePathname } from "next/navigation";
import { FC, useEffect, useRef } from "react";
import Skeleton, { SkeletonTheme } from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import Post from "./Post";

interface PostFeedProps {
  initialPosts: (PrismaPost & {
    author: User;
    votes: Vote[];
    subreddit: Subreddit;
    comments: Comment[];
  })[];
  communityName?: string;
}

const PostFeed: FC<PostFeedProps> = ({ initialPosts, communityName }) => {
  const { data: session, status: sessionStatus } = useSession();
  const pathname = usePathname();

  const lastPostRef = useRef<HTMLElement>(null);
  const { ref, entry } = useIntersection({
    root: lastPostRef.current,
    threshold: 0.1,
  });

  const { data, isLoading, isFetchingNextPage, fetchNextPage, hasNextPage } =
    trpc.post.infiniteCommunityPosts.useInfiniteQuery(
      {
        limit: INFINITE_SCROLL_PAGINATION_RESULTS,
        communityName: communityName!,
      },
      {
        getNextPageParam: (lastPage) => lastPage?.nextCursor,
      },
    );

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

const PostSkeleton = () => {
  return (
    <SkeletonTheme
      baseColor="var(--skeleton-base)"
      highlightColor="var(--skeleton-highlight)"
      duration={2}
      inline={false}
    >
      <div className="relative mx-auto flex w-full flex-col gap-2 border-b border-t border-default/25 bg-emphasis px-4 py-3 text-sm md:rounded-3xl md:border lg:p-4 lg:hover:border-default/60">
        <div className="flex w-full items-center">
          <div className="inline-flex items-center gap-2">
            <Skeleton
              className="aspect-square h-6 w-6 text-2xl"
              circle={true}
            />
            <Skeleton className="text-base font-semibold" width={"12rem"} />
          </div>
        </div>
        <Skeleton className="text-2xl font-bold" width={"18rem"} />
        <Skeleton className="w-full text-xl font-bold" height={"10rem"} />
        <div className="flex items-center gap-2 text-xs font-semibold text-subtle dark:text-default">
          <Skeleton
            className="px-3 py-2"
            width={"16rem"}
            borderRadius={"1.5rem"}
          />
          <Skeleton
            className="px-3 py-2"
            width={"3rem"}
            borderRadius={"1.5rem"}
          />
        </div>
      </div>
    </SkeletonTheme>
  );
};

export default PostFeed;
