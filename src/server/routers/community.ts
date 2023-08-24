import { COMMUNITY_NAME_REGEX } from "@/lib/config";
import { db } from "@/lib/db";
import { TRPCError } from "@trpc/server";
import { z } from "zod";
import { protectedProcedure, router } from "../trpc";

export const communityRouter = router({
  //Create Community
  createCommunity: protectedProcedure
    .input(z.object({ communityName: z.string().regex(COMMUNITY_NAME_REGEX) }))
    .mutation(async (opts) => {
      const communityName = opts.input.communityName;
      const { user } = opts.ctx;

      const communityExists = await db.subreddit.findFirst({
        where: {
          name: communityName,
        },
      });

      if (communityExists) {
        throw new TRPCError({
          code: "CONFLICT",
          message: "Community already exists.",
        });
      }

      const community = await db.subreddit.create({
        data: {
          name: communityName,
          creatorId: user.id,
        },
      });

      await db.subscription.create({
        data: {
          userId: user.id,
          subredditId: community.id,
        },
      });

      return community.name;
    }),

  //subscribe community
  subscribe: protectedProcedure
    .input(z.object({ communityId: z.string() }))
    .mutation(async (opts) => {
      const communityId = opts.input.communityId;
      const { user } = opts.ctx;

      const subscriptionExists = await db.subscription.findFirst({
        where: {
          subredditId: communityId,
          userId: user.id,
        },
      });

      if (subscriptionExists) {
        throw new TRPCError({
          code: "CONFLICT",
          message: "You have already subscribed.",
        });
      }

      await db.subscription.create({
        data: {
          subredditId: communityId,
          userId: user.id,
        },
      });

      return {
        communityId,
        message: "Subscribed successfully.",
      };
    }),
  //subscribe community
  unsubscribe: protectedProcedure
    .input(z.object({ communityId: z.string() }))
    .mutation(async (opts) => {
      const communityId = opts.input.communityId;
      const { user } = opts.ctx;

      const subscriptionExists = await db.subscription.findFirst({
        where: {
          subredditId: communityId,
          userId: user.id,
        },
      });

      if (!subscriptionExists) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "You've not been subscribed to this subreddit, yet.",
        });
      }

      await db.subscription.delete({
        where: {
          userId_subredditId: {
            userId: user.id,
            subredditId: communityId,
          },
        },
      });

      return {
        communityId,
        message: "Unsubscribed successfully.",
      };
    }),
});
