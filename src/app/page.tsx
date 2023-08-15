import Link from "next/link";
import React from "react";

import AsideBar from "@/components/AsideBar";
import CreatePostInput from "@/components/CreatePostInput";
import { buttonVariants } from "@/components/ui/Button";
import { getAuthSession } from "@/lib/auth";
import { cn } from "@/lib/utils";

const page = async () => {
  const session = await getAuthSession();
  return (
    <>
      <AsideBar />
      <div className="container flex w-full justify-center py-6 pt-4">
        <div className="relative lg:w-[640px]">
          {session?.user ? <CreatePostInput session={session} /> : null}
          <div className="my-4 space-y-3">
            <Post />
            <Post />
            <Post />
            <Post />
          </div>
          <SideLink />
        </div>
      </div>
    </>
  );
};

interface PostProps extends React.HTMLAttributes<HTMLDivElement> {}

const Post = ({ className, ...props }: PostProps) => {
  return (
    <div
      className={cn(
        "mx-auto h-[40vh] rounded-3xl border border-default/25 bg-emphasis transition hover:border-default/60 lg:h-[65vh]",
        className,
      )}
      {...props}
    >
      <div className="px-6 py-8">
        <p className="text-xl font-semibold">This is a Post!</p>
      </div>
    </div>
  );
};

const SideLink = () => {
  return (
    <div className="absolute right-[-18rem] top-0 hidden justify-self-end xl:block">
      <div className="flex flex-col gap-4 rounded-xl border border-default/25 px-4 py-4">
        <div>
          <p className="text-lg font-semibold">Home</p>
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
