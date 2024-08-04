import { USER_CACHE_KEY_PREFIX } from "@/lib/config";
import { db } from "@/lib/db";
import { redis } from "@/lib/redis";
import {
  getUsernameStatusValidator,
  updateProfileValidator,
} from "@/lib/validators/settings";
import { TRPCError } from "@trpc/server";
import { protectedProcedure, publicProcedure, router } from "../trpc";

export const settingsRouter = router({
  getUsernameStatus: publicProcedure
    .input(getUsernameStatusValidator)
    .query(async (opts) => {
      const { input } = opts;
      const { username } = input;

      const user = await db.user.findFirst({
        where: {
          username: {
            equals: username,
            mode: "insensitive",
          },
        },
        select: {
          id: true,
        },
      });

      return {
        usernameAvailable: user ? false : true,
        username: username,
      };
    }),
  updateProfile: protectedProcedure
    .input(updateProfileValidator)
    .mutation(async (opts) => {
      const { name, username } = opts.input;
      const { user } = opts.ctx;

      if (username) {
        const usernameStatus = await db.user.findFirst({
          where: {
            username: {
              equals: username,
              mode: "insensitive",
            },
          },
          select: {
            id: true,
          },
        });

        if (usernameStatus) {
          throw new TRPCError({
            code: "CONFLICT",
            message: "Username already taken.",
          });
        }
      }

      const updatedUser = await db.user.update({
        where: {
          id: user.id,
        },
        data: {
          name: name,
          username: username,
        },
        select: {
          id: true,
          username: true,
          name: true,
        },
      });

      await redis.del(`${USER_CACHE_KEY_PREFIX}${user.id}`);

      return {
        updatedUser,
      };
    }),
});
