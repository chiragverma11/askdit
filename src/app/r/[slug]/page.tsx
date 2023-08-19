import AsideBar from "@/components/AsideBar";
import Post from "@/components/Post";
import { Button, buttonVariants } from "@/components/ui/Button";
import { getAuthSession } from "@/lib/auth";
import { db } from "@/lib/db";
import { cn } from "@/lib/utils";
import { Subreddit } from "@prisma/client";
import Link from "next/link";
import { notFound } from "next/navigation";
import { FC } from "react";
import { MdOutlinePostAdd } from "react-icons/md";

interface PageProps {
  params: {
    slug: string;
  };
}

const page: FC<PageProps> = async ({ params }) => {
  const { slug } = params;

  const session = await getAuthSession();

  const subreddit = await db.subreddit.findFirst({
    where: {
      name: slug,
    },
    include: {
      _count: {
        select: {
          subscribers: true,
        },
      },
      posts: {
        include: {
          author: true,
          votes: true,
          comments: true,
          subreddit: true,
        },
        orderBy: {
          createdAt: "desc",
        },
        take: 5,
      },
    },
  });

  if (!subreddit) return notFound();

  const isSubscribed = session?.user.id === subreddit.creatorId ? true : false;

  return (
    <>
      <AsideBar />
      <div className="flex w-full flex-col items-center justify-center px-4 py-8 pt-4">
        <div className="relative w-full lg:w-[600px]">
          <div className="mb-3 flex w-full flex-col justify-between gap-4 lg:mb-4 lg:flex-row">
            <div className="flex items-center justify-between px-4">
              <div className="flex items-center gap-3">
                <span className="flex aspect-square h-10 w-10 items-center justify-center rounded-full bg-amber-400 text-2xl font-bold text-zinc-950">
                  r/
                </span>
                <div className="flex flex-col">
                  <h1 className="text-lg font-semibold md:text-xl">
                    r/{subreddit.name}
                  </h1>
                  <p className="text-xs text-subtle lg:hidden">
                    {subreddit._count.subscribers}{" "}
                    {subreddit._count.subscribers > 1 ? "members" : "member"}
                  </p>
                </div>
              </div>
              <Button size={"sm"} className="lg:hidden">
                {isSubscribed ? "Joined" : "Join"}
              </Button>
            </div>

            {session?.user ? (
              <Link
                href={`/r/${subreddit.name}/submit`}
                className={cn(
                  buttonVariants({ variant: "ghost", size: "sm" }),
                  "flex w-fit items-center rounded-3xl  font-semibold",
                )}
              >
                <MdOutlinePostAdd className="mr-2 h-6 w-6" />
                Create a Post
              </Link>
            ) : null}
          </div>
          <div className="space-y-3">
            <Post />
            <Post />
            <Post />
            <Post />
          </div>
          <SideLink subreddit={subreddit} />
        </div>
      </div>
    </>
  );
};

const SideLink = ({ subreddit }: { subreddit: Subreddit }) => {
  return (
    <div className="fixed right-[-18rem] top-0 xl:block">
      <div className="flex flex-col gap-4 rounded-xl border border-default/25 px-4 py-4">
        <div>
          <p className="text-lg font-semibold">About r/{subreddit.name}</p>
        </div>
        <div className="flex flex-col items-center gap-4">
          <p className="w-56 text-sm">
            Your personal Askdit homepage. Come here to check in with your
            favourite communities.
          </p>
          <Link
            href="/submit"
            className={cn(buttonVariants(), "w-full text-white")}
          >
            Create a Post
          </Link>
          <Link
            href="/r/create"
            className={cn(buttonVariants({ variant: "outline" }), "w-full")}
          >
            Create a Community
          </Link>
        </div>
      </div>
    </div>
  );
};

export default page;
