"use client";

import { INFINITE_SCROLL_PAGINATION_RESULTS } from "@/lib/config";
import { RouterOutputs, trpc } from "@/lib/trpc";
import { cn } from "@/lib/utils";
import { useIntersection, useMediaQuery } from "@mantine/hooks";
import { DropdownMenuLabel } from "@radix-ui/react-dropdown-menu";
import React, { FC, useEffect, useRef, useState } from "react";
import { Icons } from "../Icons";
import { Button } from "../ui/Button";
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTrigger,
} from "../ui/Drawer";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../ui/DropdownMenu";
import { ScrollArea } from "../ui/Scroll-Area";
import { Separator } from "../ui/Separator";
import NotificationCard, { NotificationCardSkeleton } from "./NotificationCard";

export type Notification =
  RouterOutputs["notification"]["getNotifications"]["notifications"][0];

interface NotificationsProps {}

const Notifications: FC<NotificationsProps> = (props) => {
  const isLg = useMediaQuery("(min-width: 1024px)");

  if (isLg) {
    return <NotificationsDropdown {...props} />;
  } else if (!isLg) {
    return <NotificationsDrawer {...props} />;
  }
};

const NotificationsDropdown: FC<NotificationsProps> = () => {
  const [open, setOpen] = useState(false);

  const { data: unreadCount } = trpc.notification.getUnreadCount.useQuery();

  const { mutate: markAllAsRead, isLoading: isMarkingAllAsRead } =
    trpc.notification.markAllAsRead.useMutation();

  return (
    <DropdownMenu modal={false} open={open} onOpenChange={setOpen}>
      <DropdownMenuTrigger asChild>
        <NotificationTrigger unreadCount={unreadCount} />
      </DropdownMenuTrigger>
      <DropdownMenuContent
        align="end"
        onCloseAutoFocus={(e) => e.preventDefault()}
        sideOffset={10}
        className="w-80 rounded-lg border-default/40 bg-emphasis px-0 py-2 text-sm dark:bg-subtle"
      >
        <DropdownMenuLabel className="flex items-center justify-between px-4 py-2 text-base font-semibold text-default/80">
          Notifications
          <button
            className="text-xs text-subtle underline-offset-2 transition hover:underline disabled:opacity-50"
            onClick={() => markAllAsRead()}
            disabled={isMarkingAllAsRead}
          >
            Mark all as read
          </button>
        </DropdownMenuLabel>
        <DropdownMenuSeparator className="my-0" />
        <NotificationsContainer open={open} onClose={() => setOpen(false)} />
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

const NotificationsDrawer: FC<NotificationsProps> = () => {
  const [open, setOpen] = useState(false);

  const { data: unreadCount } = trpc.notification.getUnreadCount.useQuery();

  const { mutate: markAllAsRead, isLoading: isMarkingAllAsRead } =
    trpc.notification.markAllAsRead.useMutation();

  return (
    <Drawer
      open={open}
      onOpenChange={(open) => {
        setOpen(open);
        if (open === true) {
          document.documentElement.style.removeProperty("overflow");
          document.body.style.overflow = "hidden";
        } else {
          document.body.style.removeProperty("overflow");
        }
      }}
    >
      <DrawerTrigger asChild>
        <NotificationTrigger unreadCount={unreadCount} />
      </DrawerTrigger>
      <DrawerContent className="h-[65vh] text-sm">
        <DrawerHeader className="flex items-center justify-between px-4 py-2 text-base font-semibold text-default/80">
          Notifications
          <button
            className="text-xs text-subtle underline-offset-2 transition hover:underline disabled:opacity-50"
            onClick={() => markAllAsRead()}
            disabled={isMarkingAllAsRead}
          >
            Mark all as read
          </button>
        </DrawerHeader>
        <Separator className="my-0" />
        <NotificationsContainer open={open} onClose={() => setOpen(false)} />
      </DrawerContent>
    </Drawer>
  );
};

const NotificationTrigger = React.forwardRef<
  React.ElementRef<typeof Button>,
  React.ComponentPropsWithoutRef<typeof Button> & {
    unreadCount: number | undefined;
  }
>(({ unreadCount, className, ...props }, ref) => {
  return (
    <Button
      className={cn(
        "relative aspect-square w-10 border border-default/25 bg-emphasis font-semibold text-default transition-none hover:bg-subtle hover:transition-colors",
        className,
      )}
      size={"icon"}
      ref={ref}
      {...props}
    >
      <Icons.notification className="h-5 w-5" strokeWidth={2.25} />
      {unreadCount ? (
        <span className="absolute right-1 top-1 flex h-[0.9rem] w-[0.9rem] items-center justify-center rounded-full bg-brand-default text-xxs text-white animate-in zoom-in">
          {unreadCount > 99 ? "99+" : unreadCount}
        </span>
      ) : null}
    </Button>
  );
});

NotificationTrigger.displayName = "NotificationTrigger";

interface NotificationsContainerProps {
  open: boolean;
  onClose: () => void;
}

const NotificationsContainer: FC<NotificationsContainerProps> = ({
  open,
  onClose,
}) => {
  const lastNotificationRef = useRef<HTMLElement>(null);
  const { ref, entry } = useIntersection({
    root: lastNotificationRef.current,
    threshold: 0.1,
  });

  const { data, isLoading, isFetchingNextPage, fetchNextPage, hasNextPage } =
    trpc.notification.getNotifications.useInfiniteQuery(
      {
        limit: INFINITE_SCROLL_PAGINATION_RESULTS,
      },
      {
        enabled: open,
        getNextPageParam: (lastPage) => lastPage.nextCursor,
      },
    );

  const { mutate: markAsRead, isLoading: isMarkingAsRead } =
    trpc.notification.markAsRead.useMutation();

  useEffect(() => {
    if (hasNextPage && entry?.isIntersecting) {
      fetchNextPage();
    }
  }, [entry, fetchNextPage, isLoading, hasNextPage]);

  const notifications = data?.pages.flatMap((page) => page.notifications) || [];

  return (
    <ScrollArea className="relative h-full min-h-40 w-full lg:h-80">
      <ul>
        {isLoading ? (
          Array.from({ length: 4 }, () => "").map((_, index) => (
            <li key={`notification-card-skeleton-${index}`}>
              <NotificationCardSkeleton key={index} />
              <Separator className="my-0" />
            </li>
          ))
        ) : notifications.length === 0 ? (
          <NoNotifications />
        ) : (
          notifications.map((notification, index) => {
            if (index === notifications.length - 1) {
              return (
                <li
                  key={notification.id}
                  onClick={() => {
                    !isMarkingAsRead && markAsRead({ id: notification.id });
                    onClose();
                  }}
                  ref={ref}
                >
                  <NotificationCard notification={notification} />
                  <Separator className="my-0" />
                </li>
              );
            }

            return (
              <li
                key={notification.id}
                onClick={() => {
                  !isMarkingAsRead && markAsRead({ id: notification.id });
                  onClose();
                }}
              >
                <NotificationCard notification={notification} />
                <Separator className="my-0" />
              </li>
            );
          })
        )}
        {isFetchingNextPage && (
          <li>
            <NotificationCardSkeleton />
          </li>
        )}
      </ul>
    </ScrollArea>
  );
};

const NoNotifications = () => {
  return (
    <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 text-default/30">
      <Icons.noNotifications className="h-12 w-12" />
      <p>No notifications yet</p>
    </div>
  );
};

export default Notifications;
