import { INFINITE_SCROLL_PAGINATION_RESULTS } from "@/lib/config";
import { RouterOutputs, trpc } from "@/lib/trpc";
import { InfiniteData } from "@tanstack/react-query";

interface CommonInfiniteCommentsProps {
  userId: string | undefined;
  disabled?: boolean;
}

interface InfinitePostCommentsProps extends CommonInfiniteCommentsProps {
  type: "postComment";
  postId: string;
}

type Options = InfinitePostCommentsProps;

type DataReturnType<T extends Options> = T extends InfinitePostCommentsProps
  ? InfiniteData<RouterOutputs["comment"]["infiniteComments"]>
  : InfiniteData<RouterOutputs["comment"]["infiniteComments"]>;

export function useInfiniteCommentFeed<T extends Options>(options: T) {
  const trpcInfiniteQueryRequest =
    trpc.comment.infiniteComments.useInfiniteQuery(
      {
        limit: INFINITE_SCROLL_PAGINATION_RESULTS,
        postId: options.postId,
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
