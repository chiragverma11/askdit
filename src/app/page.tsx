import Link from "next/link";
import React from "react";

import AsideBar from "@/components/AsideBar";
import CreatePostInput from "@/components/CreatePostInput";
import { buttonVariants } from "@/components/ui/Button";
import { getAuthSession } from "@/lib/auth";
import { cn } from "@/lib/utils";
import Post from "@/components/Post";

const IndexPage = async () => {
  const session = await getAuthSession();
  return (
    <>
      <AsideBar />
      <div className="flex w-full justify-center px-4 py-6 pt-4">
        <div className="relative w-full lg:w-[600px]">
          {session?.user ? (
            <CreatePostInput
              session={session}
              className="mb-4"
              href="/submit"
            />
          ) : null}
          <div className="space-y-3 pb-16 lg:pb-0">
            <Post />
            <Post />
            <Post />
            <Post />
          </div>
          {session?.user ? <SideLink /> : null}
        </div>
      </div>
    </>
  );
};

const SideLink = () => {
  return (
    <div className="absolute right-[-2rem] top-0 hidden justify-self-end xl:block">
      <div className="fixed flex flex-col gap-4 rounded-xl border border-default/40 bg-emphasis px-4 py-4">
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
            href="/communities/create"
            className={cn(
              buttonVariants({ variant: "outline" }),
              "w-full hover:bg-subtle/75",
            )}
          >
            Create a Community
          </Link>
        </div>
      </div>
    </div>
  );
};

export default IndexPage;
