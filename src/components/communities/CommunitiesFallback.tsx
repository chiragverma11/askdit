"use client";

import AuthLink from "@/components/AuthLink";
import { buttonVariants } from "@/components/ui/Button";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { FC } from "react";
import Skeleton, { SkeletonTheme } from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";

interface HaveContentProps {
  type: "loading" | "unauthenticated";
}

interface HaveNoContentProps {
  type: "nocontent";
  parent: "YourCommunities" | "ExploreCommunities";
}

const CommunitiesFallback: FC<HaveContentProps | HaveNoContentProps> = (
  fallback,
) => {
  if (fallback.type === "nocontent") {
    return <NoContent parent={fallback.parent} />;
  } else if (fallback.type === "loading") {
    return <CommunitiesSkeleton />;
  } else {
    return <UnauthenticatedFallback />;
  }
};

const CommunitiesSkeleton = () => {
  return Array.from({ length: 4 }, () => "").map((_, index) => (
    <SkeletonTheme
      key={index}
      baseColor="var(--skeleton-base)"
      highlightColor="var(--skeleton-highlight)"
      duration={2}
      inline={false}
    >
      <div className="w-full rounded-xl border border-default/20 bg-emphasis px-4 py-4">
        <div className="flex w-full items-center justify-between">
          <div className="flex items-center gap-3">
            <Skeleton
              className="flex aspect-square h-10 w-10 text-2xl"
              circle={true}
            />
            <div className="flex flex-col -space-y-1">
              <Skeleton
                className="text-lg font-semibold md:text-xl"
                width={"7rem"}
              />
              <Skeleton className="text-xs text-subtle" width={"5rem"} />
            </div>
          </div>

          <Skeleton width={"4.75rem"} height={"2rem"} borderRadius={"0.5rem"} />
        </div>
      </div>
    </SkeletonTheme>
  ));
};

const UnauthenticatedFallback = () => {
  return (
    <div className="flex flex-col items-center gap-4 p-4">
      <p className="text-default">Sign In to explore & Join Communities</p>
      <AuthLink href="/sign-in" className={cn(buttonVariants({ size: "sm" }))}>
        {" "}
        Sign In
      </AuthLink>
    </div>
  );
};

const NoContent = ({
  parent,
}: {
  parent: "YourCommunities" | "ExploreCommunities";
}) => {
  if (parent === "YourCommunities") {
    return (
      <div className="flex flex-col items-center gap-2 p-4">
        <p className="text-default">
          You haven&apos;t joined any community yet
        </p>
        <p className="text-default">Click Explore to find communties</p>
      </div>
    );
  } else if (parent === "ExploreCommunities") {
    return (
      <div className="flex flex-col items-center gap-4 p-4">
        <p className="text-default">There are no commmunites to join.</p>
        <Link
          href="/communities/create"
          className={cn(
            buttonVariants({ size: "sm", variant: "outline" }),
            "rounded-lg",
          )}
        >
          Create One
        </Link>
      </div>
    );
  }
};

export default CommunitiesFallback;
