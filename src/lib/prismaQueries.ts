import { Prisma, PrismaClient, VoteType } from "@prisma/client";
import { DefaultArgs } from "@prisma/client/runtime/library";
import {
  INFINITE_SCROLL_COMMENT_RESULTS,
  INFINITE_SCROLL_PAGINATION_RESULTS,
} from "./config";
import { db } from "./db";

export const getCommunity = async (
  communityName: string,
  userId: string | undefined,
) => {
  const subreddit = await db.subreddit.findFirst({
    where: {
      name: {
        equals: communityName,
        mode: "insensitive",
      },
    },
    include: {
      _count: {
        select: {
          subscribers: true,
        },
      },
      posts: {
        include: {
          author: true,
          votes: true,
          _count: {
            select: {
              comments: true,
            },
          },
          subreddit: true,
          bookmarks: {
            where: {
              userId: userId,
            },
          },
        },
        orderBy: {
          createdAt: "desc",
        },
        take: INFINITE_SCROLL_PAGINATION_RESULTS,
      },
    },
  });

  return subreddit;
};

export const getGeneralFeedPosts = async () => {
  const posts = await db.post.findMany({
    include: {
      author: true,
      votes: true,
      subreddit: true,
      _count: {
        select: {
          comments: true,
        },
      },
    },
    orderBy: {
      createdAt: "desc",
    },
    take: INFINITE_SCROLL_PAGINATION_RESULTS,
    where: {
      isQuestion: false,
    },
  });

  return posts;
};

export const getAuthenticatedFeedPosts = async ({
  userId,
}: {
  userId: string | undefined;
}) => {
  const userSubscriptions = await db.subscription.findMany({
    where: {
      userId: userId,
    },
    select: {
      subredditId: true,
    },
  });

  const communityIds = userSubscriptions.map((sub) => sub.subredditId);

  const posts = await db.post.findMany({
    where: {
      subredditId: {
        in: communityIds,
      },
      isQuestion: false,
    },
    include: {
      author: true,
      votes: true,
      subreddit: true,
      bookmarks: {
        where: {
          userId: userId,
        },
      },
      _count: {
        select: {
          comments: true,
        },
      },
    },
    orderBy: {
      createdAt: "desc",
    },
    take: INFINITE_SCROLL_PAGINATION_RESULTS,
  });

  return { posts, communityIds };
};

export const getCommunityPost = async ({
  postId,
  userId,
}: {
  postId: string;
  userId: string | undefined;
}) => {
  const communityPost = await db.post.findFirst({
    where: {
      id: postId,
    },
    include: {
      author: true,
      votes: true,
      subreddit: {
        include: {
          _count: {
            select: {
              subscribers: true,
            },
          },
        },
      },
      bookmarks: {
        where: {
          userId: userId,
        },
      },
      _count: {
        select: {
          comments: true,
        },
      },
    },
  });

  return communityPost;
};

export const getSubscription = async ({
  communityName,
  userId,
}: {
  communityName: string;
  userId: string;
}) => {
  const subscription = await db.subscription.findFirst({
    where: {
      Subreddit: { name: communityName },
      user: {
        id: userId,
      },
    },
  });

  return subscription;
};

export const getCreator = async ({ creatorId }: { creatorId: string }) => {
  const creator = await db.user.findFirst({
    where: {
      id: creatorId,
    },
  });

  return creator;
};

export const getCommunityMetadata = async ({ name }: { name: string }) => {
  const community = await db.subreddit.findFirst({
    where: {
      name: {
        equals: name,
        mode: "insensitive",
      },
    },
    select: {
      id: true,
      name: true,
      description: true,
    },
  });

  return community;
};

export const getCommunityInfo = async ({ name }: { name: string }) => {
  const community = await db.subreddit.findFirst({
    where: { name },
  });

  return community;
};

export const getUserInfo = async ({ username }: { username: string }) => {
  const userInfo = await db.user.findFirst({
    where: {
      username: {
        equals: username,
        mode: "insensitive",
      },
    },
    select: {
      id: true,
      username: true,
      name: true,
      image: true,
    },
  });

  return userInfo;
};

export const getUserIdByUsername = async ({
  username,
}: {
  username: string;
}) => {
  const user = await db.user.findUnique({
    where: {
      username,
    },
    select: {
      id: true,
    },
  });

  return user?.id;
};

