"use client";

import Skeleton, { SkeletonTheme } from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";

const LoadingEditorOutput = () => {
  return (
    <SkeletonTheme
      baseColor="var(--skeleton-base)"
      highlightColor="var(--skeleton-highlight)"
      duration={2}
      inline={false}
    >
      <Skeleton className="text-sm" width={"50%"} />
      <Skeleton className="text-sm" width={"70%"} />
      <Skeleton className="w-full" height={"125px"} borderRadius={"0.5rem"} />
    </SkeletonTheme>
  );
};

export default LoadingEditorOutput;
