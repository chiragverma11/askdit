import { env } from "@/env.mjs";
import ImageKit from "imagekit-javascript";

interface AuthenticationParametersResponse {
  token: string;
  expire: number;
  signature: string;
}

interface ImageKitImageUploaderProps {
  file: File;
  folder: string;
}

export async function ImageKitImageUploader({
  file,
  folder,
}: ImageKitImageUploaderProps) {
  try {
    const res = await fetch("/api/imagekit/authparameters", {
      method: "GET",
    });

    const authenticationParameters: AuthenticationParametersResponse =
      await res.json();

    const imagekit = new ImageKit({
      publicKey: env.NEXT_PUBLIC_IMAGEKIT_PUBLIC_KEY,
      urlEndpoint: env.NEXT_PUBLIC_IMAGEKIT_URL_ENDPOINT,
    });

    const result = await imagekit.upload({
      file: file,
      fileName: file.name,
      folder: folder,
      token: authenticationParameters.token,
      signature: authenticationParameters.signature,
      expire: authenticationParameters.expire,
    });
    return { success: 1, result };
  } catch (error) {
    console.log(error);
    return { success: 0, error };
  }
}
