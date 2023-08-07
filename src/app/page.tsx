import AsideBar from "@/components/AsideBar";
import { cn } from "@/lib/utils";
import React from "react";

const page = () => {
  return (
    <>
      <AsideBar />
      <div className="space-y-4 py-8">
        <Post />
        <Post className="bg-zinc-300" />
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
        "container h-[40vh] w-3/4 rounded-xl bg-zinc-400 py-4 text-center lg:h-[75vh] lg:w-1/2",
        className,
      )}
      {...props}
    >
      Post
    </div>
  );
};

export default page;
