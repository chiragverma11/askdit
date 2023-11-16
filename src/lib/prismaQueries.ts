import { INFINITE_SCROLL_PAGINATION_RESULTS } from "./config";
import { db } from "./db";

export const getCommunity = async (communityName: string) => {
  const subreddit = await db.subreddit.findFirst({
    where: {
      name: communityName,
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
          comments: true,
          subreddit: true,
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
      comments: true,
      subreddit: true,
    },
    orderBy: {
      createdAt: "desc",
    },
    take: INFINITE_SCROLL_PAGINATION_RESULTS,
  });

  return posts;
};

export const getAuthenticatedFeedPosts = async ({
  userId,
}: {
  userId: string;
}) => {
  const subscriptions = await db.subscription.findMany({
    where: {
      userId: userId,
    },
  });

  const posts = await db.post.findMany({
    where: {
      subredditId: {
        in: subscriptions.map((sub) => sub.subredditId),
      },
    },
    include: {
      author: true,
      votes: true,
      comments: true,
      subreddit: true,
    },
    orderBy: {
      createdAt: "desc",
    },
    take: INFINITE_SCROLL_PAGINATION_RESULTS,
  });

  return { posts, subscriptions };
};
