import AsideBar from "@/components/AsideBar";
import Post from "@/components/Post";
import { getAuthSession } from "@/lib/auth";
import { db } from "@/lib/db";
import { getVotesAmount } from "@/lib/utils";
import { notFound } from "next/navigation";
import { FC } from "react";

interface CommunityPostProps {
  params: {
    postId: string;
  };
}

const getPost = async ({ postId }: { postId: string }) => {
  const post = await db.post.findFirst({
    where: {
      id: postId,
    },
    include: { author: true, votes: true, subreddit: true, comments: true },
  });

  return post;
};

const CommunityPost: FC<CommunityPostProps> = async ({ params }) => {
  const { postId } = params;
  const session = await getAuthSession();

  const post = await getPost({ postId });

  if (!post) return notFound();

  const votesAmt = getVotesAmount({ votes: post.votes });

  const currentVote = post.votes.find(
    (vote) => vote.userId === session?.user.id,
  );

  return (
    <>
      <AsideBar />
      <div className="flex w-full justify-center py-6 pt-4">
        <div className="relative w-full lg:w-[600px]">
          <Post
            post={post}
            votesAmt={votesAmt}
            currentVoteType={currentVote?.type}
            className="rounded-t-3xl"
          />
        </div>
      </div>
    </>
  );
};

export default CommunityPost;
