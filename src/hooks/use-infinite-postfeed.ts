import { INFINITE_SCROLL_PAGINATION_RESULTS } from "@/lib/config";
import { RouterOutputs, trpc } from "@/lib/trpc";
import { VoteType } from "@prisma/client";
import { InfiniteData } from "@tanstack/react-query";

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

interface InfiniteUserPostsProps extends CommonInfinitePostsProps {
  type: "userPost";
  authorId: string;
}

interface InfiniteUserQuestionsProps extends CommonInfinitePostsProps {
  type: "userQuestion";
  authorId: string;
}

interface InfinteVotedPostsProps extends CommonInfinitePostsProps {
  type: "votedPost";
  authorId: string;
  voteType: VoteType;
}

interface InfiniteSearchPostsProps {
  type: "searchPost";
  query: string;
}

interface InfinitePopularPostsProps extends CommonInfinitePostsProps {
  type: "popularPost";
}

interface InfiniteAnswerPostsProps extends CommonInfinitePostsProps {
  type: "answerPost";
  communityIds: string[];
}

type Options =
  | InfiniteCommunityPostsProps
  | InfiniteAuthenticatedPostsProps
  | InfiniteGeneralPostsProps
  | InfiniteUserPostsProps
  | InfiniteUserQuestionsProps
  | InfinteVotedPostsProps
  | InfiniteSearchPostsProps
  | InfinitePopularPostsProps
  | InfiniteAnswerPostsProps;

type DataReturnType<T extends Options> = T extends InfiniteCommunityPostsProps
  ? InfiniteData<RouterOutputs["post"]["infiniteCommunityPosts"]>
  : T extends InfiniteAuthenticatedPostsProps
    ? InfiniteData<RouterOutputs["post"]["infiniteAuthenticatedPosts"]>
    : T extends InfiniteGeneralPostsProps
      ? InfiniteData<RouterOutputs["post"]["infiniteGeneralPosts"]>
      : T extends InfiniteUserPostsProps
        ? InfiniteData<RouterOutputs["post"]["infiniteUserPosts"]>
        : T extends InfiniteUserQuestionsProps
          ? InfiniteData<RouterOutputs["post"]["infiniteUserQuestions"]>
          : T extends InfinteVotedPostsProps
            ? InfiniteData<RouterOutputs["post"]["infiniteVotedPosts"]>
            : T extends InfiniteSearchPostsProps
              ? InfiniteData<RouterOutputs["search"]["infiniteSearchPosts"]>
              : T extends InfinitePopularPostsProps
                ? InfiniteData<RouterOutputs["post"]["infinitePopularPosts"]>
                : InfiniteData<RouterOutputs["post"]["infiniteAnswerPosts"]>;

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
        : options.type === "generalPost"
          ? trpc.post.infiniteGeneralPosts.useInfiniteQuery(
              {
                limit: INFINITE_SCROLL_PAGINATION_RESULTS,
              },
              {
                getNextPageParam: (lastPage) => lastPage?.nextCursor,
              },
            )
          : options.type === "userPost"
            ? trpc.post.infiniteUserPosts.useInfiniteQuery(
                {
                  limit: INFINITE_SCROLL_PAGINATION_RESULTS,
                  authorId: options.authorId,
                  currentUserId: options.userId,
                },
                { getNextPageParam: (lastPage) => lastPage?.nextCursor },
              )
            : options.type === "userQuestion"
              ? trpc.post.infiniteUserQuestions.useInfiniteQuery(
                  {
                    limit: INFINITE_SCROLL_PAGINATION_RESULTS,
                    authorId: options.authorId,
                    currentUserId: options.userId,
                  },
                  { getNextPageParam: (lastPage) => lastPage?.nextCursor },
                )
              : options.type === "votedPost"
                ? trpc.post.infiniteVotedPosts.useInfiniteQuery(
                    {
                      limit: INFINITE_SCROLL_PAGINATION_RESULTS,
                      authorId: options.authorId,
                      voteType: options.voteType,
                      currentUserId: options.userId,
                    },
                    { getNextPageParam: (lastPage) => lastPage?.nextCursor },
                  )
                : options.type === "searchPost"
                  ? trpc.search.infiniteSearchPosts.useInfiniteQuery({
                      limit: INFINITE_SCROLL_PAGINATION_RESULTS,
                      query: options.query,
                    })
                  : options.type === "popularPost"
                    ? trpc.post.infinitePopularPosts.useInfiniteQuery(
                        {
                          limit: INFINITE_SCROLL_PAGINATION_RESULTS,
                          currentUserId: options.userId,
                        },
                        {
                          getNextPageParam: (lastPage) => lastPage?.nextCursor,
                        },
                      )
                    : trpc.post.infiniteAnswerPosts.useInfiniteQuery(
                        {
                          limit: INFINITE_SCROLL_PAGINATION_RESULTS,
                          userId: options.userId,
                          communityIds: options.communityIds,
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
