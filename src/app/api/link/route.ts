import { NextRequest } from "next/server";
import urlMetadata from "url-metadata";

export async function GET(req: NextRequest) {
  try {
    const url = new URL(req.url);

    const href = url.searchParams.get("url");

    if (!href) {
      return new Response("Invalid href", { status: 400 });
    }

    const metadata = await urlMetadata(href);

    return new Response(
      JSON.stringify({
        success: 1,
        meta: {
          title: metadata.title,
          description: metadata.description,
          image: { url: metadata["og:image"] },
        },
      }),
    );
  } catch (error) {
    return new Response(
      JSON.stringify({
        success: 0,
      }),
    );
  }
}
