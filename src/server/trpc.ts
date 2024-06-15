import { getAuthSession } from "@/lib/auth";
import { redis } from "@/lib/redis";
import { TRPCError, initTRPC } from "@trpc/server";
import superjson from "superjson";
import { Context } from "./context";
import {
  ipFingerprint,
  trpcRateLimitMiddleware,
} from "./middleware/rate-limit";

const t = initTRPC.context<Context>().create({
  transformer: superjson,
});

export const router = t.router;
export const middleware = t.middleware;

// to check if user is authenticated
const isAuth = middleware(async (opts) => {
  const session = await getAuthSession();

  if (!session?.user.id) {
    throw new TRPCError({ code: "UNAUTHORIZED" });
  }

  const user = session?.user;

  return opts.next({ ctx: { user } });
});

const ipRateLimiter = middleware(async (opts) => {
  const fp = ipFingerprint(opts.ctx.req);

  await trpcRateLimitMiddleware({
    fingerprint: fp,
    maxRequests: 40,
    windowMs: 20 * 1000,
    redisClient: redis,
    message: (hits) =>
      `Too many requests, please try again later. ${hits} hits`,
  });

  return opts.next();
});

const authenticatedRateLimiter = middleware(async (opts) => {
  const ip = ipFingerprint(opts.ctx.req);
  const userId = opts.ctx.user?.id;
  const fp = userId ? `${ip}:${userId}` : ip;

  trpcRateLimitMiddleware({
    fingerprint: fp,
    maxRequests: 70,
    windowMs: 20 * 1000,
    redisClient: redis,
    message: (hits) =>
      `Too many requests, please try again later. ${hits} hits`,
  });

  return opts.next();
});

export const publicProcedure = t.procedure.use(ipRateLimiter);
export const protectedProcedure = t.procedure
  .use(isAuth)
  .use(authenticatedRateLimiter);
