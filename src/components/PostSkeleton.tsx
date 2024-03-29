import { FC } from "react";

import { FeedViewType } from "@/types/utilities";
import Skeleton, { SkeletonTheme } from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";

interface PostSkeletonProps {
  variant?: FeedViewType;
  disableAnimation?: boolean;
}

const PostSkeleton: FC<PostSkeletonProps> = ({
  variant = "card",
  disableAnimation = false,
}) => {
  if (variant === "card") {
    return <CardVariantPostSkeleton disableAnimation={disableAnimation} />;
  } else if (variant === "compact") {
    return <CompactVariantPostSkeleton disableAnimation={disableAnimation} />;
  }
};

const CardVariantPostSkeleton: FC<
  Pick<PostSkeletonProps, "disableAnimation">
> = ({ disableAnimation }) => {
  return (
    <SkeletonTheme
      baseColor="var(--skeleton-base)"
      highlightColor="var(--skeleton-highlight)"
      duration={2}
      inline={false}
      enableAnimation={!disableAnimation}
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

const CompactVariantPostSkeleton: FC<
  Pick<PostSkeletonProps, "disableAnimation">
> = ({ disableAnimation }) => {
  return (
    <SkeletonTheme
      baseColor="var(--skeleton-base)"
      highlightColor="var(--skeleton-highlight)"
      duration={2}
      inline={false}
      enableAnimation={!disableAnimation}
    >
      <div className="relative mx-auto flex w-full flex-col gap-2 border-b border-t border-default/25 bg-emphasis px-4 py-3 text-sm md:rounded-lg md:border lg:p-3 lg:hover:border-default/60">
        <div className="flex flex-row-reverse justify-between gap-2 md:flex-row md:justify-normal">
          <Skeleton
            className="relative flex aspect-[7/6] h-[4.25rem] shrink-0 items-center justify-center overflow-hidden rounded-md bg-highlight text-subtle md:h-24"
            borderRadius={"0.375rem"}
          />
          <div className="flex grow flex-col gap-1">
            <Skeleton
              className="text-xl font-medium"
              containerClassName="w-[95%]"
            />
            <Skeleton
              className="text-xl font-medium"
              containerClassName="w-1/2"
            />
            <div className="flex w-full items-center">
              <div className="z-[1] inline-flex items-center gap-2 rounded-lg">
                <Skeleton className="aspect-square h-7 w-7 rounded-md text-lg" />

                <div className="flex flex-col text-xs ">
                  <Skeleton className="font-semibold" width={"10rem"} />
                  <Skeleton className="font-semibold" width={"7rem"} />
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-2 text-xs font-semibold text-subtle dark:text-zinc-400">
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
