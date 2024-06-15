import { env } from "@/env.mjs";
import { getAuthSession } from "@/lib/auth";
import {
  DROPZONE_MAX_FILE_SIZE_IN_BYTES,
  STORAGE_LIMIT_PER_USER,
} from "@/lib/config";
import { db } from "@/lib/db";
import { redis } from "@/lib/redis";
import {
  RateLimitError,
  rateLimitMiddleware,
} from "@/server/middleware/rate-limit";
import ImageKit from "imagekit";
import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const session = await getAuthSession();

    if (!session?.user) {
      return NextResponse.json(
        { message: "Unauthorized" },
        {
          status: 401,
        },
      );
    }

    await rateLimitMiddleware({
      fingerprint: `imagekit:${session.user.id}`,
      maxRequests: 40,
      windowMs: 20 * 1000,
      redisClient: redis,
      message: (hits) =>
        `Too many requests, please try again later. ${hits} hits`,
    });

    const userWithStorageUsed = await db.user.findUnique({
      where: {
        id: session.user.id,
      },
      select: {
        storageUsed: true,
      },
    });

    if (
      userWithStorageUsed &&
      userWithStorageUsed.storageUsed + DROPZONE_MAX_FILE_SIZE_IN_BYTES >=
        STORAGE_LIMIT_PER_USER
    ) {
      return NextResponse.json(
        {
          message: "Storage limit reached, can't upload more media",
        },
        { status: 403 },
      );
    }

    const imagekit = new ImageKit({
      publicKey: env.IMAGEKIT_PUBLIC_KEY,
      privateKey: env.IMAGEKIT_PRIVATE_KEY,
      urlEndpoint: env.IMAGEKIT_URL_ENDPOINT,
    });

    // fetching authparameters like signature, token & expire time
    const authentcationParameters = imagekit.getAuthenticationParameters();

    return NextResponse.json(authentcationParameters);
  } catch (error) {
    if (error instanceof RateLimitError) {
      return NextResponse.json(
        {
          error: {
            code: "TOO_MANY_REQUESTS",
            message: error.message,
            retryAfter: error.retryAfter,
          },
        },
        { status: 429 },
      );
    }

    return NextResponse.json(
      {
        error: {
          code: "INTERNAL_SERVER_ERROR",
          message: "Something went wrong",
        },
      },
      { status: 500 },
    );
  }
}
