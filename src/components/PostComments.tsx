"use client";

import { INFINITE_SCROLL_COMMENT_RESULTS } from "@/lib/config";
import { trpc } from "@/lib/trpc";
import { cn, getVotesAmount } from "@/lib/utils";
import { useIntersection } from "@mantine/hooks";
import { DotWave } from "@uiball/loaders";
import { MessagesSquare } from "lucide-react";
import { User } from "next-auth";
import Link from "next/link";
import { useParams, usePathname } from "next/navigation";
import { FC, useEffect, useRef } from "react";
import AddComment from "./AddComment";
import Comment from "./Comment";
import { Separator } from "./ui/Separator";

interface PostCommentsProps {
  postId: string;
  commentId?: string;
  context?: number;
  user?: User;
}

const PostComments: FC<PostCommentsProps> = ({
  postId,
  commentId,
  context,
  user,
}) => {
  const pathname = usePathname();
  const params = useParams();
  const lastCommentRef = useRef<HTMLElement>(null);
  const { ref, entry } = useIntersection({
    root: lastCommentRef.current,
    threshold: 0.1,
  });

  const {
    data,
    isLoading: isInfiniteCommentsLoading,
    isFetchingNextPage,
    fetchNextPage,
    hasNextPage,
    refetch,
  } = trpc.comment.infiniteComments.useInfiniteQuery(
      {
        limit: INFINITE_SCROLL_COMMENT_RESULTS,
        postId,
        userId: user?.id,
      },
      {
        getNextPageParam: (lastPage) => lastPage?.nextCursor,
        staleTime: Infinity,
      enabled: commentId ? false : true,
    },
  );

  const { data: comment, isLoading: isCommentLoading } =
    trpc.comment.getComment.useQuery(
      {
        commentId: commentId!,
        userId: user?.id,
        context: context ? (isNaN(context) ? 0 : context) : 0,
      },
      { enabled: commentId ? true : false },
    );

  const isLoading = commentId ? isCommentLoading : isInfiniteCommentsLoading;

  useEffect(() => {
    if (hasNextPage && entry?.isIntersecting) {
      fetchNextPage();
    }
  }, [entry, fetchNextPage, isLoading, hasNextPage]);

  const comments = commentId
    ? comment
      ? [comment]
      : []
    : data?.pages.flatMap((page) => page.comments);

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
        {commentId ? (
          <Link
            href={`/r/${params.slug}/post/${postId}`}
            className="w-fit text-xs font-semibold text-blue-500 hover:underline hover:underline-offset-2 dark:text-blue-400"
          >
            View all comments
          </Link>
        ) : null}
      </div>

      <ul className="flex w-full flex-col gap-2">
        {isLoading ? (
          <div className="flex min-h-[16rem] w-full items-center justify-center">
            <DotWave size={45} speed={1} color="gray" />
          </div>
        ) : null}
        {comments?.map((comment, index) => {
          const votesAmt = getVotesAmount({ votes: comment.votes });

          const currentVote = comment?.votes.find(
            (vote) => vote.userId === user?.id,
          );

          const isLastComment = index === comments.length - 1;

          return (
            <li ref={isLastComment ? ref : undefined} key={comment.id}>
            <Comment
              comment={comment}
              votesAmt={votesAmt}
              currentVoteType={currentVote?.type}
              user={user}
              pathName={pathname}
              level={1}
                className={cn(
                  commentId
                    ? commentId === comment.id && "bg-highlight/60"
                    : "",
                )}
                highlightReplyId={commentId}
              />
            </li>
          );
        })}

        {isFetchingNextPage && !isLoading ? (
          <div className="flex w-full items-center justify-center py-1">
            <DotWave size={45} speed={1} color="gray" />
      </div>
        ) : null}
        {comments?.length === 0 && !isLoading ? <NoComments /> : null}
      </ul>
    </div>
  );
};

const NoComments = () => {
  return (
    <div className="flex h-full min-h-[16rem] w-full flex-col items-center justify-center gap-3">
      <MessagesSquare className="h-8 w-8 text-subtle" strokeWidth={2} />
      <div className="flex flex-col items-center gap-2 font-semibold text-subtle">
        <p className="text-base">No Comments Yet</p>
        <p className="text-sm">Be the first to share what you think!</p>
      </div>
    </div>
  );
};

export default PostComments;
