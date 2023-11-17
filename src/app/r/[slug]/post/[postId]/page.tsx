import Post from "@/components/Post";
import PostComments from "@/components/PostComments";
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

  const isAuthor = post.authorId === session?.user.id;

  return (
    <>
      <div className="flex w-full justify-center py-6 pt-4">
        <div className="relative flex w-full flex-col gap-2 pb-16 md:max-w-xl lg:w-[648px] lg:max-w-2xl lg:pb-0">
          <Post
            post={post}
            votesAmt={votesAmt}
            currentVoteType={currentVote?.type}
            className="rounded-t-3xl py-4"
            noRedirect={true}
            isLoggedIn={session?.user ? true : false}
            isAuthor={isAuthor}
            pathName={`/r/${post.subreddit.name}/post/${post.id}`}
          />
          <PostComments postId={post.id} user={session?.user} />
        </div>
      </div>
    </>
  );
};

export default CommunityPost;
