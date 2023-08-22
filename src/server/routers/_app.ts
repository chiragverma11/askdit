import { z } from "zod";
import { publicProcedure, router } from "../trpc";
import { db } from "@/lib/db";
import { getAuthSession } from "@/lib/auth";
import { TRPCError } from "@trpc/server";

export const appRouter = router({
  createCommunity: publicProcedure
    .input(z.object({ communityName: z.string() }))
    .mutation(async (opts) => {
      const session = await getAuthSession();

      if (!session?.user) {
        throw new TRPCError({
          code: "UNAUTHORIZED",
          message: "You are unauthorized to create a community.",
        });
      }

      const communityName = opts.input.communityName;

      const subredditExists = await db.subreddit.findFirst({
        where: {
          name: communityName,
        },
      });

      if (subredditExists) {
        return new Response("Subreddit already exists", { status: 409 });
      }

      const subreddit = await db.subreddit.create({
        data: {
          name: communityName,
          creatorId: session.user?.id,
        },
      });

      await db.subscription.create({
        data: {
          userId: session.user?.id,
          subredditId: subreddit.id,
        },
      });

      return subreddit.name;
    }),
});

export type AppRouter = typeof appRouter;
