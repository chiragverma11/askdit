import { FC } from "react";
import Skeleton, { SkeletonTheme } from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";

interface PostSkeletonProps {}

const PostSkeleton: FC<PostSkeletonProps> = ({}) => {
  return (
    <SkeletonTheme
      baseColor="var(--skeleton-base)"
      highlightColor="var(--skeleton-highlight)"
      duration={2}
      inline={false}
    >
      <div className="relative mx-auto flex w-full flex-col gap-2 border-b border-t border-default/25 bg-emphasis px-4 py-3 text-sm md:rounded-3xl md:border lg:p-4 lg:hover:border-default/60">
        <div className="flex w-full items-center">
          <div className="inline-flex items-center gap-2">
            <Skeleton
              className="aspect-square h-6 w-6 text-2xl"
              circle={true}
            />
            <Skeleton className="text-base font-semibold" width={"12rem"} />
          </div>
        </div>
        <Skeleton className="text-2xl font-bold" width={"18rem"} />
        <Skeleton className="w-full text-xl font-bold" height={"10rem"} />
        <div className="flex items-center gap-2 text-xs font-semibold text-subtle dark:text-default">
          <Skeleton
            className="px-3 py-2"
            width={"16rem"}
            borderRadius={"1.5rem"}
          />
          <Skeleton
            className="px-3 py-2"
            width={"3rem"}
            borderRadius={"1.5rem"}
          />
        </div>
      </div>
    </SkeletonTheme>
  );
};

export default PostSkeleton;
