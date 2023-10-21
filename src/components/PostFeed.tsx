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
    threshold: 1,
  });

  const { data, isLoading, isFetchingNextPage, fetchNextPage } =
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
    if (entry?.isIntersecting) {
      fetchNextPage();
    }
  }, [entry, fetchNextPage]);

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
              />
            </li>
          );
        } else {
          return (
            <Post
              key={post.id}
              post={post}
              votesAmt={votesAmt}
              isCommunity={communityName ? true : false}
              currentVoteType={currentVote?.type}
              isLoggedIn={session?.user ? true : false}
            />
          );
        }
      })}
      {isFetchingNextPage ? <div>Loading...</div> : null}
    </ul>
  );
};

export default PostFeed;