export const getUserPosts = async ({
  username,
  currentUserId,
}: {
  username: string;
  currentUserId: string | undefined;
}) => {
  const authorId = await getUserIdByUsername({ username });

  const userPosts = await db.post.findMany({
    where: {
      authorId,
      isQuestion: false,
    },
    include: {
      author: true,
      votes: true,
      subreddit: true,
      bookmarks: {
        where: {
          userId: currentUserId,
        },
      },
      _count: {
        select: {
          comments: true,
        },
      },
    },
    orderBy: {
      createdAt: "desc",
    },
    take: INFINITE_SCROLL_PAGINATION_RESULTS,
  });

  return { authorId, userPosts };
};

export const getUserComments = async ({
  username,
  currentUserId,
}: {
  username: string;
  currentUserId: string | undefined;
}) => {
  const authorId = await getUserIdByUsername({ username });

  const userComments = await db.comment.findMany({
    where: {
      authorId,
      deleted: false,
      acceptedAnswer: false,
    },
    include: {
      author: true,
      votes: true,
      bookmarks: {
        where: {
          userId: currentUserId,
        },
      },
      post: {
        select: {
          subreddit: {
            select: {
              name: true,
            },
          },
        },
      },
    },
    orderBy: {
      createdAt: "desc",
    },
    take: INFINITE_SCROLL_PAGINATION_RESULTS,
  });

  return { authorId, userComments };
};

export const getUserVotedPosts = async ({
  userId,
  voteType,
}: {
  userId: string;
  voteType: VoteType;
}) => {
  const posts = await db.post.findMany({
    where: {
      votes: {
        some: {
          type: voteType,
          userId: userId,
        },
      },
    },
    include: {
      author: true,
      votes: true,
      subreddit: true,
      bookmarks: {
        where: {
          userId: userId,
        },
      },
      _count: {
        select: {
          comments: true,
        },
      },
    },
    orderBy: {
      createdAt: "desc",
    },
    take: INFINITE_SCROLL_PAGINATION_RESULTS,
  });

  return posts;
};

export const getUserBookmarks = async ({ userId }: { userId: string }) => {
  const userBookmarks = await db.bookmark.findMany({
    where: {
      userId,
    },
    include: {
      post: {
        include: {
          author: true,
          votes: true,
          _count: {
            select: {
              comments: true,
            },
          },
          subreddit: true,
        },
      },
      comment: {
        where: {
          deleted: false,
        },
        include: {
          author: true,
          votes: true,
          post: {
            select: {
              subreddit: {
                select: {
                  name: true,
                },
              },
            },
          },
        },
      },
    },
    orderBy: {
      createdAt: "desc",
    },
    take: INFINITE_SCROLL_PAGINATION_RESULTS,
  });

  return userBookmarks;
};

export const getSearchPosts = async ({ query }: { query: string }) => {
  const posts = await db.post.findMany({
    take: INFINITE_SCROLL_PAGINATION_RESULTS,
    where: {
      title: {
        contains: query,
        mode: "insensitive",
      },
    },
    include: {
      author: true,
      votes: true,
      subreddit: true,
      _count: {
        select: {
          comments: true,
        },
      },
    },
  });

  return posts;
};

export const getSearchCommunities = async ({
  query,
  userId,
}: {
  query: string;
  userId: string | undefined;
}) => {
  const communties = await db.subreddit.findMany({
    take: INFINITE_SCROLL_PAGINATION_RESULTS,
    where: {
      name: {
        contains: query,
        mode: "insensitive",
      },
    },
    select: {
      id: true,
      name: true,
      image: true,
      creatorId: true,
      _count: {
        select: {
          subscribers: true,
        },
      },
      subscribers: {
        where: {
          userId,
        },
      },
    },
  });

  return communties;
};

export const getSearchComments = async ({
  query,
  userId,
}: {
  query: string;
  userId: string | undefined;
}) => {
  const comments = await db.comment.findMany({
    take: INFINITE_SCROLL_COMMENT_RESULTS,
    where: {
      text: {
        contains: query,
        mode: "insensitive",
      },
      deleted: false,
    },
    orderBy: {
      createdAt: "desc",
    },
    include: {
      author: true,
      votes: true,
      bookmarks: {
        where: {
          userId: userId,
        },
      },
      post: {
        select: {
          subreddit: {
            select: {
              name: true,
            },
          },
        },
      },
    },
  });

  return comments;
};

