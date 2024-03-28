import { COMMUNITIES_SEARCH_RESULT, COMMUNITY_NAME_REGEX } from "@/lib/config";
import { db } from "@/lib/db";
import { ImageKitImageBulkDeleter } from "@/lib/imagekit/imagesDeleter";
import { DescriptionValidator } from "@/lib/validators/community";
import { TRPCError } from "@trpc/server";
import { z } from "zod";
import { protectedProcedure, publicProcedure, router } from "../trpc";

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
  yourCommunities: protectedProcedure.query(async (opts) => {
    const { user } = opts.ctx;

    const yourCommunities = await db.subscription.findMany({
      where: {
        userId: user.id,
      },
      include: {
        Subreddit: {
          include: {
            _count: {
              select: {
                subscribers: true,
              },
            },
          },
        },
      },
    });

    return yourCommunities;
  }),
  exploreCommunities: protectedProcedure.query(async (opts) => {
    const { user } = opts.ctx;

    const exploreCommunities = await db.subreddit.findMany({
      where: {
        NOT: {
          subscribers: {
            some: {
              userId: user.id,
            },
          },
        },
      },
      include: {
        _count: {
          select: {
            subscribers: true,
          },
        },
      },
      orderBy: {
        subscribers: {
          _count: "desc",
        },
      },
    });

    return exploreCommunities;
  }),
  addDescription: protectedProcedure
    .input(DescriptionValidator)
    .mutation(async (opts) => {
      const { user } = opts.ctx;
      const { communityId, description } = opts.input;

      const newDescription: string | null =
        description === "" ? null : description;

      const community = await db.subreddit.findFirst({
        where: {
          id: communityId,
        },
      });

      if (!community) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Community not found.",
        });
      }

      if (community.creatorId !== user.id) {
        throw new TRPCError({
          code: "FORBIDDEN",
        });
      }

      await db.subreddit.update({
        where: {
          id: communityId,
        },
        data: {
          description: newDescription,
        },
      });

      return { message: "Description added", description: newDescription };
    }),
  searchCommunities: publicProcedure
    .input(z.object({ query: z.string().min(1), userId: z.string().optional() }))
    .query(async (opts) => {
      const { query, userId } = opts.input;

      const searchCommunitiesResult = await db.subreddit.findMany({
        where: {
          name: {
            contains: query,
          },
          NOT: {
            subscribers: {
              some: {
                userId,
              },
            },
          },
        },
        include: {
          _count: {
            select: {
              subscribers: true,
            },
          },
        },
        take: COMMUNITIES_SEARCH_RESULT,
      });

      return searchCommunitiesResult;
    }),
  moderatingCommunities: publicProcedure
    .input(
      z.object({
        creatorId: z.string().min(1),
        currentUserId: z.string().optional(),
      }),
    )
    .query(async (opts) => {
      const { creatorId, currentUserId } = opts.input;

      const moderatingCommunities = await db.subreddit.findMany({
        where: {
          creatorId,
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
          subscribers: {
            where: {
              userId: currentUserId,
            },
          },
        },
      });

      return moderatingCommunities;
    }),
  updateProfileImage: protectedProcedure
    .input(
      z.object({
        imageUrl: z.string().url(),
        communityId: z.string().min(1),
      }),
    )
    .mutation(async (opts) => {
      const { imageUrl, communityId } = opts.input;

      const { user } = opts.ctx;

      const community = await db.subreddit.findUnique({
        where: {
          id: communityId,
        },
        select: {
          id: true,
          creatorId: true,
          image: true,
        },
      });

      if (!community) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Community not found.",
        });
      }

      if (community.creatorId !== user.id) {
        throw new TRPCError({
          code: "FORBIDDEN",
          message: "You are not the creator of this community.",
        });
      }

      await db.subreddit.update({
        where: {
          id: communityId,
        },
        data: {
          image: imageUrl,
        },
        select: {
          id: true,
          creatorId: true,
          image: true,
        },
      });

      if (community.image) {
        const communityImageId = new URL(community.image).searchParams.get(
          "id",
        );

        await ImageKitImageBulkDeleter({
          fileIds: [communityImageId as string],
        });
      }

      return { message: "Profile image updated successfully", image: imageUrl };
    }),
});
