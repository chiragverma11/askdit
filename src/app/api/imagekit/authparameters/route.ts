import { env } from "@/env.mjs";
import { getAuthSession } from "@/lib/auth";
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