export const getSearchUsers = async ({
  query,
  userId,
}: {
  query: string;
  userId: string | undefined;
}) => {
  const users = await db.user.findMany({
    take: INFINITE_SCROLL_COMMENT_RESULTS,
    where: {
      username: {
        contains: query,
        mode: "insensitive",
      },
      ...(userId && {
        NOT: {
          id: userId,
        },
      }),
    },
    select: {
      id: true,
      name: true,
      username: true,
      image: true,
    },
  });

  return users;
};

export const updatePostIsAnswered = async (
  tx: Omit<
    PrismaClient<Prisma.PrismaClientOptions, never, DefaultArgs>,
    "$connect" | "$disconnect" | "$on" | "$transaction" | "$use" | "$extends"
  >,
  commentId: string,
  postId: string,
) => {
  const acceptedAnswers = await tx.comment.findMany({
    where: {
      postId,
      acceptedAnswer: true,
    },
    select: {
      id: true,
    },
  });

  if (acceptedAnswers.length === 0) {
    await tx.post.update({
      where: {
        id: postId,
      },
      data: {
        isAnswered: true,
      },
    });
  } else if (acceptedAnswers.length === 1) {
    if (acceptedAnswers.some((answer) => answer.id === commentId)) {
      await tx.post.update({
        where: {
          id: postId,
        },
        data: {
          isAnswered: false,
        },
      });
    }
  }
};

export const getPopularPosts = async ({
  currentUserId,
}: {
  currentUserId: string | undefined;
}) => {
  const popularPosts = await db.post.findMany({
    take: INFINITE_SCROLL_PAGINATION_RESULTS,
    orderBy: [
      { votes: { _count: "desc" } },
      { comments: { _count: "desc" } },
      { createdAt: "desc" },
    ],
    include: {
      author: true,
      votes: true,
      subreddit: true,
      bookmarks: {
        where: {
          userId: currentUserId,
        },
      },
      _count: {
        select: {
          comments: true,
        },
      },
    },
    where: {
      votes: { some: { type: "UP" } },
    },
  });

  return popularPosts;
};

export const getPostTitle = async ({ postId }: { postId: string }) => {
  const post = await db.post.findUnique({
    where: {
      id: postId,
    },
    select: {
      title: true,
    },
  });

  return post?.title;
};

export const getQuestions = async ({
  currentUserId,
}: {
  currentUserId: string | undefined;
}) => {
  const userSubscriptions = await db.subscription.findMany({
    where: {
      userId: currentUserId,
    },
    select: {
      subredditId: true,
    },
  });

  const communityIds = userSubscriptions.map((sub) => sub.subredditId);

  const posts = await db.post.findMany({
    where: {
      subredditId: {
        in: communityIds,
      },
      isQuestion: true,
    },
    include: {
      author: true,
      votes: true,
      subreddit: true,
      bookmarks: {
        where: {
          userId: currentUserId,
        },
      },
      _count: {
        select: {
          comments: true,
        },
      },
    },
    orderBy: {
      createdAt: "desc",
    },
    take: INFINITE_SCROLL_PAGINATION_RESULTS,
  });

  return { posts, communityIds };
};

export const getUserQuestions = async ({
  username,
  currentUserId,
}: {
  username: string;
  currentUserId: string | undefined;
}) => {
  const authorId = await getUserIdByUsername({ username });

  const userQuestions = await db.post.findMany({
    where: {
      authorId,
      isQuestion: true,
    },
    include: {
      author: true,
      votes: true,
      subreddit: true,
      bookmarks: {
        where: {
          userId: currentUserId,
        },
      },
      _count: {
        select: {
          comments: true,
        },
      },
    },
    orderBy: {
      createdAt: "desc",
    },
    take: INFINITE_SCROLL_PAGINATION_RESULTS,
  });

  return { authorId, userQuestions };
};

export const getUserAnswers = async ({
  username,
  currentUserId,
}: {
  username: string;
  currentUserId: string | undefined;
}) => {
  const authorId = await getUserIdByUsername({ username });

  const userAnswers = await db.comment.findMany({
    where: {
      authorId,
      deleted: false,
      post: {
        isQuestion: true,
      },
      replyToId: null,
    },
    include: {
      author: true,
      votes: true,
      bookmarks: {
        where: {
          userId: currentUserId,
        },
      },
      post: {
        select: {
          subreddit: {
            select: {
              name: true,
            },
          },
        },
      },
    },
    orderBy: {
      createdAt: "desc",
    },
    take: INFINITE_SCROLL_PAGINATION_RESULTS,
  });

  return { authorId, userAnswers };
};
