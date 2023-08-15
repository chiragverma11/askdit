import AsideBar from "@/components/AsideBar";
import CreatePostInput from "@/components/CreatePostInput";
import { getAuthSession } from "@/lib/auth";
import { cn } from "@/lib/utils";
import React from "react";

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

export default page;
