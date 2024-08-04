import { cn, formatTimeToNow } from "@/lib/utils";
import Link from "next/link";
import { FC } from "react";
import Skeleton, { SkeletonTheme } from "react-loading-skeleton";
import { Icons } from "../Icons";
import { type Notification } from "./Notifications";

interface NotificationCardProps {
  notification: Notification;
}

const NotificationCard: FC<NotificationCardProps> = ({ notification }) => {
  if (notification.type === "COMMENT") {
    return <CommentCard notification={notification} />;
  } else if (notification.type === "REPLY") {
    return <ReplyCard notification={notification} />;
  }
};

const ReplyCard: FC<NotificationCardProps> = ({ notification }) => {
  return (
    <div
      className={cn(
        "relative flex w-full gap-4 px-4 py-3 text-default/80 hover:bg-subtle/50 active:bg-subtle dark:hover:bg-emphasis/50 dark:active:bg-emphasis",
        notification.read ? "" : "bg-red-500/5",
      )}
    >
      <Link
        href={`/r/${notification.post?.subreddit?.name}/post/${notification?.postId}/comment/${notification?.commentId}?context=3`}
        className="absolute inset-0"
      />

      <span className="flex h-6 w-6 items-center justify-center rounded-full">
        <Icons.reply className="h-5 w-5" />
      </span>

      <div className="flex flex-col gap-1">
        <p>
          <Link
            href={`/u/${notification.triggeredBy.username}`}
            className="relative z-50 font-semibold text-default/95 underline-offset-2 hover:underline"
          >
            u/{notification.triggeredBy.username}
          </Link>{" "}
          replied to your comment
        </p>

        <p className="text-xs text-subtle">
          {!notification.read && (
            <Icons.dot
              className="inline h-4 w-4 text-brand-default"
              strokeWidth={6}
            />
          )}
          {formatTimeToNow(new Date(notification.createdAt))}
        </p>
      </div>
    </div>
  );
};

const CommentCard: FC<NotificationCardProps> = ({ notification }) => {
  return (
    <div
      className={cn(
        "relative flex w-full gap-4 px-4 py-3 text-default/80 hover:bg-subtle/50 active:bg-subtle dark:hover:bg-emphasis/50 dark:active:bg-emphasis",
        notification.read ? "" : "bg-red-500/5",
      )}
    >
      <Link
        href={`/r/${notification.post?.subreddit?.name}/post/${notification?.postId}/comment/${notification?.commentId}`}
        className="absolute inset-0"
      />

      <span className="flex h-6 w-6 items-center justify-center rounded-full">
        <Icons.comment className="h-5 w-5" />
      </span>

      <div className="flex flex-col gap-1">
        <p>
          <Link
            href={`/u/${notification.triggeredBy.username}`}
            className="relative z-50 font-semibold text-default/95 underline-offset-2 hover:underline"
          >
            u/{notification.triggeredBy.username}
          </Link>{" "}
          commented on your post
        </p>

        <p className="text-xs text-subtle">
          {!notification.read && (
            <Icons.dot
              className="inline h-4 w-4 text-brand-default"
              strokeWidth={6}
            />
          )}
          {formatTimeToNow(new Date(notification.createdAt))}
        </p>
      </div>
    </div>
  );
};

export const NotificationCardSkeleton = ({
  disableAnimation = false,
}: {
  disableAnimation?: boolean;
}) => {
  return (
    <SkeletonTheme
      baseColor="var(--skeleton-base)"
      highlightColor="var(--skeleton-highlight)"
      duration={2}
      inline={false}
      enableAnimation={!disableAnimation}
    >
      <div
        className={cn(
          "relative flex w-full gap-4 px-4 py-3 text-default/80 hover:bg-subtle/50 active:bg-subtle dark:hover:bg-emphasis/50 dark:active:bg-emphasis",
        )}
      >
        <span className="flex h-6 w-6 items-center justify-center rounded-full">
          <Skeleton className="h-5 w-5" width={"1.25rem"} />
        </span>

        <div className="flex w-full flex-col gap-1">
          <Skeleton className="w-full font-semibold" />
          <Skeleton className="text-xs text-subtle" width={"5rem"} />
        </div>
      </div>
    </SkeletonTheme>
  );
};

export default NotificationCard;
