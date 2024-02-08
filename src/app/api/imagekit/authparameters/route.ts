import { env } from "@/env.mjs";
import { getAuthSession } from "@/lib/auth";
import {
  DROPZONE_MAX_FILE_SIZE_IN_BYTES,
  STORAGE_LIMIT_PER_USER,
} from "@/lib/config";
import { db } from "@/lib/db";
import ImageKit from "imagekit";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const session = await getAuthSession();

    if (!session?.user) {
      return new Response(JSON.stringify({ message: "Unauthorized" }), {
        status: 401,
      });
    }

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
      return new Response(
        JSON.stringify({
          message: "Storage limit reached, can't upload more media",
        }),
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

    return new Response(JSON.stringify(authentcationParameters));
  } catch (error) {
    return new Response(
      JSON.stringify({
        success: 0,
      }),
    );
  }
}
