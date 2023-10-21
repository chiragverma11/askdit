"use client";

import { INFINITE_SCROLL_COMMENT_RESULTS } from "@/lib/config";
import { trpc } from "@/lib/trpc";
import { cn, getVotesAmount } from "@/lib/utils";
import { DotWave } from "@uiball/loaders";
import { MessagesSquare } from "lucide-react";
import { User } from "next-auth";
import { usePathname } from "next/navigation";
import { FC } from "react";
import AddComment from "./AddComment";
import Comment from "./Comment";
import { Separator } from "./ui/Separator";

interface PostCommentsProps {
  postId: string;
  user?: User;
}

const PostComments: FC<PostCommentsProps> = ({ postId, user }) => {
  const pathname = usePathname();

  const { data, isLoading, isFetchingNextPage, fetchNextPage, refetch } =
    trpc.comment.infiniteComments.useInfiniteQuery(
      {
        limit: INFINITE_SCROLL_COMMENT_RESULTS,
        postId,
      },
      {
        getNextPageParam: (lastPage) => lastPage?.nextCursor,
        staleTime: Infinity,
      },
    );

  const comments = data?.pages.flatMap((page) => page.comments);

  const refetchComments = () => {
    refetch({
      refetchPage: (lastPage, index) => {
        return index === 0;
      },
    });
  };

  return (
    <div
      className={cn(
        "relative mx-auto flex w-full flex-col gap-5 border-b border-t border-default/25 bg-emphasis px-2 py-3 text-sm md:rounded-3xl md:border lg:py-4",
      )}
    >
      <div className="flex flex-col gap-5 px-2">
        <AddComment
          postId={postId}
          refetchComments={refetchComments}
          user={user}
        />
        <Separator className="mx-auto h-0.5 w-5/6 rounded-full bg-default" />
      </div>
      <div className="flex w-full flex-col gap-2">
        {isLoading ? (
          <div className="flex min-h-[16rem] w-full items-center justify-center">
            <DotWave size={45} speed={1} color="gray" />
          </div>
        ) : null}
        {comments?.map((comment) => {
          const votesAmt = getVotesAmount({ votes: comment.votes });

          const currentVote = comment?.votes.find(
            (vote) => vote.userId === user?.id,
          );

          return (
            <Comment
              comment={comment}
              key={comment.id}
              votesAmt={votesAmt}
              currentVoteType={currentVote?.type}
              user={user}
              pathName={pathname}
            />
          );
        })}
        {comments?.length === 0 ? <NoComments /> : null}
      </div>
    </div>
  );
};

const NoComments = () => {
  return (
    <div className="flex h-full min-h-[16rem] w-full flex-col items-center justify-center gap-3">
      <MessagesSquare className="h-8 w-8 text-subtle" strokeWidth={2} />
      <div className="flex flex-col items-center gap-2 font-semibold text-subtle">
        <p className="">No Comments Yet</p>
        <p className="text-sm">Be the first to share what you think!</p>
      </div>
    </div>
  );
};

export default PostComments;
