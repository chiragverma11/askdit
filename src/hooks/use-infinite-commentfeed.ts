import { INFINITE_SCROLL_PAGINATION_RESULTS } from "@/lib/config";
import { RouterOutputs, trpc } from "@/lib/trpc";
import { InfiniteData } from "@tanstack/react-query";

interface CommonInfiniteCommentsProps {
  userId: string | undefined;
  disabled?: boolean;
}

interface InfiniteUserCommentsProps extends CommonInfiniteCommentsProps {
  type: "userComment";
  authorId: string;
}

interface InfinitePostCommentsProps extends CommonInfiniteCommentsProps {
  type: "postComment";
  postId: string;
}

interface InfiniteSearchCommentsProps extends CommonInfiniteCommentsProps {
  type: "searchComment";
  query: string;
}

type Options = InfiniteUserCommentsProps | InfinitePostCommentsProps | InfiniteSearchCommentsProps;

type DataReturnType<T extends Options> = T extends InfiniteUserCommentsProps
  ? InfiniteData<RouterOutputs["comment"]["infiniteUserComments"]>
  : T extends InfinitePostCommentsProps ? InfiniteData<RouterOutputs["comment"]["infiniteComments"]> :
  InfiniteData<RouterOutputs["search"]["infiniteSearchComments"]>;

export function useInfiniteCommentFeed<T extends Options>(options: T) {
  const trpcInfiniteQueryRequest =
    options.type === "userComment"
      ? trpc.comment.infiniteUserComments.useInfiniteQuery(
        {
          limit: INFINITE_SCROLL_PAGINATION_RESULTS,
          authorId: options.authorId,
          currentUserId: options.userId,
        },
        {
          getNextPageParam: (lastPage) => lastPage?.nextCursor,
          enabled: !options?.disabled,
        },
      )
      : options.type === "postComment" ? trpc.comment.infiniteComments.useInfiniteQuery(
        {
          limit: INFINITE_SCROLL_PAGINATION_RESULTS,
          postId: options.postId,
          userId: options.userId,
        },
        {
          getNextPageParam: (lastPage) => lastPage?.nextCursor,
          enabled: !options?.disabled,
        },
      ) : trpc.search.infiniteSearchComments.useInfiniteQuery(
        {
          limit: INFINITE_SCROLL_PAGINATION_RESULTS,
          query: options.query,
          userId: options.userId,
        },
        {
          getNextPageParam: (lastPage) => lastPage?.nextCursor,
          enabled: !options?.disabled,
        },
      );

  const {
    data: rawData,
    isLoading,
    isFetchingNextPage,
    fetchNextPage,
    hasNextPage,
    refetch,
  } = trpcInfiniteQueryRequest;

  const data = rawData as unknown as DataReturnType<T>;

  return {
    data,
    isLoading,
    isFetchingNextPage,
    fetchNextPage,
    hasNextPage,
    refetch,
  };
}
