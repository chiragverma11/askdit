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
