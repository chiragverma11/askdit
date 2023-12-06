import CommunityInfoCard from "@/components/CommunityInfoCard";
import Post from "@/components/Post";
import PostComments from "@/components/PostComments";
import FeedWrapper from "@/components/layout/FeedWrapper";
import MainContentWrapper from "@/components/layout/MainContentWrapper";
import SideMenuWrapper from "@/components/layout/SideMenuWrapper";
import { getAuthSession } from "@/lib/auth";
import { db } from "@/lib/db";
import { getSubscription } from "@/lib/prismaQueries";
import { getVotesAmount } from "@/lib/utils";
import { notFound } from "next/navigation";
import { FC } from "react";

interface CommunityPostProps {
  params: {
    slug: string;
    postId: string;
  };
}

const getPost = async ({ postId }: { postId: string }) => {
  const post = await db.post.findFirst({
    where: {
      id: postId,
    },
    include: {
      author: true,
      votes: true,
      subreddit: {
        include: {
          _count: {
            select: {
              subscribers: true,
            },
          },
        },
      },
      comments: true,
    },
  });

  return post;
};

const CommunityPost: FC<CommunityPostProps> = async ({ params }) => {
  const { postId, slug } = params;
  const session = await getAuthSession();

  const subscription = session
    ? await getSubscription({
        communityName: slug,
        userId: session?.user.id,
      })
    : null;

  const isSubscribed = !!subscription;

  const post = await getPost({ postId });

  if (!post) return notFound();

  const votesAmt = getVotesAmount({ votes: post.votes });

  const currentVote = post.votes.find(
    (vote) => vote.userId === session?.user.id,
  );

  const isAuthor = post.authorId === session?.user.id;

  return (
    <MainContentWrapper>
      <FeedWrapper>
        <div className="flex w-full flex-col gap-2 pb-16 lg:pb-0">
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
      </FeedWrapper>
      <SideMenuWrapper>
        <CommunityInfoCard
          session={session}
          isSubscribed={isSubscribed}
          communityInfo={{
            id: post.subreddit.id,
            name: post.subreddit.name,
            image:post.subreddit.image,
            description: post.subreddit.description,
            subscribersCount: post.subreddit._count.subscribers,
            creatorId: post.subreddit.creatorId,
            createdAt: post.subreddit.createdAt,
          }}
          parent="post"
        />
      </SideMenuWrapper>
    </MainContentWrapper>
  );
};

export default CommunityPost;
