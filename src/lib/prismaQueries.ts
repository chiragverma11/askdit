import { INFINITE_SCROLL_PAGINATION_RESULTS } from "./config";
import { db } from "./db";

export const getCommunity = async (
  communityName: string,
  userId: string | undefined,
) => {
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
    },
    include: {
      author: true,
      votes: true,
      comments: true,
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
  });

  return { posts, communityIds };
};

export const getCommunityPost = async ({
  postId,
  userId,
}: {
  postId: string;
  userId: string;
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
      comments: true,
      bookmarks: {
        where: {
          userId: userId,
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

export const getCommunityInfo = async ({ name }: { name: string }) => {
  const community = await db.subreddit.findFirst({
    where: { name },
  });

  return community;
};

export const getUserInfo = async ({ username }: { username: string }) => {
  const userInfo = await db.user.findUnique({
    where: {
      username,
    },
    select: {
      id: true,
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
    },
    include: {
      author: true,
      votes: true,
      comments: true,
      subreddit: true,
      bookmarks: {
        where: {
          userId: currentUserId,
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
