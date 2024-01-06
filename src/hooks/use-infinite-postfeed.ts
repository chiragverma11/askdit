import { INFINITE_SCROLL_PAGINATION_RESULTS } from "@/lib/config";
import { RouterOutputs, trpc } from "@/lib/trpc";

interface CommonInfinitePostsProps {
  userId: string | undefined;
}

interface InfiniteCommunityPostsProps extends CommonInfinitePostsProps {
  type: "communityPost";
  communityName: string;
}

interface InfiniteAuthenticatedPostsProps extends CommonInfinitePostsProps {
  type: "authenticatedPost";
  communityIds?: string[];
}

interface InfiniteGeneralPostsProps extends CommonInfinitePostsProps {
  type: "generalPost";
}

type Options =
    | InfiniteCommunityPostsProps
    | InfiniteAuthenticatedPostsProps
  | InfiniteGeneralPostsProps;

type DataReturnType<T extends Options> = T extends InfiniteCommunityPostsProps
  ? InfiniteData<RouterOutputs["post"]["infiniteCommunityPosts"]>
  : T extends InfiniteAuthenticatedPostsProps
  ? InfiniteData<RouterOutputs["post"]["infiniteAuthenticatedPosts"]>
  : InfiniteData<RouterOutputs["post"]["infiniteGeneralPosts"]>;

export function useInfinitePostFeed<T extends Options>(options: T) {
  const trpcInfiniteQueryRequest =
    options.type === "communityPost"
      ? trpc.post.infiniteCommunityPosts.useInfiniteQuery(
        {
          limit: INFINITE_SCROLL_PAGINATION_RESULTS,
            communityName: options.communityName,
            userId: options.userId,
        },
        {
          getNextPageParam: (lastPage) => lastPage?.nextCursor,
        },
        )
      : options.type === "authenticatedPost"
      ? trpc.post.infiniteAuthenticatedPosts.useInfiniteQuery(
        {
          limit: INFINITE_SCROLL_PAGINATION_RESULTS,
            communityIds: options.communityIds || [],
            userId: options.userId,
        },
        {
          getNextPageParam: (lastPage) => lastPage?.nextCursor,
        },
        )
      :  trpc.post.infiniteGeneralPosts.useInfiniteQuery(
      {
        limit: INFINITE_SCROLL_PAGINATION_RESULTS,
      },
      {
        getNextPageParam: (lastPage) => lastPage?.nextCursor,
      },
        );
  const {
    data: rawData,
    isLoading,
    isFetchingNextPage,
    fetchNextPage,
    hasNextPage,
  } = trpcInfiniteQueryRequest;

  const data = rawData as unknown as DataReturnType<T>;

  return { data, isLoading, isFetchingNextPage, fetchNextPage, hasNextPage };
}
