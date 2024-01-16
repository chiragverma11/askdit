"use client";

import { useInfinitePostFeed } from "@/hooks/use-infinite-postfeed";
import { getVotesAmount } from "@/lib/utils";
import { useIntersection } from "@mantine/hooks";
import {
  Bookmark,
  Comment,
  Post as PrismaPost,
  Subreddit,
  User,
  Vote,
  VoteType,
} from "@prisma/client";
import { Session } from "next-auth";
import { usePathname } from "next/navigation";
import { FC, useEffect, useRef } from "react";
import Post from "./Post";
import PostSkeleton from "./PostSkeleton";

type InitialPostWithBookmark = (PrismaPost & {
  author: User;
  votes: Vote[];
  subreddit: Subreddit;
  comments: Comment[];
  bookmarks: Bookmark[];
})[];

type InitialPostWithoutBookmark = (PrismaPost & {
  author: User;
  votes: Vote[];
  subreddit: Subreddit;
  comments: Comment[];
})[];

interface CommonPostProps {
  session: Session | null;
  variant?: "card" | "compact";
}

interface CommunityPostsProps extends CommonPostProps {
  type: "communityPost";
  communityName: string;
  initialPosts: InitialPostWithBookmark;
}

interface AuthenticatedPostsProps extends CommonPostProps {
  type: "authenticatedPost";
  communityIds?: string[];
  initialPosts: InitialPostWithBookmark;
}

interface GeneralPostsProps extends CommonPostProps {
  type: "generalPost";
  initialPosts: InitialPostWithoutBookmark;
}

interface UserPostsProps extends CommonPostProps {
  type: "userPost";
  authorId: string;
  initialPosts: InitialPostWithBookmark;
}

interface VotedPostsProps extends CommonPostProps {
  type: "votedPost";
  authorId: string;
  voteType: VoteType;
  initialPosts: InitialPostWithBookmark;
}

type PostFeedProps =
  | CommunityPostsProps
  | AuthenticatedPostsProps
  | GeneralPostsProps
  | UserPostsProps
  | VotedPostsProps;

const PostFeed: FC<PostFeedProps> = ({
  initialPosts,
  variant = "card",
  session,
  ...props
}) => {
  const pathname = usePathname();

  const lastPostRef = useRef<HTMLElement>(null);
  const { ref, entry } = useIntersection({
    root: lastPostRef.current,
    threshold: 0.1,
  });

  const { data, isLoading, isFetchingNextPage, fetchNextPage, hasNextPage } =
    useInfinitePostFeed({ ...props, userId: session?.user.id });

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
                variant={variant}
                post={post}
                votesAmt={votesAmt}
                isCommunity={props.type === "communityPost"}
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
                variant={variant}
                post={post}
                votesAmt={votesAmt}
                isCommunity={props.type === "communityPost"}
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
