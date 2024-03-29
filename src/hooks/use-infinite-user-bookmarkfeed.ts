import { INFINITE_SCROLL_PAGINATION_RESULTS } from "@/lib/config";
import { trpc } from "@/lib/trpc";
import { useIntersection } from "@mantine/hooks";
import { useEffect, useRef } from "react";

interface InfiniteUserBookmarkProps {
  userId: string | undefined;
}

export function useInfiniteUserBookmarkFeed({
  userId,
}: InfiniteUserBookmarkProps) {
  const lastBookmarkRef = useRef<HTMLElement>(null);
  const { ref, entry } = useIntersection({
    root: lastBookmarkRef.current,
    threshold: 0.1,
  });

  const {
    data: rawData,
    isLoading,
    isFetchingNextPage,
    fetchNextPage,
    hasNextPage,
    refetch,
  } = trpc.bookmark.infiniteUserBookmarks.useInfiniteQuery(
    {
      limit: INFINITE_SCROLL_PAGINATION_RESULTS,
      userId: userId,
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

  const data = rawData?.pages.flatMap((page) => page.bookmarks);

  return {
    data,
    isLoading,
    isFetchingNextPage,
    fetchNextPage,
    hasNextPage,
    refetch,
    ref,
  };
}
