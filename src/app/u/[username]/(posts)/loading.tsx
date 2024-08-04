"use client";

import PostSkeleton from "@/components/PostSkeleton";
import { useFeedViewStore } from "@/store/feedViewStore";

export default function Loading() {
  const feedViewType = useFeedViewStore((state) => state.feedViewType);

  return (
    <ul className="space-y-1 pb-16 sm:space-y-2 md:space-y-3 lg:pb-0">
      {Array.from({ length: 4 }).map((_, index) => (
        <li key={index}>
          <PostSkeleton variant={feedViewType} />
        </li>
      ))}
    </ul>
  );
}
