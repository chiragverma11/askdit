import {
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
});
