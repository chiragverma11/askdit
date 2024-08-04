import {
  INFINITE_SCROLL_COMMENT_RESULTS,
  INFINITE_SCROLL_PAGINATION_RESULTS,
  SEARCH_SUGGESTIONS_LIMIT,
} from "@/lib/config";
import { db } from "@/lib/db";
import { z } from "zod";
import { publicProcedure, router } from "../trpc";

export const searchRouter = router({
  searchSuggestions: publicProcedure
    .input(
      z.object({
        query: z.string().min(1),
        userId: z.string().optional(),
        limit: z.number().min(1).default(SEARCH_SUGGESTIONS_LIMIT),
      }),
    )
    .query(async (opts) => {
      const { query, userId, limit } = opts.input;

      const communitySuggestions = await db.subreddit.findMany({
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
          _count: {
            select: {
              subscribers: true,
            },
          },
        },
        take: limit,
      });

      const userSuggestions = await db.user.findMany({
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
        take: limit,
      });

      return { communitySuggestions, userSuggestions, query };
    }),
  infiniteSearchUsers: publicProcedure
    .input(
      z.object({
        query: z.string().min(1),
        userId: z.string().optional(),
        limit: z.number().min(1),
        cursor: z.string().nullish(),
        skip: z.number().optional(),
      }),
    )
    .query(async (opts) => {
      const { input } = opts;
      const limit = input.limit ?? INFINITE_SCROLL_PAGINATION_RESULTS;
      const { query, userId, cursor, skip } = opts.input;

      const users = await db.user.findMany({
        take: limit + 1,
        skip: skip,
        cursor: cursor ? { id: cursor } : undefined,
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

      let nextCursor: typeof cursor | undefined = undefined;
      if (users.length > limit) {
        const nextItem = users.pop();
        nextCursor = nextItem?.id;
      }

      return { users, nextCursor };
    }),
  infiniteSearchPosts: publicProcedure
    .input(
      z.object({
        query: z.string().min(1),
        limit: z.number().min(1),
        cursor: z.string().nullish(),
        skip: z.number().optional(),
      }),
    )
    .query(async (opts) => {
      const { input } = opts;
      const limit = input.limit ?? INFINITE_SCROLL_PAGINATION_RESULTS;
      const { query, skip, cursor } = input;

      const posts = await db.post.findMany({
        take: limit + 1,
        skip: skip,
        cursor: cursor ? { id: cursor } : undefined,
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

      let nextCursor: typeof cursor | undefined = undefined;
      if (posts.length > limit) {
        const nextItem = posts.pop();
        nextCursor = nextItem?.id;
      }
      return {
        posts,
        nextCursor,
      };
    }),
  infiniteSearchCommunities: publicProcedure
    .input(
      z.object({
        query: z.string().min(1),
        userId: z.string().optional(),
        limit: z.number().min(1),
        cursor: z.string().nullish(),
        skip: z.number().optional(),
      }),
    )
    .query(async (opts) => {
      const { input } = opts;
      const limit = input.limit ?? INFINITE_SCROLL_PAGINATION_RESULTS;
      const { query, userId, skip, cursor } = input;

      const communities = await db.subreddit.findMany({
        take: limit + 1,
        skip: skip,
        cursor: cursor ? { id: cursor } : undefined,
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

      let nextCursor: typeof cursor | undefined = undefined;
      if (communities.length > limit) {
        const nextItem = communities.pop();
        nextCursor = nextItem?.id;
      }
      return {
        communities,
        nextCursor,
      };
    }),
  infiniteSearchComments: publicProcedure
    .input(
      z.object({
        query: z.string().min(1),
        userId: z.string().optional(),
        limit: z.number().min(1),
        cursor: z.string().nullish(),
        skip: z.number().optional(),
      }),
    )
    .query(async (opts) => {
      const { input } = opts;
      const limit = input.limit ?? INFINITE_SCROLL_COMMENT_RESULTS;
      const { skip, query, userId, cursor } = input;

      const comments = await db.comment.findMany({
        take: limit + 1,
        skip: skip,
        cursor: cursor ? { id: cursor } : undefined,
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

      let nextCursor: typeof cursor | undefined = undefined;
      if (comments.length > limit) {
        const nextItem = comments.pop();
        nextCursor = nextItem?.id;
      }

      return {
        comments,
        nextCursor,
      };
    }),
});
