"use client";

import { getVotesAmount } from "@/lib/utils";
import { Comment, Subreddit, User, Vote } from "@prisma/client";
import { FC } from "react";
import Post from "./Post";

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
  return (
    <div className="space-y-3 pb-16 lg:pb-0">
      {initialPosts.map((post) => {
        const votesAmt = getVotesAmount({ votes: post.votes });

        return (
          <Post
            post={post}
            votesAmt={votesAmt}
            key={post.id}
            isCommunity={communityName ? true : false}
          />
        );
      })}
    </div>
  );
};

export default PostFeed;
