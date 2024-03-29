"use client";

import { useInfiniteUserBookmarkFeed } from "@/hooks/use-infinite-user-bookmarkfeed";
import { getVotes } from "@/lib/utils";
import { UserBookmarks, UserComments } from "@/types/utilities";
import { usePathname } from "next/navigation";
import { FC } from "react";
import Post from "../Post";
import PostSkeleton from "../PostSkeleton";
import UserComment from "./UserComment";

interface UserBookmarkFeedProps {
  initialBookmarks: UserBookmarks;
  userId: string;
}

const UserBookmarkFeed: FC<UserBookmarkFeedProps> = ({
  initialBookmarks,
  userId,
}) => {
  const { data, isLoading, isFetchingNextPage, ref } =
    useInfiniteUserBookmarkFeed({ userId });

  const bookmarks = data ?? initialBookmarks;

  return (
    <ul className="space-y-1 pb-16 sm:space-y-2 md:space-y-3 lg:pb-0">
      {bookmarks.map((bookmark, index) => {
        if (index === bookmarks.length - 1) {
          return (
            <li ref={ref} key={bookmark.id}>
              <PostOrCommentBookmark bookmark={bookmark} userId={userId} />
            </li>
          );
        } else {
          return (
            <li key={bookmark.id}>
              <PostOrCommentBookmark bookmark={bookmark} userId={userId} />
            </li>
          );
        }
      })}
      {isFetchingNextPage ? (
        <li className="">
          <div className="-mb-28 h-28 overflow-hidden lg:-mb-8">
            <PostSkeleton variant="compact" />
          </div>
        </li>
      ) : null}
    </ul>
  );
};

interface PostOrCommentBookmarkProps {
  bookmark: UserBookmarks[number];
  userId: string;
}

const PostOrCommentBookmark: FC<PostOrCommentBookmarkProps> = ({
  bookmark,
  userId,
}) => {
  const pathname = usePathname();

  if (bookmark.post) {
    const { currentVoteType, votesAmt } = getVotes({
      currentUserId: userId,
      votes: bookmark.post.votes,
    });

    const post = {
      ...bookmark.post,
      bookmarks: [
        {
          id: bookmark.id,
          userId: bookmark.userId,
          postId: bookmark.postId,
          commentId: bookmark.commentId,
          createdAt: bookmark.createdAt,
          updatedAt: bookmark.updatedAt,
        },
      ],
    };

    return (
      <Post
        variant="compact"
        post={post}
        votesAmt={votesAmt}
        isCommunity={false}
        currentVoteType={currentVoteType}
        isLoggedIn={true}
        pathName={pathname}
        isAuthor={bookmark.post.authorId === userId}
      />
    );
  } else if (bookmark?.comment) {
    const { currentVoteType, votesAmt } = getVotes({
      currentUserId: userId,
      votes: bookmark.comment?.votes,
    });

    const comment: UserComments[number] = {
      ...bookmark.comment,
      bookmarks: [
        {
          id: bookmark.id,
          userId: bookmark.userId,
          postId: bookmark.postId,
          commentId: bookmark.commentId,
          createdAt: bookmark.createdAt,
          updatedAt: bookmark.updatedAt,
        },
      ],
    };

    return (
      <UserComment
        comment={comment}
        isLoggedIn={true}
        isAuthor={bookmark.comment.authorId === userId}
        votesAmt={votesAmt}
        currentVoteType={currentVoteType}
      />
    );
  }
};

export default UserBookmarkFeed;
