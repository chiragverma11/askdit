"use client";

import { useInfiniteCommentFeed } from "@/hooks/use-infinite-commentfeed";
import { getVotes } from "@/lib/utils";
import { UserComments } from "@/types/utilities";
import { useIntersection } from "@mantine/hooks";
import { FC, useEffect, useRef } from "react";
import UserComment, {
  SamePostUserComments,
  UserCommentSkeleton,
} from "@/components/user/UserComment";

interface CommentSearchFeedProps {
  query: string;
  userId: string | undefined;
  initialComments: UserComments;
}

const CommentSearchFeed: FC<CommentSearchFeedProps> = ({
  query,
  userId,
  initialComments,
}) => {
  const lastCommentRef = useRef<HTMLElement>(null);
  const { ref, entry } = useIntersection({
    root: lastCommentRef.current,
    threshold: 0.1,
  });

  const { data, isLoading, isFetchingNextPage, fetchNextPage, hasNextPage } =
    useInfiniteCommentFeed({
      type: "searchComment",
      query: query,
      userId: userId,
    });

  useEffect(() => {
    if (hasNextPage && entry?.isIntersecting) {
      fetchNextPage();
    }
  }, [entry, fetchNextPage, isLoading, hasNextPage]);

  const comments =
    data?.pages.flatMap((page) => page.comments) ?? initialComments;

  const groupedComments: UserComments[] = comments.reduce(
    (acc: UserComments[], comment, index, array) => {
      if (index === 0 || comment.postId !== array[index - 1].postId) {
        // Start a new group if it's the first comment or if the postId is different from the previous one
        acc.push([comment]);
      } else {
        // Add the comment to the last group
        acc[acc.length - 1].push(comment);
      }
      return acc;
    },
    [],
  );

  return (
    <ul className="space-y-1 pb-16 md:space-y-2 lg:pb-0">
      {groupedComments.map((group, index) => {
        const isLastGroup = index === groupedComments.length - 1;

        if (group.length > 1) {
          // Render SamePostUserComments for grouped comments
          return (
            <li key={group[0].postId}>
              <SamePostUserComments
                comments={group}
                isLoggedIn={!!userId}
                isAuthor={group[0].authorId === userId}
                currentUserId={userId}
                ref={isLastGroup ? ref : undefined}
              />
            </li>
          );
        } else {
          // Render UserComment for individual comments
          const comment = group[0];

          const { votesAmt, currentVoteType } = getVotes({
            votes: comment.votes,
            currentUserId: userId,
          });

          return (
            <li key={comment.id} ref={isLastGroup ? ref : undefined}>
              <UserComment
                comment={comment}
                isLoggedIn={!!userId}
                isAuthor={comment.authorId === userId}
                votesAmt={votesAmt}
                currentVoteType={currentVoteType}
              />
            </li>
          );
        }
      })}
      {isFetchingNextPage ? (
        <li>
          <div className="-mb-24 w-full h-28 overflow-hidden lg:-mb-8">
            <UserCommentSkeleton />
          </div>
        </li>
      ) : null}
    </ul>
  );
};

export default CommentSearchFeed;
