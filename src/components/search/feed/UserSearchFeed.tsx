"use client";

import UserAvatar from "@/components/UserAvatar";
import { INFINITE_SCROLL_PAGINATION_RESULTS } from "@/lib/config";
import { getSearchUsers } from "@/lib/prismaQueries";
import { trpc } from "@/lib/trpc";
import { useIntersection } from "@mantine/hooks";
import Link from "next/link";
import { FC, useEffect, useRef } from "react";
import Skeleton, { SkeletonTheme } from "react-loading-skeleton";

type SearchUsersType = Awaited<ReturnType<typeof getSearchUsers>>;

interface UserSearchFeedProps {
  query: string;
  userId: string | undefined;
  initialUsers: SearchUsersType;
}

const UserSearchFeed: FC<UserSearchFeedProps> = ({ query, userId, initialUsers }) => {
  const lastPostRef = useRef<HTMLElement>(null);
  const { ref, entry } = useIntersection({
    root: lastPostRef.current,
    threshold: 0.1,
  });

  const { data, isLoading, isFetchingNextPage, fetchNextPage, hasNextPage } =
    trpc.search.infiniteSearchUsers.useInfiniteQuery({
      limit: INFINITE_SCROLL_PAGINATION_RESULTS,
      query,
      userId,
    },
      {
        getNextPageParam: (lastPage) => lastPage?.nextCursor,
      },
    );

  useEffect(() => {
    if (hasNextPage && entry?.isIntersecting) {
      fetchNextPage();
    }
  }, [entry, fetchNextPage, isLoading, hasNextPage]);

  const users =
    data?.pages.flatMap((page) => page.users) ?? initialUsers;

  return (
    <ul className="flex w-full flex-col items-center gap-4 px-4 pb-16 lg:max-h-none lg:pb-4 lg:pr-4">
      {users.map((user, index) => {
        if (index === users.length - 1) {
          return (
            <li ref={ref} key={user.id} className="w-full">
              <UserCard user={user} />
            </li>
          );
        } else {
          return (
            <li key={user.id} className="w-full">
              <UserCard user={user} />
            </li>
          );
        }
      })}
      {isFetchingNextPage ? (
        <li className="relative -mb-24 lg:-mb-8 w-full">
          <div className="-mb-24 h-44 overflow-hidden lg:-mb-8 lg:h-40">
            <UserCardSkeleton />
          </div>
        </li>
      ) : null}
    </ul>
  );


};

interface UserCardProps {
  user: SearchUsersType[number];
}

const UserCard: FC<UserCardProps> = ({ user }) => {
  return (
    <Link
      href={`/u/${user.username}`}
      className="flex w-full cursor-pointer items-center gap-4 rounded-xl border border-y border-default/20 bg-emphasis bg-emphasis/75 px-4 py-4 text-base font-medium text-default/75 aria-selected:text-default/90 md:rounded-xl md:border lg:p-4 lg:hover:border-default/60"
    >
      <UserAvatar
        user={{ name: user.name, image: user.image }}
        className="h-10 w-10"
      />
      <div className="flex flex-col">
        <span className="text-sm">u/{user.username}</span>
      </div>
    </Link>
  );
};

interface UserCardSkeletonProps {
  disableAnimation?: boolean;
}

export const UserCardSkeleton: FC<UserCardSkeletonProps> = ({
  disableAnimation = false,
}) => {
  return (
    <SkeletonTheme
      baseColor="var(--skeleton-base)"
      highlightColor="var(--skeleton-highlight)"
      duration={2}
      inline={false}
      enableAnimation={!disableAnimation}
    >
      <div className="flex cursor-pointer items-center gap-4 border-y border-default/25 bg-emphasis/75 px-5 py-5 text-base font-medium text-default/75 aria-selected:text-default/90 md:rounded-xl md:border lg:p-4 lg:hover:border-default/60">
        <Skeleton className="aspect-square h-10 w-10 text-2xl" circle={true} />
        <div className="flex flex-col">
          <Skeleton className="text-lg" width={"7rem"} />
        </div>
      </div>
    </SkeletonTheme>
  );
};

export default UserSearchFeed;
