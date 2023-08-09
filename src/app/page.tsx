import AsideBar from "@/components/AsideBar";
import { cn } from "@/lib/utils";
import React from "react";

const page = () => {
  return (
    <>
      <AsideBar />
      <div className="space-y-4 py-8">
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
        "mx-auto h-[40vh] w-3/4 rounded-3xl bg-emphasis lg:h-[75vh] lg:w-1/2",
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
