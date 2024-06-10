import CommunityInfoCard from "@/components/CommunityInfoCard";
import Post from "@/components/Post";
import PostComments from "@/components/PostComments";
import FeedWrapper from "@/components/layout/FeedWrapper";
import MainContentWrapper from "@/components/layout/MainContentWrapper";
import SideMenuWrapper from "@/components/layout/SideMenuWrapper";
import { getAuthSession } from "@/lib/auth";
import {
  getCommunityPost,
  getPostTitle,
  getSubscription,
} from "@/lib/prismaQueries";
import { absoluteUrl, getVotesAmount } from "@/lib/utils";
import { Metadata } from "next";
import { notFound, redirect } from "next/navigation";
import { FC } from "react";

export async function generateMetadata({
  params,
}: {
  params: { slug: string; postId: string };
}): Promise<Metadata> {
  const { slug: communityName, postId } = params;

  const postTitle = await getPostTitle({ postId });

  if (!postTitle) {
    return {
      title: "Post not found",
    };
  }

  return {
    title: `${postTitle} - ${communityName}`,
    openGraph: {
      title: `${postTitle} - ${communityName}`,
      url: absoluteUrl(`/r/${communityName}/post/${postId}`),
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title: `${postTitle} - ${communityName}`,
    },
  };
}

interface CommunityPostCommentProps {
  params: {
    slug: string;
    postId: string;
    commentId?: string;
  };
  searchParams: { [key: string]: string | string[] | undefined };
}

const CommunityPostComment: FC<CommunityPostCommentProps> = async ({
  params,
  searchParams,
}) => {
  const { postId, commentId, slug } = params;
  const session = await getAuthSession();

  const context = (searchParams.context as string) || "";

  const subscription = session
    ? await getSubscription({
        communityName: slug,
        userId: session?.user.id,
      })
    : null;

  const isSubscribed = !!subscription;

  const post = await getCommunityPost({ postId, userId: session?.user.id });

  if (!post) {
    return notFound();
  }

  // Redirect if communityName's case in params is not same as in db
  if (slug !== post.subreddit.name) {
    redirect(`/r/${post.subreddit.name}/post/${post.id}/comment/${commentId}`);
  }

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
            inPostPage={true}
          />
          <PostComments
            postId={post.id}
            commentId={commentId}
            context={parseInt(context)}
            user={session?.user}
            isQuestion={post.isQuestion}
            isAnswered={post.isAnswered}
            postAuthorId={post.authorId}
          />
        </div>
      </FeedWrapper>
      <SideMenuWrapper>
        <CommunityInfoCard
          session={session}
          isSubscribed={isSubscribed}
          communityInfo={{
            id: post.subreddit.id,
            name: post.subreddit.name,
            image: post.subreddit.image,
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

export default CommunityPostComment;
