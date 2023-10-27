import { MORE_COMMENT_REPLIES } from "@/lib/config";
import { trpc } from "@/lib/trpc";
import { cn, formatTimeToNow, getVotesAmount } from "@/lib/utils";
import { InfinitePostCommentsOutput, PartialK } from "@/types/utilities";
import { VoteType } from "@prisma/client";
import { Dot, MessageSquare } from "lucide-react";
import { User } from "next-auth";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { FC, useState } from "react";
import AddReply from "./AddReply";
import CommentVote from "./CommentVote";
import ShareButton from "./ShareButton";
import UserAvatar from "./UserAvatar";

interface CommentProps extends React.HTMLAttributes<HTMLDivElement> {
  comment: PartialK<
    Pick<InfinitePostCommentsOutput, "comments">["comments"][number],
    "replies"
  >;
  votesAmt: number;
  currentVoteType?: VoteType;
  user?: User;
  pathName: string;
}

const Comment: FC<CommentProps> = ({
  comment,
  votesAmt,
  currentVoteType,
  user,
  pathName,
  className,
}) => {
  const [isReplying, setIsReplying] = useState(false);
  const [replies, setReplies] = useState(comment.replies ?? []);
  const [skip, setSkip] = useState(comment.replies?.length ?? 0);
  const [totalReplies, setTotalReplies] = useState(comment._count.replies);

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

  return (
    <div className={cn("rounded-md p-2", className)}>
      <div className="flex gap-1.5 pr-4">
        <Link href={`/u/${comment.author.username}`}>
          <UserAvatar user={comment.author} className="h-7 w-7" />
        </Link>
        <div className="flex items-center text-xs">
          <Link href={`/u/${comment.author.username}`}>
            <span className="font-semibold text-default/90 hover:underline dark:hover:text-red-100">
              {comment.author.username}
            </span>
          </Link>
          <div className="flex items-center text-subtle">
            <Dot className="h-4 w-4" strokeWidth={4} />
            <span>{formatTimeToNow(new Date(comment.createdAt))}</span>
          </div>
        </div>
      </div>
      <div className="pl-3 pt-2">
        <div className="w-full border-l-2 border-default/60 pb-1 pl-5">
          <span className="whitespace-pre-wrap">{comment.text}</span>
          <div className="-ml-1.5 flex items-center gap-1 text-xs font-semibold text-subtle dark:text-default">
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

            <span
              className="z-[1] inline-flex cursor-pointer items-center gap-1 rounded-3xl px-3 py-2 text-zinc-400 hover:bg-highlight/40 dark:hover:bg-highlight/60"
              onClick={(e) => {
                if (!isLoggedIn) {
                  return router.push(`/sign-in?callbackUrl=${pathName}`);
                }
                setIsReplying(!isReplying);
              }}
            >
              <MessageSquare className="h-5 w-5" />
              <span>Reply</span>
            </span>

            <ShareButton
              comment={{
                id: comment.id,
                subredditName: params.slug as string,
                postId: comment.postId,
              }}
            />
          </div>
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
          {replies?.map((reply) => {
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
                />
              </div>
            );
          })}
          {haveMoreReplies > 0 ? (
            <span
              className="-ml-1 w-full cursor-pointer text-xs font-semibold text-blue-500 hover:underline dark:text-blue-400"
              onClick={() => {
                mutate({
                  limit: MORE_COMMENT_REPLIES,
                  postId: comment.postId,
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
          ) : null}
        </div>
      </div>
    </div>
  );
};

export default Comment;
