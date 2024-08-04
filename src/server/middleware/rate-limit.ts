import { TRPCError } from "@trpc/server";
import { type Redis } from "ioredis";
import { RateLimiterRedis, RateLimiterRes } from "rate-limiter-flexible";

export type RateLimitConfig = {
  fingerprint: string;
  maxRequests: number;
  windowMs: number;
  redisClient: Redis;
  message?: (hitInfo: number) => string;
};
export type RateLimitOptions = Record<string, RateLimitConfig>;

export const trpcRateLimitMiddleware = async (
  args: RateLimitConfig,
): Promise<void> => {
  const key = args.fingerprint;

  const rateLimiter = new RateLimiterRedis({
    storeClient: args.redisClient,
    keyPrefix: "rate_limit",
    points: args.maxRequests,
    duration: args.windowMs / 1000, // in seconds
  });

  try {
    await rateLimiter.consume(key); // Consume 1 point
  } catch (error) {
    if (error instanceof RateLimiterRes) {
      throw new TRPCError({
        code: "TOO_MANY_REQUESTS",
        message: args.message
          ? args.message(error.consumedPoints)
          : "Rate limit exceeded, try again later.",
      });
    }

    throw error;
  }
};

export const rateLimitMiddleware = async (
  args: RateLimitConfig,
): Promise<void> => {
  const key = args.fingerprint;

  const rateLimiter = new RateLimiterRedis({
    storeClient: args.redisClient,
    keyPrefix: "rate_limit",
    points: args.maxRequests,
    duration: args.windowMs / 1000, // in seconds
  });

  try {
    await rateLimiter.consume(key); // Consume 1 point
  } catch (error) {
    if (error instanceof RateLimiterRes) {
      throw new RateLimitError({
        message: args.message
          ? args.message(error.consumedPoints)
          : "Rate limit exceeded, try again later.",
        cause: error,
        retryAfter: Math.ceil(error.msBeforeNext / 1000),
      });
    }

    throw error;
  }
};

export const ipFingerprint = (req: Request | Record<any, any>) => {
  const forwarded =
    req instanceof Request
      ? req.headers.get("x-forwarded-for")
      : req.headers["x-forwarded-for"];
  const ip = forwarded
    ? (typeof forwarded === "string" ? forwarded : forwarded[0])?.split(/, /)[0]
    : (req as any)?.socket?.remoteAddress ?? null;

  return ip || "127.0.0.1";
};

export class RateLimitError extends Error {
  public readonly retryAfter?: number;

  constructor(opts: {
    message?: string;
    retryAfter?: number;
    cause?: unknown;
  }) {
    const cause = opts.cause;
    const message = opts.message ?? "Rate limit exceeded, try again later.";
    const retryAfter = opts.retryAfter;

    super(message, { cause });

    this.name = "RateLimitError";
    this.retryAfter = retryAfter;

    if (!this.cause) {
      if (cause instanceof Error) {
        this.cause = cause;
      }
    }
  }
}
