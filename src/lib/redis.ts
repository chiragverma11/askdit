import { env } from "@/env.mjs";
import Redis from "ioredis";

const redisClientSingleton = () => {
  return new Redis(env.REDIS_URL, { enableOfflineQueue: false });
};

declare const globalThis: {
  redisGlobal: Redis;
} & typeof global;

export const redis = globalThis.redisGlobal ?? redisClientSingleton();

if (env.NODE_ENV !== "production") globalThis.redisGlobal = redis;
