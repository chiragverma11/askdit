import { db } from "@/lib/db";
import { protectedProcedure, publicProcedure, router } from "../trpc";
import { INFINITE_SCROLL_PAGINATION_RESULTS } from "@/lib/config";
import { z } from "zod";

export const notificationRouter = router({
  getUnreadCount: protectedProcedure.query(async (opts) => {
    const { user } = opts.ctx;
    const count = await db.notification.count({
      where: {
        userId: user.id,
        read: false,
      },
    });

    return count;
  }),
  getUnreadNotifications: protectedProcedure
    .input(
      z.object({
        limit: z.number().min(1),
        cursor: z.string().nullish(),
        skip: z.number().optional(),
      }),
    )
    .query(async (opts) => {
      const { user } = opts.ctx;
      const { input } = opts;
      const limit = input.limit ?? INFINITE_SCROLL_PAGINATION_RESULTS;
      const { skip, cursor } = input;

      const notifications = await db.notification.findMany({
        take: limit + 1,
        skip: skip,
        cursor: cursor ? { id: cursor } : undefined,
        where: {
          userId: user.id,
          // read: false,
        },
        orderBy: {
          createdAt: "desc",
        },
        include: {
          triggeredBy: {
            select: {
              username: true,
            },
          },
          post: {
            select: {
              subreddit: {
                select: {
                  id: true,
                  name: true,
                },
              },
            },
          },
        },
      });

      let nextCursor: typeof cursor | undefined = undefined;
      if (notifications.length > limit) {
        const nextItem = notifications.pop();
        nextCursor = nextItem?.id;
      }
      return {
        notifications,
        nextCursor,
      };
    }),
  markAllAsRead: protectedProcedure.mutation(async (opts) => {
    const { user } = opts.ctx;
    await db.notification.updateMany({
      where: {
        userId: user.id,
        read: false,
      },
      data: {
        read: true,
      },
    });

    return {
      success: true,
      message: "All notifications marked as read",
    };
  }),
  markAsRead: protectedProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async (opts) => {
      const { user } = opts.ctx;
      const { id } = opts.input;

      await db.notification.update({
        where: {
          id,
          userId: user.id,
        },
        data: {
          read: true,
        },
      });

      return {
        success: true,
        message: "Notification marked as read",
      };
    }),
});
