import { INFINITE_SCROLL_PAGINATION_RESULTS } from "@/lib/config";
import { trpc } from "@/lib/trpc";

interface InfiniteCommunityPostsProps {
  type: "communityPost";
  communityName: string;
}

interface InfiniteAuthenticatedPostsProps {
  type: "authenticatedPost";
  communityIds?: string[];
}

interface InfiniteGeneralPostsProps {
  type: "generalPost";
}

export function useInfinitePostFeed(
  options:
    | InfiniteCommunityPostsProps
    | InfiniteAuthenticatedPostsProps
    | InfiniteGeneralPostsProps,
) {
  let trpcInfiniteQueryRequest;

  if (options.type === "communityPost") {
    trpcInfiniteQueryRequest =
      trpc.post.infiniteCommunityPosts.useInfiniteQuery(
        {
          limit: INFINITE_SCROLL_PAGINATION_RESULTS,
          communityName: options.communityName!,
        },
        {
          getNextPageParam: (lastPage) => lastPage?.nextCursor,
        },
      );
  } else if (options.type === "authenticatedPost") {
    trpcInfiniteQueryRequest =
      trpc.post.infiniteAuthenticatedPosts.useInfiniteQuery(
        {
          limit: INFINITE_SCROLL_PAGINATION_RESULTS,
          communityIds: options.communityIds!,
        },
        {
          getNextPageParam: (lastPage) => lastPage?.nextCursor,
        },
      );
  } else {
    trpcInfiniteQueryRequest = trpc.post.infiniteGeneralPosts.useInfiniteQuery(
      {
        limit: INFINITE_SCROLL_PAGINATION_RESULTS,
      },
      {
        getNextPageParam: (lastPage) => lastPage?.nextCursor,
      },
    );
  }

  const { data, isLoading, isFetchingNextPage, fetchNextPage, hasNextPage } =
    trpcInfiniteQueryRequest;

  return { data, isLoading, isFetchingNextPage, fetchNextPage, hasNextPage };
}
