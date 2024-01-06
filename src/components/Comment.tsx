import { COMMENT_REPLIES_DEPTH, MORE_COMMENT_REPLIES } from "@/lib/config";
import { RouterOutputs, trpc } from "@/lib/trpc";
import { cn, formatTimeToNow, getVotesAmount } from "@/lib/utils";
import { PartialK } from "@/types/utilities";
import { VoteType } from "@prisma/client";
import { Dot, Maximize2, MessageSquare } from "lucide-react";
import { User } from "next-auth";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { FC, useState } from "react";
import AddReply from "./AddReply";
import CommentVote from "./CommentVote";
import MoreOptions from "./MoreOptions";
import ShareButton from "./ShareButton";
import UserAvatar from "./UserAvatar";

type InfinitePostCommentsOutput =
  RouterOutputs["comment"]["infiniteComments"];

interface CommentProps extends React.ComponentPropsWithoutRef<"div"> {
  comment: PartialK<
    Pick<InfinitePostCommentsOutput, "comments">["comments"][number],
    "replies"
  >;
  votesAmt: number;
  currentVoteType?: VoteType;
  user?: User;
  pathName: string;
  level: number;
}

const Comment: FC<CommentProps> = ({
  comment,
  votesAmt,
  currentVoteType,
  user,
  pathName,
  className,
  level,
}) => {
  const [isReplying, setIsReplying] = useState(false);
  const [replies, setReplies] = useState(comment.replies ?? []);
  const [skip, setSkip] = useState(comment.replies?.length ?? 0);
  const [totalReplies, setTotalReplies] = useState(comment._count.replies);
  const [isDeleted, setIsDeleted] = useState(comment?.deleted);
  const [showReplies, setShowReplies] = useState(isDeleted ? false : true);

  const haveMoreReplies = totalReplies - replies.length;
  const isLoggedIn = user ? true : false;

  const params = useParams();
  const router = useRouter();

  const { mutate, isLoading } = trpc.comment.getMoreReplies.useMutation({
    onSuccess: (data) => {
      setSkip((prevSkip) => prevSkip + data.comments.length);
      setReplies((prevReplies) => [...prevReplies, ...data.comments]);
    },
  });

  const addNewReply = (
    newReply: Pick<InfinitePostCommentsOutput, "comments">["comments"][number],
  ) => {
    setReplies((prevReplies) => [newReply, ...prevReplies]);
    setTotalReplies((prevTotalReplies) => prevTotalReplies + 1);
    setSkip((prevSkip) => prevSkip + 1);
  };

  const deleteComment = () => {
    setIsDeleted(true);
  };

  if (isDeleted && replies.length < 1) {
    return null;
  }

  return (
    <div className={cn("rounded-md p-2 pr-0", className)}>
      <div
        className={cn(
          "flex gap-1.5 pr-4",
          isDeleted && showReplies && "cursor-pointer",
        )}
        onClick={() => isDeleted && showReplies && setShowReplies(false)}
      >
        {!isDeleted ? (
          <Link href={`/u/${comment.author.username}`}>
            <UserAvatar user={comment.author} className="h-7 w-7" />
          </Link>
        ) : (
          <div className="flex items-center gap-1.5">
            {!showReplies ? (
              <Maximize2
                className="h-3.5 w-3.5 rotate-90 cursor-pointer text-blue-500 dark:text-blue-400"
                onClick={() =>
                  setShowReplies((prevShowReplies) => !prevShowReplies)
                }
              />
            ) : null}
            <span className="flex aspect-square h-7 w-7 items-center justify-center rounded-full bg-zinc-300 font-semibold text-zinc-950 dark:bg-zinc-600">
              u/
            </span>
          </div>
        )}
        <div className="flex items-center text-xs">
          {!isDeleted ? (
            <Link href={`/u/${comment.author.username}`}>
              <span className="font-semibold text-default/90 hover:underline dark:hover:text-red-100">
                {comment.author.username}
              </span>
            </Link>
          ) : (
            <span className="font-medium text-subtle">
              Comment deleted by user
            </span>
          )}
          <div className="flex items-center text-subtle">
            <Dot className="h-4 w-4" strokeWidth={4} />
            <span>{formatTimeToNow(new Date(comment.createdAt))}</span>
          </div>
        </div>
      </div>
      {showReplies ? (
        <div className="pl-3 pt-2">
          <div className="w-full border-l-2 border-default/60 pb-1 pl-5">
            {!isDeleted ? (
              <>
                <span className="whitespace-pre-wrap break-all">
                  {comment.text}
                </span>
                <div className="-ml-1.5 flex items-center gap-0 text-xs font-semibold text-subtle dark:text-zinc-400 md:gap-0.5">
                  <CommentVote
                    commentId={comment.id}
                    initialVotesAmt={votesAmt}
                    initialVoteType={currentVoteType}
                    onNotLoggedIn={
                      isLoggedIn
                        ? undefined
                        : () => {
                            router.push(`/sign-in?callbackUrl=${pathName}`);
                          }
                    }
                  />

                  <ReplyButton
                    onClick={() => {
                      if (!isLoggedIn) {
                        return router.push(`/sign-in?callbackUrl=${pathName}`);
                      }
                      setIsReplying(!isReplying);
                    }}
                  />

                  <ShareButton
                    comment={{
                      id: comment.id,
                      subredditName: params.slug as string,
                      postId: comment.postId,
                    }}
                  />
                  {isLoggedIn ? (
                    <MoreOptions
                      type="comment"
                      id={comment.id}
                      bookmark={
                        comment.bookmarks ? comment.bookmarks.length > 0 : false
                      }
                      redirectUrl={pathName}
                      pathName={pathName}
                      isAuthor={comment.authorId === user?.id}
                      onCommentDelete={deleteComment}
                    />
                  ) : null}
                </div>
              </>
            ) : null}
            {isReplying ? (
              <div className="my-3 border-l-2 border-default/60 px-5">
                <AddReply
                  postId={comment.postId}
                  addNewReply={(newReply) => {
                    setIsReplying(false);
                    addNewReply(newReply);
                  }}
                  replyToId={comment.id}
                  onCancel={() => {
                    setIsReplying(false);
                  }}
                />
              </div>
            ) : null}
            {level <= COMMENT_REPLIES_DEPTH ? (
              replies?.map((reply) => {
                const votesAmt = getVotesAmount({ votes: reply.votes });

                const currentVote = reply?.votes.find(
                  (vote) => vote.userId === user?.id,
                );

                return (
                  <div key={reply.id} className="-ml-5">
                    <Comment
                      comment={reply}
                      votesAmt={votesAmt}
                      currentVoteType={currentVote?.type}
                      user={user}
                      pathName={pathName}
                      level={level + 1}
                    />
                  </div>
                );
              })
            ) : (
              <Link
                href={`${pathName}/comment/${comment.id}`}
                className="-ml-1 w-full cursor-pointer text-xs font-semibold text-blue-500 hover:underline dark:text-blue-400"
              >
                Continue this thread...
              </Link>
            )}
            {level <= COMMENT_REPLIES_DEPTH ? (
              haveMoreReplies > 0 ? (
                <span
                  className="-ml-1 w-full cursor-pointer text-xs font-semibold text-blue-500 hover:underline dark:text-blue-400"
                  onClick={() => {
                    mutate({
                      limit: MORE_COMMENT_REPLIES,
                      postId: comment.postId,
                      userId: user?.id,
                      replyToId: comment.id,
                      skip: skip,
                    });
                  }}
                >
                  {isLoading
                    ? "Loading..."
                    : `${haveMoreReplies} more ${
                        haveMoreReplies === 1 ? "reply" : "replies"
                      }`}
                </span>
              ) : null
            ) : null}
          </div>
        </div>
      ) : null}
    </div>
  );
};

interface ReplyButtonProps extends React.HTMLAttributes<HTMLElement> {}

const ReplyButton: FC<ReplyButtonProps> = ({ onClick }) => {
  return (
    <span
      className="z-[1] inline-flex cursor-pointer items-center gap-1 rounded-3xl px-3 py-2 hover:bg-highlight/40 dark:hover:bg-highlight/60"
      onClick={onClick}
    >
      <MessageSquare className="h-5 w-5" />
      <span>Reply</span>
    </span>
  );
};

export default Comment;
