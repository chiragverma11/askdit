import { env } from "@/env.mjs";
import ImageKit from "imagekit";

/**
 * This function should only used be on server side
 */

interface ImageKitImageBulkDeleterProps {
  fileIds: string[];
}

export async function ImageKitImageBulkDeleter({
  fileIds,
}: ImageKitImageBulkDeleterProps) {
  try {
    const imagekit = new ImageKit({
      publicKey: env.IMAGEKIT_PUBLIC_KEY,
      privateKey: env.IMAGEKIT_PRIVATE_KEY,
      urlEndpoint: env.IMAGEKIT_URL_ENDPOINT,
    });

    const result = await imagekit.bulkDeleteFiles(fileIds);
    return { success: 1, result };
  } catch (error) {
    console.log(error);
    return { success: 0, error };
  }
}
