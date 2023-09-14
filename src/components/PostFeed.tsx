"use client";

import { getVotesAmount } from "@/lib/utils";
import { Comment, Subreddit, User, Vote } from "@prisma/client";
import { FC } from "react";
import Post from "./Post";
import { useSession } from "next-auth/react";

interface PostFeedProps {
  initialPosts: (Post & {
    author: User;
    votes: Vote[];
    subreddit: Subreddit;
    comments: Comment[];
  })[];
  communityName?: string;
}

const PostFeed: FC<PostFeedProps> = ({ initialPosts, communityName }) => {
  const { data: session, status: sessionStatus } = useSession();

  return (
    <div className="space-y-1 pb-16 sm:space-y-3 lg:pb-0">
      {initialPosts.map((post) => {
        const votesAmt = getVotesAmount({ votes: post.votes });

        const currentVote = post.votes.find(
          (vote) => vote.userId === session?.user.id,
        );

        return (
          <Post
            key={post.id}
            post={post}
            votesAmt={votesAmt}
            isCommunity={communityName ? true : false}
            currentVoteType={currentVote?.type}
          />
        );
      })}
    </div>
  );
};

export default PostFeed;
