import { z } from "zod";
import { protectedProcedure, router } from "../trpc";
import { db } from "@/lib/db";
import { INFINITE_SCROLL_PAGINATION_RESULTS } from "@/lib/config";
import { TRPCError } from "@trpc/server";

export const bookmarkRouter = router({
  infiniteUserBookmarks: protectedProcedure
    .input(
      z.object({
        userId: z.string().optional(),
        limit: z.number().min(1),
        cursor: z.string().nullish(),
        skip: z.number().optional(),
      }),
    )
    .query(async (opts) => {
      const { input } = opts;
      const limit = input.limit ?? INFINITE_SCROLL_PAGINATION_RESULTS;
      const { userId, cursor, skip } = input;
      const { user } = opts.ctx;

      if (user?.id !== userId) {
        throw new TRPCError({
          code: "FORBIDDEN",
          message: "You can only view your own bookmarks",
        });
      }

      const bookmarks = await db.bookmark.findMany({
        take: limit + 1,
        skip: skip,
        cursor: cursor ? { id: cursor } : undefined,
        orderBy: {
          createdAt: "desc",
        },
        include: {
          post: {
            include: {
              author: true,
              votes: true,
              comments: true,
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
        where: {
          userId,
        },
      });

      let nextCursor: typeof cursor | undefined = undefined;
      if (bookmarks.length > limit) {
        const nextItem = bookmarks.pop();
        nextCursor = nextItem?.id;
      }
      return {
        bookmarks,
        nextCursor,
      };
    }),
});
