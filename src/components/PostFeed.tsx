"use client";

import { FC, useEffect, useRef } from "react";

import { useInfinitePostFeed } from "@/hooks/use-infinite-postfeed";
import { getVotesAmount } from "@/lib/utils";
import { useFeedViewStore } from "@/store/feedViewStore";
import { FeedViewType } from "@/types/utilities";
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
import { usePathname } from "next/navigation";
import Post from "./Post";
import PostSkeleton from "./PostSkeleton";
import { getSearchPosts } from "@/lib/prismaQueries";

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
  userId: string | undefined;
  variant?: FeedViewType;
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

interface SearchPostsProps extends CommonPostProps {
  type: "searchPost";
  query: string;
  initialPosts: Awaited<ReturnType<typeof getSearchPosts>>;
}

type PostFeedProps =
  | CommunityPostsProps
  | AuthenticatedPostsProps
  | GeneralPostsProps
  | UserPostsProps
  | VotedPostsProps
  | SearchPostsProps;

const PostFeed: FC<PostFeedProps> = ({
  initialPosts,
  variant,
  userId,
  ...props
}) => {
  const pathname = usePathname();
  const feedViewType = useFeedViewStore((state) => state.feedViewType);

  const lastPostRef = useRef<HTMLElement>(null);
  const { ref, entry } = useIntersection({
    root: lastPostRef.current,
    threshold: 0.1,
  });

  const { data, isLoading, isFetchingNextPage, fetchNextPage, hasNextPage } =
    useInfinitePostFeed({ ...props, userId: userId });

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

        const currentVote = post?.votes.find((vote) => vote.userId === userId);

        if (index === posts.length - 1) {
          return (
            <li ref={ref} key={post.id}>
              <Post
                variant={variant ? variant : feedViewType}
                post={post}
                votesAmt={votesAmt}
                isCommunity={props.type === "communityPost"}
                currentVoteType={currentVote?.type}
                isLoggedIn={userId ? true : false}
                pathName={pathname}
                isAuthor={post.authorId === userId}
                inPostPage={false}
              />
            </li>
          );
        } else {
          return (
            <li key={post.id}>
              <Post
                variant={variant ? variant : feedViewType}
                post={post}
                votesAmt={votesAmt}
                isCommunity={props.type === "communityPost"}
                currentVoteType={currentVote?.type}
                isLoggedIn={userId ? true : false}
                pathName={pathname}
                isAuthor={post.authorId === userId}
                inPostPage={false}
              />
            </li>
          );
        }
      })}
      {isFetchingNextPage ? (
        <li className="relative -mb-24 lg:-mb-8">
          <div className="-mb-24 h-44 overflow-hidden lg:-mb-8 lg:h-40">
            <PostSkeleton variant={variant ? variant : feedViewType} />
          </div>
        </li>
      ) : null}
    </ul>
  );
};

export default PostFeed;
