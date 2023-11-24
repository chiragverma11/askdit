import { getAuthSession } from "@/lib/auth";
import { db } from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const session = await getAuthSession();

    if (!session?.user) {
      return new Response("Unauthorized", { status: 401 });
    }

    const { communityName } = await request.json();

    const subredditExists = await db.subreddit.findFirst({
      where: {
        name: communityName,
      },
    });

    if (subredditExists) {
      return new Response("Subreddit already exists", { status: 409 });
    }

    const subreddit = await db.subreddit.create({
      data: {
        name: communityName,
        creatorId: session.user?.id,
      },
    });

    await db.subscription.create({
      data: {
        userId: session.user?.id,
        subredditId: subreddit.id,
      },
    });

    return new Response(subreddit.name);
  } catch (error) {
    console.log(error);
    return new Response("Could not create subreddit", { status: 500 });
  }
}
